from fastapi import FastAPI

from app.api.auth_routes import router as auth_router
from app.api.restaurant_routes import router as restaurant_router

app = FastAPI(
    title="FoodiePilot API",
    description="AI-powered restaurant discovery and booking platform",
    version="1.0.0"
)

app.include_router(auth_router)
app.include_router(restaurant_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to FoodiePilot API"
    }