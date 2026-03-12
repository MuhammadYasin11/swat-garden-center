from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi import status
from pydantic import BaseModel
import io
import os
import shutil

import pandas as pd

from app.auth import get_admin_user
from app.credentials import verify_admin_password, set_admin_password
from app.models import User, PlantSchema, PlantDeleteSchema, ToolSchema, ToolEditSchema, ToolDeleteSchema
from app.orders import OrderManager
from app.recommender import PlantRecommender
from app.sales import PhysicalSalesManager
from app.tools import ToolManager

app = FastAPI(title="Swat Garden Center AI")

# Ensure uploads directory exists
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Configure CORS to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows ANY website to talk to your API safely
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

recommender = PlantRecommender()
order_manager = OrderManager()
tool_manager = ToolManager()
sales_manager = PhysicalSalesManager()

# ======================================================
# Authentication Route
# ======================================================

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username == "admin" and verify_admin_password(form_data.password):
        return {"access_token": "admin_token", "token_type": "bearer"}
    if form_data.username == "customer" and form_data.password == "customer123":
        return {"access_token": "customer_token", "token_type": "bearer"}

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )


class ChangePasswordSchema(BaseModel):
    current_password: str
    new_password: str


@app.put("/admin/change-password")
def change_admin_password(
    body: ChangePasswordSchema,
    admin: User = Depends(get_admin_user),
):
    """Allow admin to change the admin panel password. Requires current password."""
    if not verify_admin_password(body.current_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect.",
        )
    if len(body.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters.",
        )
    set_admin_password(body.new_password)
    return {"message": "Password changed successfully."}


# ======================================================
# User Recommendation Input
# ======================================================

class UserPreference(BaseModel):
    category: str
    Type: str
    light_requirement: str
    maintenance_level: str
    growth_rate: str
    water_frequency: str
    temp_min: int
    temp_max: int
    price: int


# ======================================================
# Plant Filtering Input
# ======================================================

class PlantFilter(BaseModel):
    category: str = None
    Type: str = None
    max_price: int = None


# ======================================================
# Home Route
# ======================================================

@app.get("/")
def home():
    return {"message": "Welcome to Swat Garden Center AI 🌿"}


# ======================================================
# Recommendation Route
# ======================================================

@app.post("/recommend")
def recommend_plants(user: UserPreference):

    recommendations = recommender.recommend(user.dict())

    return {"recommended_plants": recommendations}


# ======================================================
# Plant Catalog Route
# ======================================================

@app.get("/plants")
def get_all_plants():

    cols = ["plant_name", "category", "Type", "price", "stock_quantity", "expert_score", "image_url"]
    for c in ["light_requirement", "maintenance_level", "water_frequency"]:
        if c in recommender.df.columns:
            cols.append(c)
    plants = recommender.df[[c for c in cols if c in recommender.df.columns]].to_dict(orient="records")

    return {"plants": plants}


# ======================================================
# Filtering Route
# ======================================================

@app.post("/filter")
def filter_plants(filters: PlantFilter):

    df = recommender.df.copy()

    if filters.category:
        df = df[df["category"] == filters.category.lower()]

    if filters.Type:
        df = df[df["Type"] == filters.Type.lower()]

    if filters.max_price:
        df = df[df["price"] <= filters.max_price]

    results = df[
        ["plant_name", "category", "Type", "price", "image_url"]
    ].to_dict(orient="records")

    return {"filtered_plants": results}


# ======================================================
# Admin Management Routes
# ======================================================

@app.post("/admin/plants/add")
async def add_plant(
    plant_name: str = Form(...),
    category: str = Form(...),
    Type: str = Form(...),
    light_requirement: str = Form(...),
    water_frequency: str = Form(...),
    maintenance_level: str = Form(...),
    growth_rate: str = Form(...),
    temp_min: int = Form(...),
    temp_max: int = Form(...),
    price: int = Form(...),
    stock_quantity: int = Form(...),
    expert_score: float = Form(...),
    image: UploadFile = File(None),
    admin: User = Depends(get_admin_user) # Logic: No Admin Token = No Entry
):
    try:
        image_url = ""
        if image and image.filename:
            file_path = f"uploads/{image.filename}"
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            image_url = f"https://swat-garden-center.onrender.com/uploads/{image.filename}"

        plant_dict = {
            "plant_name": plant_name,
            "category": category,
            "Type": Type,
            "light_requirement": light_requirement,
            "water_frequency": water_frequency,
            "maintenance_level": maintenance_level,
            "growth_rate": growth_rate,
            "temp_min": temp_min,
            "temp_max": temp_max,
            "price": price,
            "stock_quantity": stock_quantity,
            "expert_score": expert_score,
            "image_url": image_url
        }
        recommender.add_plant(plant_dict)
        return {"message": f"Plant {plant_name} added successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/admin/plants/delete")
