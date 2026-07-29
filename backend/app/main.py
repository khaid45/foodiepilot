from fastapi import FastAPI

app = FastAPI(
    title="FoodiePilot API",
    description="AI-powered Restaurant Booking Platform",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to FoodiePilot 🚀",
        "status": "Backend is running successfully!"
    }