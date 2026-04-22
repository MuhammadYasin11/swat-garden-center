import os
import json
import pandas as pd
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models

def get_or_create_user(db: Session):
    cred_file = 'data/admin_credentials.json'
    if not os.path.exists(cred_file):
        print(f"Skipping credentials. {cred_file} not found.")
        return
        
    with open(cred_file, 'r') as f:
        data = json.load(f)
        
    pwd_hash = data.get("password_hash")
    if not pwd_hash:
        return
        
    user = db.query(models.User).filter_by(username="admin").first()
    if not user:
        new_user = models.User(username="admin", password_hash=pwd_hash, role="admin")
        db.add(new_user)
        db.commit()
        print("Successfully migrated admin user.")
    else:
        print("Admin user already exists. Skipping.")

def migrate_plants(db: Session):
    csv_file = 'data/plants.csv'
    if not os.path.exists(csv_file):
        print(f"Skipping plants. {csv_file} not found.")
        return
        
    # We read the CSV and replace NaN with empty strings
    df = pd.read_csv(csv_file).fillna("")
    count = 0
    for _, row in df.iterrows():
        name = str(row.get('name', row.get('plant_name', ''))).strip()
        if not name:
            continue
            
        type_str = str(row.get('type', row.get('Type', '')))
        
        existing = db.query(models.Plant).filter_by(name=name).first()
        if not existing:
            try:
                price = float(row.get('price') or 0.0)
            except ValueError:
                price = 0.0
                
            try:
                stock = int(row.get('stock_quantity') or 0)
            except ValueError:
                stock = 0
                
            try:
                ai_score = float(row.get('expert_score') or 0.0)
            except ValueError:
                ai_score = 0.0
                
            try:
                temp_min = int(row.get('temp_min') or 0)
            except ValueError:
                temp_min = 0

            try:
                temp_max = int(row.get('temp_max') or 0)
            except ValueError:
                temp_max = 0
                
            img = str(row.get('image_url', '')).strip()
            if not img:
                img = "placeholder.png"
                
            new_plant = models.Plant(
                name=name,
                category=str(row.get('category', '')).lower(),
                type=type_str.lower(),
                price=price,
                stock=stock,
                ai_score=ai_score,
                light_requirement=str(row.get('light_requirement', '')),
                water_frequency=str(row.get('water_frequency', '')),
                temp_min=temp_min,
                temp_max=temp_max,
                maintenance_level=str(row.get('maintenance_level', '')),
                growth_rate=str(row.get('growth_rate', '')),
                image_url=img
            )
            db.add(new_plant)
            count += 1
            
    if count > 0:
        db.commit()
        print(f"Successfully migrated {count} plants.")
    else:
        print("No new plants to migrate.")

def migrate_tools(db: Session):
    csv_file = 'data/tools.csv'
    if not os.path.exists(csv_file):
        print(f"Skipping tools. {csv_file} not found.")
        return
        
    df = pd.read_csv(csv_file).fillna("")
    count = 0
    for _, row in df.iterrows():
        name = str(row.get('name', '')).strip()
        if not name:
            continue
            
        existing = db.query(models.Tool).filter_by(name=name).first()
        if not existing:
            try:
                price = float(row.get('price') or 0.0)
            except ValueError:
                price = 0.0
                
            try:
                stock = int(row.get('stock_quantity') or 0)
            except ValueError:
                stock = 0
                
            new_tool = models.Tool(
                name=name,
                category=str(row.get('category', '')),
                price=price,
                stock=stock
            )
            db.add(new_tool)
            count += 1
            
    if count > 0:
        db.commit()
        print(f"Successfully migrated {count} tools.")
    else:
        print("No new tools to migrate.")

def migrate_orders(db: Session):
    csv_file = 'data/orders.csv'
    if not os.path.exists(csv_file):
        print(f"Skipping orders. {csv_file} not found.")
        return
        
    df = pd.read_csv(csv_file).fillna("")
    count = 0
    
    for _, row in df.iterrows():
        fname = str(row.get('first_name', '')).strip()
        lname = str(row.get('last_name', '')).strip()
        customer_name = f"{fname} {lname}".strip()
        if not customer_name:
            continue
            
        contact = str(row.get('whatsapp', ''))
        date_str = str(row.get('date', ''))
        
        # Deduplication based on name and contact 
        existing = db.query(models.Order).filter(
            models.Order.customer_name == customer_name,
            models.Order.customer_contact == contact
        ).first()
        
        if not existing:
            try:
                total_amount = float(row.get('total_amount') or 0.0)
            except ValueError:
                total_amount = 0.0
                
            dt = None
            if date_str:
                try:
                    dt = datetime.fromisoformat(date_str)
                except ValueError:
                    dt = datetime.now()
            else:
                dt = datetime.now()
                
            new_order = models.Order(
                customer_name=customer_name,
                customer_contact=contact,
                total_amount=total_amount,
                status=str(row.get('status', 'Pending')),
                created_at=dt
            )
            db.add(new_order)
            count += 1

    if count > 0:
        db.commit()
        print(f"Successfully migrated {count} orders.")
    else:
        print("No new orders to migrate.")

def migrate_sales(db: Session):
    csv_file = 'data/physical_sales.csv'
    if not os.path.exists(csv_file):
        print(f"Skipping physical sales. {csv_file} not found.")
        return
        
    df = pd.read_csv(csv_file).fillna("")
    count = 0
    for _, row in df.iterrows():
        desc = str(row.get('description', '')).strip()
        date_str = str(row.get('date', ''))
        
        if not desc:
            continue
            
        existing = db.query(models.PhysicalSale).filter(
            models.PhysicalSale.description == desc
        ).first()

        if not existing:
            try:
                amount = float(row.get('total_sale') or 0.0)
            except ValueError:
                amount = 0.0
                
            dt = None
            if date_str:
                try:
                    dt = datetime.fromisoformat(date_str)
                except ValueError:
                    dt = datetime.now()
            else:
                dt = datetime.now()

            new_sale = models.PhysicalSale(
                amount=amount,
                description=desc,
                created_at=dt
            )
            db.add(new_sale)
            count += 1

    if count > 0:
        db.commit()
        print(f"Successfully migrated {count} physical sales.")
    else:
        print("No new physical sales to migrate.")

def main():
    print("Starting data migration from CSV/JSON to PostgreSQL...")
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        get_or_create_user(db)
        migrate_plants(db)
        migrate_tools(db)
        migrate_orders(db)
        migrate_sales(db)
        print("Migration complete!")
    finally:
        db.close()

if __name__ == "__main__":
    main()
