import random
from datetime import datetime, timedelta
from app.database import SessionLocal
from app.models import PhysicalSale

def seed_sales():
    db = SessionLocal()

    descriptions = [
        "Sold Rose Bushes and Fertilizer", "Gardening Tools and Seeds",
        "Indoor Plant Collection sale", "Landscaping Service Deposit",
        "Terracotta Pots and soil", "Orchid and soil mix", "Bonsai Tree",
        "Fruit Tree Saplings and spray", "Watering Can and ceramic pot",
        "Succulent Assortment", "Pest Control and Compost"
    ]

    now = datetime.now()
    sales_added = 0

    # Generate 1 sale per day for the past 60 days
    for i in range(60):
        current_date = (now - timedelta(days=i)).strftime("%Y-%m-%d")
        
        # total sale between 1000 and 15000
        total_sale = round(random.uniform(1000.0, 15000.0), 2)
        # expense between 0 and 20% of total sale
        expense = round(total_sale * random.uniform(0.0, 0.2), 2)
        net_sale = total_sale - expense
        desc = random.choice(descriptions)
        
        sale = PhysicalSale(
            date=current_date,
            total_sale=total_sale,
            expense=expense,
            net_sale=net_sale,
            description=desc
        )
        db.add(sale)
        sales_added += 1

    db.commit()
    db.close()
    print(f"Successfully generated {sales_added} daily physical sales over the last 60 days.")

if __name__ == "__main__":
    seed_sales()
