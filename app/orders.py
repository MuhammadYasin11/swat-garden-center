import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from app import models

class OrderManager:
    def __init__(self):
        pass

    def create_order(self, db: Session, order_data: dict):
        customer_name = f"{order_data.get('first_name', '')} {order_data.get('last_name', '')}".strip()
        new_order = models.Order(
            customer_name=customer_name,
            customer_contact=order_data.get("whatsapp", ""),
            total_amount=order_data.get("total_amount", 0.0),
            status="Pending"
            # created_at defaults to func.now()
        )
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        return f"ORD-{new_order.id}"
        
    def get_all_orders(self, db: Session):
        orders = db.query(models.Order).order_by(models.Order.created_at.desc()).all()
        result = []
        for o in orders:
            # Parse first/last name
            parts = o.customer_name.split(" ", 1)
            first_name = parts[0] if len(parts) > 0 else ""
            last_name = parts[1] if len(parts) > 1 else ""
            
            result.append({
                "order_id": f"ORD-{o.id}",
                "date": o.created_at.isoformat() if o.created_at else "",
                "first_name": first_name,
                "last_name": last_name,
                "whatsapp": o.customer_contact,
                "email": "",
                "address": "",
                "total_amount": o.total_amount,
                "items": "",
                "status": o.status
            })
        return result
        
    def update_status(self, db: Session, order_id_str: str, new_status: str):
        try:
            real_id = int(order_id_str.replace("ORD-", ""))
        except ValueError:
            return False
            
        order = db.query(models.Order).filter(models.Order.id == real_id).first()
        if order:
            order.status = new_status
            db.commit()
            return True
        return False

    def delete_order(self, db: Session, order_id_str: str):
        try:
            real_id = int(order_id_str.replace("ORD-", ""))
        except ValueError:
            return False
            
        order = db.query(models.Order).filter(models.Order.id == real_id).first()
        if order:
            db.delete(order)
            db.commit()
            return True
        return False
