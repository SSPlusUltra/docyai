from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from sockets import sio_app
from decouple import config
from supabase import create_client, Client

url = config("SUPABASE_URL")
key= config("SUPABASE_KEY")

app = FastAPI()

supabase: Client = create_client(url, key)

origins = ["http://localhost:3000"]

app.mount("/socket.io",sio_app)


@app.get("/")
async def home():
    return {'message': 'Let\'s build this whiteboard'}

@app.get("/rooms")
def get_rooms():
    rooms=supabase.table("rooms").select("*").execute()
    return rooms

if __name__ == '__main__':
    uvicorn.run('main:app', reload=True)
