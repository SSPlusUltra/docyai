from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Configure CORS settings
origins = ["http://localhost:3000"]  # Update with your client's origin URLs


@app.get("/")
async def home():
    return {'message': 'Let\'s build this whiteboard'}

if __name__ == '__main__':
    uvicorn.run('main:app', reload=True)
