from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth_routes import router as auth_router
from app.api.restaurant_routes import router as restaurant_router
from app.api.booking_routes import router as booking_router
from app.api.rag_routes import router as rag_router
from app.api.agent_routes import router as agent_router

app = FastAPI(
    title="FoodiePilot API",
    description="AI-powered restaurant discovery and booking platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(restaurant_router)
app.include_router(booking_router)
app.include_router(rag_router)
app.include_router(agent_router)


@app.get("/")
def root():
    return {"message": "Welcome to FoodiePilot API"}