async def delete_plant(
    request: PlantDeleteSchema, 
    admin: User = Depends(get_admin_user) # Logic: No Admin Token = No Entry
):
    try:
        recommender.delete_plant(request.plant_name)
        return {"message": f"Plant {request.plant_name} deleted successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/admin/plants/edit")
async def edit_plant_endpoint(
    original_plant_name: str = Form(...),
    plant_name: str = Form(...),
    category: str = Form(...),
    Type: str = Form(...),
    light_requirement: str = Form(...),
    water_frequency: str = Form(...),
    maintenance_level: str = Form(...),
    growth_rate: str = Form(...),
    temp_min: int = Form(...),
    temp_max: int = Form(...),
    price: int = Form(...),
    stock_quantity: int = Form(...),
    expert_score: float = Form(...),
    image: UploadFile = File(None),
    admin: User = Depends(get_admin_user)
):
    try:
        updated_data = {
            "plant_name": plant_name,
            "category": category,
            "Type": Type,
            "light_requirement": light_requirement,
            "water_frequency": water_frequency,
            "maintenance_level": maintenance_level,
            "growth_rate": growth_rate,
            "temp_min": temp_min,
            "temp_max": temp_max,
            "price": price,
            "stock_quantity": stock_quantity,
            "expert_score": expert_score,
        }
        
        if image and image.filename:
            file_path = f"uploads/{image.filename}"
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            updated_data["image_url"] = f"https://swat-garden-center.onrender.com/uploads/{image.filename}"

        recommender.edit_plant(original_plant_name, updated_data)
        return {"message": f"Plant {plant_name} updated successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/categories")
