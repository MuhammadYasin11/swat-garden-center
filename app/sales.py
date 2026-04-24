from datetime import datetime
from sqlalchemy.orm import Session
from app import models

class PhysicalSalesManager:
    def __init__(self):
        pass

    def get_all_sales(self, db: Session):
        sales = db.query(models.PhysicalSale).order_by(models.PhysicalSale.date.desc()).all()
        result = []
        for s in sales:
            result.append({
                "id": f"SALE-{s.id}",
                "date": s.date,
                "total_sale": s.total_sale,
                "expense": s.expense,
                "net_sale": s.net_sale,
                "description": s.description
            })
        return result

    def add_sale(self, db: Session, sale_data: dict):
        date_str = sale_data.get("date")
        if not date_str:
            date_str = datetime.now().strftime("%Y-%m-%d")

        existing = db.query(models.PhysicalSale).filter(models.PhysicalSale.date == date_str).first()
        if existing:
            return False, f"A record for {date_str} already exists. Please edit it instead."

        total_sale = float(sale_data.get("total_sale", 0))
        expense = float(sale_data.get("expense", 0))
        net_sale = total_sale - expense
        
        new_sale = models.PhysicalSale(
            date=date_str,
            total_sale=total_sale,
            expense=expense,
            net_sale=net_sale,
            description=sale_data.get("description", "")
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
            
        date_str = sale_data.get("date", sale.date)
        if date_str != sale.date:
            existing = db.query(models.PhysicalSale).filter(models.PhysicalSale.date == date_str).first()
            if existing:
                return False, f"A record for {date_str} already exists."

        sale.date = date_str
        sale.total_sale = float(sale_data.get("total_sale", sale.total_sale))
        sale.expense = float(sale_data.get("expense", sale.expense))
        sale.net_sale = sale.total_sale - sale.expense
        sale.description = sale_data.get("description", sale.description)
        
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
