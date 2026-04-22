from datetime import datetime
from sqlalchemy.orm import Session
from app import models

class PhysicalSalesManager:
    def __init__(self):
        pass

    def get_all_sales(self, db: Session):
        sales = db.query(models.PhysicalSale).order_by(models.PhysicalSale.created_at.desc()).all()
        result = []
        for s in sales:
            result.append({
                "id": f"SALE-{s.id}",
                "date": s.created_at.strftime("%Y-%m-%d") if s.created_at else "",
                "total_sale": s.amount,
                "expense": 0.0,
                "net_sale": s.amount,  # Simplification matching previous logic without expense tracking in db
                "description": s.description
            })
        return result

    def add_sale(self, db: Session, sale_data: dict):
        total_sale = float(sale_data.get("total_sale", 0))
        expense = float(sale_data.get("expense", 0))
        net_sale = total_sale - expense  # Computed here but DB drops expense
        
        date_str = sale_data.get("date")
        dt = None
        if date_str:
            try:
                dt = datetime.fromisoformat(date_str)
            except ValueError:
                dt = datetime.now()
                
        new_sale = models.PhysicalSale(
            amount=net_sale, # Using net sale for amount to be safe
            description=sale_data.get("description", ""),
            created_at=dt
        )
        db.add(new_sale)
        db.commit()
        return True, "Physical sale recorded successfully."

    def update_sale(self, db: Session, sale_id_str: str, sale_data: dict):
        try:
            real_id = int(sale_id_str.replace("SALE-", ""))
        except ValueError:
            return False, "Invalid sale ID format."
            
        sale = db.query(models.PhysicalSale).filter(models.PhysicalSale.id == real_id).first()
        if not sale:
            return False, "Sale record not found."
            
        total_sale = float(sale_data.get("total_sale", sale.amount))
        expense = float(sale_data.get("expense", 0))
        
        sale.amount = total_sale - expense
        sale.description = sale_data.get("description", sale.description)
        
        date_str = sale_data.get("date")
        if date_str:
            try:
                sale.created_at = datetime.fromisoformat(date_str)
            except ValueError:
                pass
                
        db.commit()
        return True, "Physical sale updated successfully."

    def delete_sale(self, db: Session, sale_id_str: str):
        try:
            real_id = int(sale_id_str.replace("SALE-", ""))
        except ValueError:
            return False, "Invalid sale ID format."
            
        sale = db.query(models.PhysicalSale).filter(models.PhysicalSale.id == real_id).first()
        if not sale:
            return False, "Sale record not found."
            
        db.delete(sale)
        db.commit()
        return True, "Physical sale deleted successfully."
