import socketio


sio_server = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=["http://localhost:3000"],
     transports=['websocket'] 
)

sio_app = socketio.ASGIApp(
    socketio_server= sio_server,
    socketio_path = 'socket.io'
)


connected_clients = []
collaborators = {}

@sio_server.event
async def connect(sid, environ, auth):
     connected_clients.append(sid)
     print(f'{sid} connected')
     collaborators[sid] = {
        "id": sid
    }
     await sio_server.emit("collaborators_data",list(collaborators.values()))


@sio_server.event
async def disconnect(sid):
    connected_clients.remove(sid)
    print(f'{sid} disconnected')
    if sid in collaborators:
        del collaborators[sid]

@sio_server.event
async def handle_excalidraw_state_update(sid, data):
    print(data)
    elements = data['elements']
    await sio_server.emit("handle_excalidraw_state_update", {
            "elements": elements,
        }, room=connected_clients, skip_sid=sid)


