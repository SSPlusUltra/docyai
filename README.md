The Project I built is called FloVibe. It is a white board app with features such as collaboration, real time chat, Rooms, text to flow chart creation.

Tech Stack:

Frontend: Next.js AppRouter(with Type script)

Backend: Fast API(python)

primary communincation protocol: Web sockets(implemented using socketio library)

Databse used for persisting data in case of errors: supabase

starting point: Excalidraw

Detailed Features:

1) Users can create Rooms. Each room consists of an Excalidraw canvas and is assosiated with a roomId. Any work done in this room is accessable as long as users have the roomId.

2) Users can invite other users to these rooms by sharing the roomId and any number of users can enter the room and make changes. The changes made are reflected for everyone, this is done leveraging websockets. If a user shuts down the window they wont lose the progress and they can quickly jump back to the updated state of the canvas by joining with same roomId, this is done thanks to supabase for acting as storage mechanism when users disconnect.

3) Users can see other user's cursors present in the same room. Multiple rooms can be opened at once, one room's state updates wont affect the other room.

4) Users can use the Live Chat feature to talk to other users. This is again done with the help of web sockets and the chat history is not persisted, meaning if a user leaves and joins back he can get the canvas contents back but cant get the lost chat history.

5) text to flow-chart: This feature was default to excalidraw API and converts specific comands to flow chart and users can insert this content into canvas.

Project Structure/ Architecture:

Root directory has a Client and a Server directory consisting of frontend and backend code. front end code can be found after you cd into client and backend code will be found after you cd into server. Backend mainly has logic related to socket implementation and other application logic.

Instructions to run:

1)First, clone this repo to your local repository and cd into client's folder and run "npm install" this will install all dependencies and for the backend cd into backend directory and run "pip install requirements.txt" this should give you backend related dependencies.

2)Then you have to enter environment variables which i used to setup supabase:

3)For the frontend: enter environment variables in .env.local file.

4)For backend: enter environment variables in .env file

5)After entering environment variables, cd into client folder and run "npm run dev" this will run frontend code on https://localhost:3000 , the cd into server and run "python -m main" this will run the server at https://localhost:8000.

6)After following the above steps you can start using the website as the socket connection sets up immediately.


Tradeoffs:

Excalidraw API was a great help with its easy to understand documentation. But it has some limitations and bugs which could potentially cause delays during live collaboration as their Editor component gets triggered quite often for every state change as there is a lack of caching mechanism which is agreed upon by the maintainers of excalidraw here: https://github.com/excalidraw/excalidraw/issues/3014

I approached this by adding some caching layers which boosted performance. This didn't fully solve the problem as the the canvas was still rapidly updating causing drawings to disappear. I then employed a debounce mechanism which improved performance even more leading to current state. While debouncing causes a little bit of latency the drawing updation on canvas is accurate. Cleaner solution can stem from playing around with caching and syncing up with debouncing which i plan to work on in the future.
