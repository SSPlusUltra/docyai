from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from sockets import sio_app

app = FastAPI()

origins = ["http://localhost:3000"]

app.mount("/",sio_app)

@app.get("/")
async def home():
    return {'message': 'Let\'s build this whiteboard'}

if __name__ == '__main__':
    uvicorn.run('main:app', reload=True)
