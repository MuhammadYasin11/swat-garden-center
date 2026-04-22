import io
import os
import shutil
import hashlib
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import pandas as pd
from sqlalchemy.orm import Session

from app.auth import get_admin_user
from app.schemas import User, PlantSchema, PlantDeleteSchema, ToolSchema, ToolEditSchema, ToolDeleteSchema
from app.database import engine, get_db, SessionLocal
from app import models
from app.orders import OrderManager
from app.recommender import PlantRecommender
from app.sales import PhysicalSalesManager
from app.tools import ToolManager

app = FastAPI(title="Swat Garden Center AI")

recommender = PlantRecommender()
order_manager = OrderManager()
tool_manager = ToolManager()
sales_manager = PhysicalSalesManager()

@app.on_event("startup")
def startup_event():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        recommender.load_from_db(db)
    finally:
        db.close()

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    if form_data.username == "admin":
        user = db.query(models.User).filter_by(username="admin").first()
        if user:
            pwd_hash = hashlib.sha256(form_data.password.encode("utf-8")).hexdigest()
            if user.password_hash == pwd_hash:
                return {"access_token": "admin_token", "token_type": "bearer"}

    if form_data.username == "customer" and form_data.password == "customer123":
        return {"access_token": "customer_token", "token_type": "bearer"}

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

class ChangePasswordSchema(BaseModel):
    current_password: str
    new_password: str

