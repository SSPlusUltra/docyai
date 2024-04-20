The Project I built is called FloVibe. It is a white board app with features such as collaboration, real time chat, Rooms, text to flow chart creation.

Tech Stack:

Frontend: Next.js AppRouter(with Type script)

Backend: Fast API(python)

primary communincation protocol: Web sockets(implemented using socketio library)

Databse used for persisting data in case of errors: supabase

starting point: Excalidraw

Project Structure/ Architecture:

Root directory has a Client and a Server directory consisting of frontend and backend code. front end code can be found after you cd into clent and backend code will be found after you cd into server. Backend mainly has logic related to socket implementation and other application logic.

Instructions to run:

First, clone this repo to your local repository and cd into client's folder and run "npm install" this will install all dependencies and for the backend cd into backend directory and run "pip install requirements.txt" this should give you bacend related dependencies.

Then you have to enter environment variables which i used to setup supabase:

fot the frontend: enter environment variables in .env.local file.

for backend: enter environment variables in .env file

After entering environment variables, cd into client folder and run "npm run dev" this will run frontend code on https://localhost:3000 , the cd into server and run "python -m main" this will run the server at https://localhost:8000.

After following the above steps you can start using the website as the socket connection sets up immediately.
