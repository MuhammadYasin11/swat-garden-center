from sqlalchemy.orm import Session
from app import models

class ToolManager:
    def __init__(self):
        pass

    def get_all_tools(self, db: Session):
        tools = db.query(models.Tool).all()
        return [{
            "name": t.name,
            "category": t.category,
            "type": "",
            "price": t.price,
            "stock_quantity": t.stock,
            "expert_score": 0.0,
            "image_url": ""
        } for t in tools]

    def add_tool(self, db: Session, tool_data: dict):
        existing = db.query(models.Tool).filter(models.Tool.name == tool_data['name']).first()
        if existing:
            return False, "Tool with this name already exists"

        new_tool = models.Tool(
            name=tool_data['name'],
            category=tool_data['category'],
            price=tool_data['price'],
            stock=tool_data['stock_quantity']
        )
        db.add(new_tool)
        db.commit()
        return True, "Tool added successfully"

    def edit_tool(self, db: Session, original_name: str, new_tool_data: dict):
        tool = db.query(models.Tool).filter(models.Tool.name == original_name).first()
        if not tool:
            return False, "Tool not found"
            
        if original_name != new_tool_data['name']:
            existing = db.query(models.Tool).filter(models.Tool.name == new_tool_data['name']).first()
            if existing:
                return False, "A tool with the new name already exists"

        tool.name = new_tool_data['name']
        tool.category = new_tool_data['category']
        tool.price = new_tool_data.get('price', tool.price)
        tool.stock = new_tool_data.get('stock_quantity', tool.stock)
        
        db.commit()
        return True, "Tool updated successfully"

    def delete_tool(self, db: Session, tool_name: str):
        tool = db.query(models.Tool).filter(models.Tool.name == tool_name).first()
        if not tool:
            return False, "Tool not found"

        db.delete(tool)
        db.commit()
        return True, "Tool deleted successfully"

    def bulk_import_tools(self, db: Session, df_new):
        count = 0
        for _, row in df_new.iterrows():
            name = str(row.get('name', '')).strip()
            if not name:
                continue
                
            tool = db.query(models.Tool).filter(models.Tool.name == name).first()
            if not tool:
                tool = models.Tool(name=name)
                db.add(tool)
                
            tool.category = str(row.get('category', ''))
            try:
                tool.price = float(row.get('price', 0))
            except:
                pass
            try:
                tool.stock = int(row.get('stock_quantity', 0))
            except:
                pass
                
            count += 1
            
        db.commit()
        return True, f"Successfully imported {count} tools."