@app.put("/admin/change-password")
def change_admin_password(body: ChangePasswordSchema, admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    user = db.query(models.User).filter_by(username="admin").first()
    if not user: raise HTTPException(status_code=404, detail="Admin user not found.")
        
    current_hash = hashlib.sha256(body.current_password.encode("utf-8")).hexdigest()
    if user.password_hash != current_hash: raise HTTPException(status_code=400, detail="Current password is incorrect.")
    if len(body.new_password) < 6: raise HTTPException(status_code=400, detail="New password must be at least 6 characters.")
        
    user.password_hash = hashlib.sha256(body.new_password.encode("utf-8")).hexdigest()
    db.commit()
    return {"message": "Password changed successfully."}

class UserPreference(BaseModel):
    category: str
    type: str
    light_requirement: str
    maintenance_level: str
    growth_rate: str
    water_frequency: str
    temp_min: int
    temp_max: int
    price: int

class PlantFilter(BaseModel):
    category: str = None
    type: str = None
    max_price: int = None

@app.get("/")
def home(): return {"message": "Welcome to Swat Garden Center AI 🌿"}

@app.post("/recommend")
def recommend_plants(user: UserPreference):
    return {"recommended_plants": recommender.recommend(user.dict())}

@app.get("/plants")
def get_all_plants():
    cols = ["name", "category", "type", "price", "stock_quantity", "expert_score", "image_url", "light_requirement", "maintenance_level", "water_frequency"]
    valid_cols = [c for c in cols if c in recommender.df.columns]
    return {"plants": recommender.df[valid_cols].to_dict(orient="records") if not recommender.df.empty else []}

@app.post("/filter")
def filter_plants(filters: PlantFilter):
    df = recommender.df.copy()
    if not df.empty:
        if filters.category: df = df[df["category"] == filters.category.lower()]
        if filters.type: df = df[df["type"] == filters.type.lower()]
        if filters.max_price: df = df[df["price"] <= filters.max_price]
        results = df[["name", "category", "type", "price", "image_url"]].to_dict(orient="records")
    else: results = []
    return {"filtered_plants": results}

@app.post("/admin/plants/add")
async def add_plant(
    name: str = Form(...), category: str = Form(...), type: str = Form(...),
    light_requirement: str = Form(...), water_frequency: str = Form(...),
    maintenance_level: str = Form(...), growth_rate: str = Form(...),
    temp_min: int = Form(...), temp_max: int = Form(...),
    price: int = Form(...), stock_quantity: int = Form(...),
    expert_score: float = Form(...), image: UploadFile = File(None),
    admin: User = Depends(get_admin_user), db: Session = Depends(get_db)
):
    try:
        image_url = "placeholder.png"
        if image and image.filename:
            file_path = f"uploads/{image.filename}"
            with open(file_path, "wb") as buffer: shutil.copyfileobj(image.file, buffer)
            image_url = f"https://swat-garden-center.onrender.com/uploads/{image.filename}"

        plant = models.Plant(
            name=name, category=category, type=type,
            light_requirement=light_requirement, water_frequency=water_frequency,
            maintenance_level=maintenance_level, growth_rate=growth_rate,
            temp_min=temp_min, temp_max=temp_max, price=price, stock=stock_quantity,
            ai_score=expert_score, image_url=image_url
        )
        db.add(plant)
        db.commit()
        recommender.load_from_db(db)
        return {"message": f"Plant {name} added successfully."}
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@app.delete("/admin/plants/delete")
async def delete_plant(request: PlantDeleteSchema, admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    try:
        plant = db.query(models.Plant).filter_by(name=request.name).first()
        if plant:
            db.delete(plant)
            db.commit()
            recommender.load_from_db(db)
        return {"message": f"Plant {request.name} deleted successfully."}
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@app.put("/admin/plants/edit")
async def edit_plant_endpoint(
    original_name: str = Form(...), name: str = Form(...),
    category: str = Form(...), type: str = Form(...),
    light_requirement: str = Form(...), water_frequency: str = Form(...),
    maintenance_level: str = Form(...), growth_rate: str = Form(...),
    temp_min: int = Form(...), temp_max: int = Form(...),
    price: int = Form(...), stock_quantity: int = Form(...),
    expert_score: float = Form(...), image: UploadFile = File(None),
    admin: User = Depends(get_admin_user), db: Session = Depends(get_db)
):
    try:
        plant = db.query(models.Plant).filter_by(name=original_name).first()
        if not plant: raise HTTPException(status_code=404, detail="Plant not found")

        plant.name = name
        plant.category = category; plant.type = type; plant.light_requirement = light_requirement
        plant.water_frequency = water_frequency; plant.maintenance_level = maintenance_level
        plant.growth_rate = growth_rate; plant.temp_min = temp_min; plant.temp_max = temp_max
        plant.price = price; plant.stock = stock_quantity; plant.ai_score = expert_score
        
        if image and image.filename:
            file_path = f"uploads/{image.filename}"
            with open(file_path, "wb") as buffer: shutil.copyfileobj(image.file, buffer)
            plant.image_url = f"https://swat-garden-center.onrender.com/uploads/{image.filename}"

        db.commit()
        recommender.load_from_db(db)
        return {"message": f"Plant {name} updated successfully."}
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/categories")
def get_categories():
    if recommender.df.empty: return {"categories": []}
    return {"categories": sorted(recommender.df["category"].dropna().unique().tolist())}

@app.post("/admin/retrain")
def retrain_ai(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    recommender.load_from_db(db)
    return {"message": "AI model retrained successfully."}

@app.post("/admin/plants/bulk-import")
async def bulk_import_plants(file: UploadFile = File(...), admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    if not file.filename.endswith((".xlsx", ".xls")): raise HTTPException(status_code=400, detail="Only Excel allowed.")
    try:
        contents = await file.read()
        df_new = pd.read_excel(io.BytesIO(contents))
        df_new.dropna(axis=1, how='all', inplace=True)
        valid_cols = [c for c in df_new.columns if not str(c).lower().strip().startswith('unnamed')]
        df_new = df_new[valid_cols]
        df_new.columns = [str(c).strip().lower() for c in df_new.columns]
        
        header_map = {
            "plant_name": "name", "title": "name", "ai score": "expert_score",
            "score": "expert_score", "ai_score": "expert_score", "qty": "stock_quantity",
            "stock": "stock_quantity", "inventory": "stock_quantity"
        }
        df_new.rename(columns=header_map, inplace=True)
        
        if "stock_quantity" not in df_new.columns and len(df_new.columns) > 4: df_new.rename(columns={df_new.columns[4]: "stock_quantity"}, inplace=True)
        if "expert_score" not in df_new.columns and len(df_new.columns) > 5: df_new.rename(columns={df_new.columns[5]: "expert_score"}, inplace=True)
        if "name" not in df_new.columns: raise ValueError("Invalid Excel format. required 'name' missing.")
            
        skipped_count, added_count = 0, 0
        for _, row in df_new.iterrows():
            try:
                name = str(row.get("name", "")).strip()
                if not name or name == "Unknown": raise ValueError("Missing name")
                stock = int(float(str(row.get("stock_quantity", 0)).strip() or 0))
                score = float(str(row.get("expert_score", 0.0)).strip() or 0.0)
                
                plant = db.query(models.Plant).filter_by(name=name).first()
                if not plant:
                    plant = models.Plant(name=name)
                    db.add(plant)
                    
                plant.category = str(row.get("category", "")).lower()
                plant.type = str(row.get("type", "")).lower()
                plant.light_requirement = str(row.get("light_requirement", ""))
                plant.water_frequency = str(row.get("water_frequency", ""))
                try: plant.temp_min = int(row.get("temp_min", 0))
                except: pass
                try: plant.temp_max = int(row.get("temp_max", 0))
                except: pass
                plant.maintenance_level = str(row.get("maintenance_level", ""))
                plant.growth_rate = str(row.get("growth_rate", ""))
                try: plant.price = float(row.get("price", 0))
                except: pass
                plant.stock = stock
                plant.ai_score = score
                added_count += 1
            except Exception: skipped_count += 1
                
        db.commit()
        recommender.load_from_db(db)
        msg = f"Uploaded {added_count} plants successfully."
        if skipped_count > 0: msg += f" (Note: {skipped_count} rows skipped due to errors)."
        return {"message": msg}
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

class OrderCreateSchema(BaseModel):
    first_name: str; last_name: str; whatsapp: str; email: str; address: str; total_amount: int; items: str

@app.post("/checkout")
def checkout_order(order: OrderCreateSchema, db: Session = Depends(get_db)):
    try: return {"message": "Order placed successfully", "order_id": order_manager.create_order(db, order.dict())}
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/orders")
def get_orders(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    return {"orders": order_manager.get_all_orders(db)}

class OrderStatusUpdateSchema(BaseModel):
    order_id: str; status: str

@app.put("/admin/orders/status")
def update_order_status(request: OrderStatusUpdateSchema, admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    if order_manager.update_status(db, request.order_id, request.status): return {"message": "Order status updated."}
    raise HTTPException(status_code=404, detail="Order not found")

@app.delete("/admin/orders/{order_id}")
def delete_order(order_id: str, admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    if order_manager.delete_order(db, order_id): return {"message": f"Order {order_id} deleted."}
    raise HTTPException(status_code=404, detail="Order not found")

@app.get("/admin/metrics")
def get_metrics(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    try:
        total_plants = db.query(models.Plant).count()
        tools = tool_manager.get_all_tools(db)
        orders = order_manager.get_all_orders(db)
        low_stock_query = db.query(models.Plant).filter(models.Plant.stock < 10).all()
        low_stock = [{"name": p.name, "stock_quantity": p.stock, "image_url": (p.image_url.strip() if p.image_url.strip() else "placeholder.png") if getattr(p, 'image_url', None) else "placeholder.png"} for p in low_stock_query]
        total_revenue = db.query(models.Order).with_entities(models.func.sum(models.Order.total_amount)).scalar() or 0.0
        
        return {
            "total_plants": total_plants, "total_tools": len(tools), "total_orders": len(orders),
            "total_revenue": total_revenue, "low_stock": low_stock
        }
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

@app.get("/tools")
async def get_all_tools(db: Session = Depends(get_db)):
    return {"tools": tool_manager.get_all_tools(db)}

@app.post("/admin/tools")
async def add_tool(
    name: str = Form(...), category: str = Form(...), type: str = Form(...),
    price: int = Form(...), stock_quantity: int = Form(...), expert_score: float = Form(...),
    image: UploadFile = File(None), user: User = Depends(get_admin_user), db: Session = Depends(get_db)
):
    success, message = tool_manager.add_tool(db, {"name": name, "category": category, "price": price, "stock_quantity": stock_quantity})
    if not success: raise HTTPException(status_code=400, detail=message)
    return {"message": message}

@app.put("/admin/tools/edit")
async def edit_tool(
    original_tool_name: str = Form(...), name: str = Form(...), category: str = Form(...),
    type: str = Form(...), price: int = Form(...), stock_quantity: int = Form(...),
    expert_score: float = Form(...), image: UploadFile = File(None),
    user: User = Depends(get_admin_user), db: Session = Depends(get_db)
):
    success, message = tool_manager.edit_tool(db, original_tool_name, {"name": name, "category": category, "price": price, "stock_quantity": stock_quantity})
    if not success: raise HTTPException(status_code=400, detail=message)
    return {"message": message}

@app.delete("/admin/tools/{tool_name}")
async def delete_tool(tool_name: str, user: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    success, message = tool_manager.delete_tool(db, tool_name)
    if not success: raise HTTPException(status_code=400, detail=message)
    return {"message": message}

@app.post("/admin/tools/bulk-import")
async def bulk_import_tools(file: UploadFile = File(...), admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    if not file.filename.endswith((".xlsx", ".xls")): raise HTTPException(status_code=400, detail="Only Excel files allowed.")
    try:
        contents = await file.read()
        df_new = pd.read_excel(io.BytesIO(contents))
        df_new.dropna(axis=1, how='all', inplace=True)
        valid_cols = [c for c in df_new.columns if not str(c).lower().strip().startswith('unnamed')]
        df_new = df_new[valid_cols]
        df_new.columns = [str(c).strip().lower() for c in df_new.columns]
        header_map = {"title": "name", "qty": "stock_quantity", "stock": "stock_quantity"}
        df_new.rename(columns=header_map, inplace=True)
        if "name" not in df_new.columns: raise ValueError("Required 'name' missing.")
        success, message = tool_manager.bulk_import_tools(db, df_new)
        if not success: raise HTTPException(status_code=400, detail=message)
        return {"message": message}
    except Exception as e: raise HTTPException(status_code=500, detail=str(e))

class PhysicalSaleCreateSchema(BaseModel):
    date: str; total_sale: float; expense: float = 0.0; description: str = ""

@app.get("/admin/physical-sales")
def get_physical_sales(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    return {"sales": sales_manager.get_all_sales(db)}

@app.post("/admin/physical-sales")
def add_physical_sale(sale: PhysicalSaleCreateSchema, admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    success, message = sales_manager.add_sale(db, sale.dict())
    if not success: raise HTTPException(status_code=400, detail=message)
    return {"message": message}

@app.put("/admin/physical-sales/{sale_id}")
def update_physical_sale(sale_id: str, sale: PhysicalSaleCreateSchema, admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    success, message = sales_manager.update_sale(db, sale_id, sale.dict())
    if not success: raise HTTPException(status_code=404, detail=message)
    return {"message": message}

@app.delete("/admin/physical-sales/{sale_id}")
def delete_physical_sale(sale_id: str, admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    success, message = sales_manager.delete_sale(db, sale_id)
    if not success: raise HTTPException(status_code=404, detail=message)
    return {"message": message}

@app.get("/admin/physical-sales/export")
def export_physical_sales(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    try:
        import uuid
        file_path = f"uploads/export_{uuid.uuid4().hex}.csv"
        df = pd.read_sql_table("physical_sales", engine)
        df.to_csv(file_path, index=False)
        return FileResponse(file_path, media_type='text/csv', filename=f"physical_sales_{datetime.now().strftime('%Y%m%d')}.csv")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
