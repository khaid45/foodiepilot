from app.database.database import SessionLocal
from app.models.restaurant import Restaurant


restaurants = [
    {
        "name": "The Spice Route",
        "location": "Visakhapatnam",
        "cuisine": "Indian",
        "rating": 4.6,
        "available_tables": 12,
        "price_range": "$$"
    },
    {
        "name": "Coastal Curry House",
        "location": "Visakhapatnam",
        "cuisine": "Andhra",
        "rating": 4.7,
        "available_tables": 10,
        "price_range": "$$"
    },
    {
        "name": "Bamboo Garden",
        "location": "Visakhapatnam",
        "cuisine": "Chinese",
        "rating": 4.4,
        "available_tables": 8,
        "price_range": "$$"
    },
    {
        "name": "Bella Italia",
        "location": "Visakhapatnam",
        "cuisine": "Italian",
        "rating": 4.5,
        "available_tables": 6,
        "price_range": "$$$"
    },
    {
        "name": "Tandoori Tales",
        "location": "Visakhapatnam",
        "cuisine": "North Indian",
        "rating": 4.3,
        "available_tables": 9,
        "price_range": "$$"
    },
    {
        "name": "Ocean Pearl",
        "location": "Visakhapatnam",
        "cuisine": "Seafood",
        "rating": 4.8,
        "available_tables": 7,
        "price_range": "$$$"
    },
    {
        "name": "Café Mocha",
        "location": "Visakhapatnam",
        "cuisine": "Cafe",
        "rating": 4.2,
        "available_tables": 5,
        "price_range": "$"
    },
    {
        "name": "The Royal Biryani",
        "location": "Visakhapatnam",
        "cuisine": "Biryani",
        "rating": 4.7,
        "available_tables": 11,
        "price_range": "$$"
    },
    {
        "name": "Green Leaf",
        "location": "Visakhapatnam",
        "cuisine": "Vegetarian",
        "rating": 4.4,
        "available_tables": 8,
        "price_range": "$$"
    },
    {
        "name": "Urban Tadka",
        "location": "Visakhapatnam",
        "cuisine": "Indian",
        "rating": 4.3,
        "available_tables": 10,
        "price_range": "$$"
    },
    {
        "name": "Seoul Kitchen",
        "location": "Visakhapatnam",
        "cuisine": "Korean",
        "rating": 4.5,
        "available_tables": 6,
        "price_range": "$$$"
    },
    {
        "name": "Tokyo Bites",
        "location": "Visakhapatnam",
        "cuisine": "Japanese",
        "rating": 4.6,
        "available_tables": 5,
        "price_range": "$$$"
    },
    {
        "name": "Mexican Fiesta",
        "location": "Visakhapatnam",
        "cuisine": "Mexican",
        "rating": 4.2,
        "available_tables": 7,
        "price_range": "$$"
    },
    {
        "name": "Burger District",
        "location": "Visakhapatnam",
        "cuisine": "American",
        "rating": 4.1,
        "available_tables": 9,
        "price_range": "$"
    },
    {
        "name": "The Grand Andhra",
        "location": "Visakhapatnam",
        "cuisine": "Andhra",
        "rating": 4.8,
        "available_tables": 12,
        "price_range": "$$$"
    },
    {
        "name": "Olive & Basil",
        "location": "Visakhapatnam",
        "cuisine": "Mediterranean",
        "rating": 4.5,
        "available_tables": 6,
        "price_range": "$$$"
    },
    {
        "name": "Arabian Nights",
        "location": "Visakhapatnam",
        "cuisine": "Arabian",
        "rating": 4.4,
        "available_tables": 8,
        "price_range": "$$"
    },
    {
        "name": "Chai & Co.",
        "location": "Visakhapatnam",
        "cuisine": "Cafe",
        "rating": 4.3,
        "available_tables": 5,
        "price_range": "$"
    },
    {
        "name": "The Terrace Grill",
        "location": "Visakhapatnam",
        "cuisine": "Grill",
        "rating": 4.6,
        "available_tables": 7,
        "price_range": "$$$"
    },
    {
        "name": "Flavours of South",
        "location": "Visakhapatnam",
        "cuisine": "South Indian",
        "rating": 4.5,
        "available_tables": 10,
        "price_range": "$$"
    }
]


def seed_restaurants():
    db = SessionLocal()

    try:
        added = 0
        existing = 0

        for data in restaurants:
            restaurant = db.query(Restaurant).filter(
                Restaurant.name == data["name"]
            ).first()

            if restaurant:
                existing += 1
                continue

            restaurant = Restaurant(**data)
            db.add(restaurant)
            added += 1

        db.commit()

        print(f"Successfully added: {added}")
        print(f"Already existed: {existing}")

    finally:
        db.close()


if __name__ == "__main__":
    seed_restaurants()