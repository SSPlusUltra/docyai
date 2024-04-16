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

elements=[]

rooms={}

@sio_server.event
async def connect(sid, environ, auth):
     print(f'{sid} connected')
     


@sio_server.event
async def disconnect(sid):
    for room in sio_server.rooms(sid):
        await sio_server.leave_room(sid, room)
        await sio_server.emit('left_room', room, room=room)



@sio_server.event
async def join_room(sid, roomId):
    await sio_server.enter_room(sid, roomId)
    await sio_server.save_session(sid, {'room': roomId})
    await sio_server.emit('joined_room', roomId, room=roomId)
    if roomId not in rooms:
        rooms[roomId] = {'collaborators': {}}
    
    # print(f"User {sid} has joined room {room_id}")



@sio_server.event
async def collaborators_data(sid,data):
    # print(f'Received data from client {sid}: {data}')
    collaboratorInfo = data.get('collaboratorInfo')
    roomId = data.get('roomId')
    if roomId not in rooms:
        rooms[roomId] = {'collaborators': {}}
    rooms[roomId]['collaborators'][sid] = collaboratorInfo
    print(rooms)
    await sio_server.emit("collaborators_data", list(rooms[roomId]['collaborators'].values()), room=roomId)


@sio_server.event
async def handle_pointer_update(sid, data):
    updated_collaborator_pointer = data.get('updatedCollaboratorPointer')
    # print(f"Received updated collaborator pointer from client {sid}: {updated_collaborator_pointer}")
    roomId = data.get('roomId')
    rooms[roomId]['collaborators'][sid]["pointer"] = updated_collaborator_pointer
    await sio_server.emit("collaborators_data", list(rooms[roomId]['collaborators'].values()), room=roomId, skip_sid=sid)  


@sio_server.event
async def handle_excalidraw_state_update(sid, data):
    # print(data)
    elements = data['elements']
    roomId = data['roomId']
    await sio_server.emit("handle_excalidraw_state_update", {
            "elements": elements,
        }, room=roomId, skip_sid=sid)


