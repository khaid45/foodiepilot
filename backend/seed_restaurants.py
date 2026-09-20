from app.database.database import SessionLocal
from app.models.restaurant import Restaurant


restaurants = [
    # =========================================================
    # VISAKHAPATNAM — 20
    # =========================================================
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
    },

    # =========================================================
    # HYDERABAD — 10
    # =========================================================
    {
        "name": "Deccan Spice",
        "location": "Hyderabad",
        "cuisine": "Hyderabadi",
        "rating": 4.7,
        "available_tables": 12,
        "price_range": "$$"
    },
    {
        "name": "Charminar Biryani House",
        "location": "Hyderabad",
        "cuisine": "Biryani",
        "rating": 4.8,
        "available_tables": 14,
        "price_range": "$$"
    },
    {
        "name": "Nizam's Table",
        "location": "Hyderabad",
        "cuisine": "Mughlai",
        "rating": 4.6,
        "available_tables": 8,
        "price_range": "$$$"
    },
    {
        "name": "Hitech City Grill",
        "location": "Hyderabad",
        "cuisine": "Grill",
        "rating": 4.5,
        "available_tables": 10,
        "price_range": "$$$"
    },
    {
        "name": "Deccan Leaf",
        "location": "Hyderabad",
        "cuisine": "Vegetarian",
        "rating": 4.4,
        "available_tables": 9,
        "price_range": "$$"
    },
    {
        "name": "La Piazza Hyderabad",
        "location": "Hyderabad",
        "cuisine": "Italian",
        "rating": 4.5,
        "available_tables": 7,
        "price_range": "$$$"
    },
    {
        "name": "Kebab Junction",
        "location": "Hyderabad",
        "cuisine": "North Indian",
        "rating": 4.6,
        "available_tables": 11,
        "price_range": "$$"
    },
    {
        "name": "Seoul Street Hyderabad",
        "location": "Hyderabad",
        "cuisine": "Korean",
        "rating": 4.3,
        "available_tables": 6,
        "price_range": "$$"
    },
    {
        "name": "Roastery Lane",
        "location": "Hyderabad",
        "cuisine": "Cafe",
        "rating": 4.5,
        "available_tables": 5,
        "price_range": "$"
    },
    {
        "name": "Skyline Dining",
        "location": "Hyderabad",
        "cuisine": "Continental",
        "rating": 4.7,
        "available_tables": 8,
        "price_range": "$$$"
    },

    # =========================================================
    # BENGALURU — 10
    # =========================================================
    {
        "name": "Garden City Kitchen",
        "location": "Bengaluru",
        "cuisine": "South Indian",
        "rating": 4.6,
        "available_tables": 10,
        "price_range": "$$"
    },
    {
        "name": "Bangalore Social Table",
        "location": "Bengaluru",
        "cuisine": "Continental",
        "rating": 4.5,
        "available_tables": 9,
        "price_range": "$$$"
    },
    {
        "name": "Brew & Bean",
        "location": "Bengaluru",
        "cuisine": "Cafe",
        "rating": 4.7,
        "available_tables": 6,
        "price_range": "$"
    },
    {
        "name": "Silicon Valley Grill",
        "location": "Bengaluru",
        "cuisine": "Grill",
        "rating": 4.4,
        "available_tables": 8,
        "price_range": "$$$"
    },
    {
        "name": "Mango Tree",
        "location": "Bengaluru",
        "cuisine": "Indian",
        "rating": 4.6,
        "available_tables": 12,
        "price_range": "$$"
    },
    {
        "name": "Tokyo Terrace Bengaluru",
        "location": "Bengaluru",
        "cuisine": "Japanese",
        "rating": 4.5,
        "available_tables": 6,
        "price_range": "$$$"
    },
    {
        "name": "Little Italy Bengaluru",
        "location": "Bengaluru",
        "cuisine": "Italian",
        "rating": 4.6,
        "available_tables": 7,
        "price_range": "$$$"
    },
    {
        "name": "Masala Stories",
        "location": "Bengaluru",
        "cuisine": "North Indian",
        "rating": 4.3,
        "available_tables": 10,
        "price_range": "$$"
    },
    {
        "name": "Seoul Bowl",
        "location": "Bengaluru",
        "cuisine": "Korean",
        "rating": 4.4,
        "available_tables": 5,
        "price_range": "$$"
    },
    {
        "name": "The Green Table",
        "location": "Bengaluru",
        "cuisine": "Vegetarian",
        "rating": 4.5,
        "available_tables": 8,
        "price_range": "$$"
    },

    # =========================================================
    # CHENNAI — 10
    # =========================================================
    {
        "name": "Marina Spice",
        "location": "Chennai",
        "cuisine": "South Indian",
        "rating": 4.7,
        "available_tables": 11,
        "price_range": "$$"
    },
    {
        "name": "Madras Table",
        "location": "Chennai",
        "cuisine": "Tamil",
        "rating": 4.6,
        "available_tables": 10,
        "price_range": "$$"
    },
    {
        "name": "Bay View Seafood",
        "location": "Chennai",
        "cuisine": "Seafood",
        "rating": 4.8,
        "available_tables": 8,
        "price_range": "$$$"
    },
    {
        "name": "Chennai Tandoor",
        "location": "Chennai",
        "cuisine": "North Indian",
        "rating": 4.4,
        "available_tables": 9,
        "price_range": "$$"
    },
    {
        "name": "Madras Coffee House",
        "location": "Chennai",
        "cuisine": "Cafe",
        "rating": 4.5,
        "available_tables": 6,
        "price_range": "$"
    },
    {
        "name": "Coastal Chennai",
        "location": "Chennai",
        "cuisine": "Indian",
        "rating": 4.6,
        "available_tables": 12,
        "price_range": "$$"
    },
    {
        "name": "Olive Chennai",
        "location": "Chennai",
        "cuisine": "Mediterranean",
        "rating": 4.4,
        "available_tables": 7,
        "price_range": "$$$"
    },
    {
        "name": "Tokyo Chennai",
        "location": "Chennai",
        "cuisine": "Japanese",
        "rating": 4.5,
        "available_tables": 5,
        "price_range": "$$$"
    },
    {
        "name": "Chennai Spice Garden",
        "location": "Chennai",
        "cuisine": "Vegetarian",
        "rating": 4.3,
        "available_tables": 8,
        "price_range": "$$"
    },
    {
        "name": "The Cathedral Grill",
        "location": "Chennai",
        "cuisine": "Continental",
        "rating": 4.6,
        "available_tables": 7,
        "price_range": "$$$"
    },

    # =========================================================
    # DELHI — 10
    # =========================================================
    {
        "name": "Delhi Darbar",
        "location": "Delhi",
        "cuisine": "North Indian",
        "rating": 4.7,
        "available_tables": 12,
        "price_range": "$$"
    },
    {
        "name": "Old Delhi Kitchen",
        "location": "Delhi",
        "cuisine": "Mughlai",
        "rating": 4.8,
        "available_tables": 10,
        "price_range": "$$"
    },
    {
        "name": "Capital Grill",
        "location": "Delhi",
        "cuisine": "Grill",
        "rating": 4.6,
        "available_tables": 8,
        "price_range": "$$$"
    },
    {
        "name": "India Gate Bistro",
        "location": "Delhi",
        "cuisine": "Continental",
        "rating": 4.5,
        "available_tables": 7,
        "price_range": "$$$"
    },
    {
        "name": "Chaat & Chai",
        "location": "Delhi",
        "cuisine": "Indian",
        "rating": 4.4,
        "available_tables": 9,
        "price_range": "$"
    },
    {
        "name": "Delhi Biryani Co.",
        "location": "Delhi",
        "cuisine": "Biryani",
        "rating": 4.7,
        "available_tables": 11,
        "price_range": "$$"
    },
    {
        "name": "Saffron Leaf",
        "location": "Delhi",
        "cuisine": "Vegetarian",
        "rating": 4.5,
        "available_tables": 8,
        "price_range": "$$"
    },
    {
        "name": "Little Italy Delhi",
        "location": "Delhi",
        "cuisine": "Italian",
        "rating": 4.6,
        "available_tables": 6,
        "price_range": "$$$"
    },
    {
        "name": "Seoul Garden Delhi",
        "location": "Delhi",
        "cuisine": "Korean",
        "rating": 4.3,
        "available_tables": 5,
        "price_range": "$$"
    },
    {
        "name": "The Rooftop Delhi",
        "location": "Delhi",
        "cuisine": "Asian",
        "rating": 4.6,
        "available_tables": 9,
        "price_range": "$$$"
    },

    # =========================================================
    # MUMBAI — 10
    # =========================================================
    {
        "name": "Marine Drive Kitchen",
        "location": "Mumbai",
        "cuisine": "Indian",
        "rating": 4.7,
        "available_tables": 10,
        "price_range": "$$"
    },
    {
        "name": "Bombay Bistro",
        "location": "Mumbai",
        "cuisine": "Indian",
        "rating": 4.6,
        "available_tables": 9,
        "price_range": "$$"
    },
    {
        "name": "Gateway Seafood",
        "location": "Mumbai",
        "cuisine": "Seafood",
        "rating": 4.8,
        "available_tables": 8,
        "price_range": "$$$"
    },
    {
        "name": "Mumbai Tandoor",
        "location": "Mumbai",
        "cuisine": "North Indian",
        "rating": 4.5,
        "available_tables": 11,
        "price_range": "$$"
    },
    {
        "name": "Colaba Coffee Room",
        "location": "Mumbai",
        "cuisine": "Cafe",
        "rating": 4.6,
        "available_tables": 6,
        "price_range": "$"
    },
    {
        "name": "Bollywood Bites",
        "location": "Mumbai",
        "cuisine": "Indian",
        "rating": 4.4,
        "available_tables": 10,
        "price_range": "$$"
    },
    {
        "name": "Bombay Pasta House",
        "location": "Mumbai",
        "cuisine": "Italian",
        "rating": 4.5,
        "available_tables": 7,
        "price_range": "$$$"
    },
    {
        "name": "Tokyo Mumbai",
        "location": "Mumbai",
        "cuisine": "Japanese",
        "rating": 4.6,
        "available_tables": 5,
        "price_range": "$$$"
    },
    {
        "name": "Green Bombay",
        "location": "Mumbai",
        "cuisine": "Vegetarian",
        "rating": 4.5,
        "available_tables": 8,
        "price_range": "$$"
    },
    {
        "name": "Skyline Mumbai",
        "location": "Mumbai",
        "cuisine": "Continental",
        "rating": 4.7,
        "available_tables": 7,
        "price_range": "$$$"
    },
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
        print(f"Total restaurant definitions: {len(restaurants)}")

    finally:
        db.close()


if __name__ == "__main__":
    seed_restaurants()