def get_categories():
    try:
        # Get unique categories and return them sorted
        categories = sorted(recommender.df["category"].dropna().unique().tolist())
        return {"categories": categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/retrain")
def retrain_ai(admin: User = Depends(get_admin_user)):
    try:
        recommender.prepare_data()
        return {"message": "AI model retrained successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/plants/bulk-import")
async def bulk_import_plants(
    file: UploadFile = File(...),
    admin: User = Depends(get_admin_user)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
        
    try:
        contents = await file.read()
        df_new = pd.read_csv(io.StringIO(contents.decode("utf-8")))
        
        # Validate required columns roughly
        if "plant_name" not in df_new.columns:
            raise ValueError("CSV must contain a 'plant_name' column.")
            
        # Merge with existing
        recommender.df = pd.concat([recommender.df, df_new], ignore_index=True)
        recommender.df.drop_duplicates(subset=["plant_name"], keep="last", inplace=True)
        
        # Save to csv
        recommender.df.to_csv("data/plants.csv", index=False)
        
        # Re-run prep
        recommender.prepare_data()
        
        return {"message": f"Successfully imported {len(df_new)} plants."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process CSV: {str(e)}")

# ======================================================
# Order Management Routes
# ======================================================

class OrderCreateSchema(BaseModel):
    first_name: str
    last_name: str
    whatsapp: str
    email: str
    address: str
    total_amount: int
    items: str

@app.post("/checkout")
def checkout_order(order: OrderCreateSchema):
    try:
        order_id = order_manager.create_order(order.dict())
        return {"message": "Order placed successfully", "order_id": order_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/orders")
def get_orders(admin: User = Depends(get_admin_user)):
    try:
        orders = order_manager.get_all_orders()
        return {"orders": orders}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class OrderStatusUpdateSchema(BaseModel):
    order_id: str
    status: str

@app.put("/admin/orders/status")
def update_order_status(request: OrderStatusUpdateSchema, admin: User = Depends(get_admin_user)):
    try:
        success = order_manager.update_status(request.order_id, request.status)
        if success:
            return {"message": "Order status updated."}
        else:
            raise HTTPException(status_code=404, detail="Order not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/admin/orders/{order_id}")
def delete_order(order_id: str, admin: User = Depends(get_admin_user)):
    try:
        success = order_manager.delete_order(order_id)
        if success:
            return {"message": f"Order {order_id} deleted successfully."}
        else:
            raise HTTPException(status_code=404, detail="Order not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/metrics")
def get_metrics(admin: User = Depends(get_admin_user)):
    try:
        total_plants = len(recommender.df)
        
        tools = tool_manager.get_all_tools()
        total_tools = len(tools)
        
        low_stock_df = recommender.df[recommender.df["stock_quantity"] < 10]
        low_stock = low_stock_df[["plant_name", "stock_quantity", "image_url"]].to_dict(orient="records")
        
        orders = order_manager.get_all_orders()
        total_orders = len(orders)
        
        total_revenue = sum(float(o.get("total_amount", 0)) for o in orders if str(o.get("total_amount", "0")).isdigit())
        
        return {
            "total_plants": total_plants,
            "total_tools": total_tools,
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "low_stock": low_stock
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ======================================================
# Gardening Tools Routes (Admin & Public)
# ======================================================

@app.get("/tools", response_model=dict)
async def get_all_tools():
    """Retrieve all gardening tools for the catalog."""
    tools = tool_manager.get_all_tools()
    return {"tools": tools}

@app.post("/admin/tools", response_model=dict)
async def add_tool(
    name: str = Form(...),
    category: str = Form(...),
    type: str = Form(...),
    price: int = Form(...),
    stock_quantity: int = Form(...),
    expert_score: float = Form(...),
    image: UploadFile = File(None),
    user: User = Depends(get_admin_user)
):
    """Admin route to manually add a new gardening tool."""
    try:
        tool_data = {
            "name": name,
            "category": category,
            "type": type,
            "price": price,
            "stock_quantity": stock_quantity,
            "expert_score": expert_score,
            "image_url": ""
        }

        if image and image.filename:
            file_path = f"uploads/{image.filename}"
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            tool_data["image_url"] = f"https://swat-garden-center.onrender.com/uploads/{image.filename}"
        
        success, message = tool_manager.add_tool(tool_data)
        if not success:
            raise HTTPException(status_code=400, detail=message)
            
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/admin/tools/edit", response_model=dict)
async def edit_tool(
    original_tool_name: str = Form(...),
    name: str = Form(...),
    category: str = Form(...),
    type: str = Form(...),
    price: int = Form(...),
    stock_quantity: int = Form(...),
    expert_score: float = Form(...),
    image: UploadFile = File(None),
    user: User = Depends(get_admin_user)
):
    """Admin route to edit an existing tool."""
    try:
        updated_data = {
            "name": name,
            "category": category,
            "type": type,
            "price": price,
            "stock_quantity": stock_quantity,
            "expert_score": expert_score
        }

        if image and image.filename:
            file_path = f"uploads/{image.filename}"
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
            updated_data["image_url"] = f"https://swat-garden-center.onrender.com/uploads/{image.filename}"

        success, message = tool_manager.edit_tool(original_tool_name, updated_data)
        if not success:
            raise HTTPException(status_code=400, detail=message)
            
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/admin/tools/{tool_name}", response_model=dict)
async def delete_tool(tool_name: str, user: User = Depends(get_admin_user)):
    """Admin route to delete a tool."""
    success, message = tool_manager.delete_tool(tool_name)
    if not success:
        raise HTTPException(status_code=400, detail=message)
    return {"message": message}

@app.post("/admin/tools/bulk-import")
async def bulk_import_tools(
    file: UploadFile = File(...),
    admin: User = Depends(get_admin_user)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
        
    try:
        contents = await file.read()
        df_new = pd.read_csv(io.StringIO(contents.decode("utf-8")))
        
        # Validate required columns roughly
        if "name" not in df_new.columns:
            raise ValueError("CSV must contain a 'name' column for tools.")
            
        success, message = tool_manager.bulk_import_tools(df_new)
        if not success:
            raise HTTPException(status_code=400, detail=message)
            
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process Tools CSV: {str(e)}")

# ======================================================
# Physical Sales Routes
# ======================================================

class PhysicalSaleCreateSchema(BaseModel):
    date: str
    total_sale: float
    expense: float = 0.0
    description: str = ""

@app.get("/admin/physical-sales")
def get_physical_sales(admin: User = Depends(get_admin_user)):
    try:
        sales = sales_manager.get_all_sales()
        return {"sales": sales}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/physical-sales")
def add_physical_sale(sale: PhysicalSaleCreateSchema, admin: User = Depends(get_admin_user)):
    try:
        success, message = sales_manager.add_sale(sale.dict())
        if not success:
            raise HTTPException(status_code=400, detail=message)
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/admin/physical-sales/{sale_id}")
def update_physical_sale(sale_id: str, sale: PhysicalSaleCreateSchema, admin: User = Depends(get_admin_user)):
    try:
        success, message = sales_manager.update_sale(sale_id, sale.dict())
        if not success:
            raise HTTPException(status_code=404, detail=message)
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/admin/physical-sales/{sale_id}")
def delete_physical_sale(sale_id: str, admin: User = Depends(get_admin_user)):
    try:
        success, message = sales_manager.delete_sale(sale_id)
        if not success:
            raise HTTPException(status_code=404, detail=message)
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/admin/physical-sales/export")
def export_physical_sales(admin: User = Depends(get_admin_user)):
    try:
        # Exporting the CSV directly since it contains the exact format
        file_path = "data/physical_sales.csv"
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="No physical sales data found.")
        return FileResponse(file_path, media_type='text/csv', filename=f"physical_sales_{datetime.now().strftime('%Y%m%d')}.csv")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
