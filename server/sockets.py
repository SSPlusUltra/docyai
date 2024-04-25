import socketio
from supabase_utils import supabase
import datetime
from preprocess_utils import preprocess_excalidraw_elements
from opneAI_utils import openAIClient

sio_server = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=["https://docyai.vercel.app"],
     transports=['websocket'] 
)

sio_app = socketio.ASGIApp(
    socketio_server= sio_server,
    socketio_path = 'socket.io'
)

elements=[]
rooms={}
collaborators = {}
messages={}
aimessages={}


@sio_server.event
async def connect(sid, environ, auth):
     print(f'{sid} connected')
     


@sio_server.event
async def disconnect(sid):
    for room in sio_server.rooms(sid):
        await sio_server.leave_room(sid, room)
        await sio_server.emit('left_room', room, room=room)
        if room in rooms and 'collaborators' in rooms[room]:
            if sid in rooms[room]['collaborators']:
                del rooms[room]['collaborators'][sid]
        if room in rooms:
            await sio_server.emit("collaborators_data", list(rooms[room]['collaborators'].values()), room=room)

    



@sio_server.event
async def join_room(sid, roomId):
    await sio_server.enter_room(sid, roomId)
    await sio_server.save_session(sid, {'room': roomId})
    await sio_server.emit('joined_room', roomId, room=roomId)
    if roomId not in rooms:
        rooms[roomId] = {'collaborators': {}}


@sio_server.event
async def handle_message_update(sid, data):
    roomId = data["roomId"]
    message = data['message']
    timestamp = datetime.datetime.utcnow().isoformat()
    if roomId not in messages:
        messages[roomId] = {}
    if sid not in messages[roomId]:
        messages[roomId][sid] = []
    messages[roomId][sid].append({"text": message, "timestamp": timestamp})
    room_messages = messages.get(roomId, {})
    print(messages)
    await sio_server.emit('handle_message_update', room_messages, room=roomId)
    


@sio_server.event
async def collaborators_data(sid, data):
    collaboratorInfo = data.get('collaboratorInfo')
    roomId = data.get('roomId')
    if roomId not in rooms:
        rooms[roomId] = {'collaborators': {}}
    collaboratorInfo['socketId'] = sid  
    rooms[roomId]['collaborators'][sid] = collaboratorInfo
    await sio_server.emit("collaborators_data", list(rooms[roomId]['collaborators'].values()), room=roomId)



@sio_server.event
async def handle_pointer_update(sid, data):
    updated_collaborator_pointer = data.get('updatedCollaboratorPointer')
    roomId = data.get('roomId')
    rooms[roomId]['collaborators'][sid]["pointer"] = updated_collaborator_pointer
    await sio_server.emit("collaborators_data", list(rooms[roomId]['collaborators'].values()), room=roomId, skip_sid=sid)



@sio_server.event
async def handle_excalidraw_state_update(sid, data):
    elements = data['elements']
    roomId = data['roomId']
    supabase.table("rooms").upsert({
    "room_id": roomId,  
    "elements": elements
}).execute()

    await sio_server.emit("handle_excalidraw_state_update", {
            "elements": elements,
        }, room=roomId, skip_sid=sid)


@sio_server.event
async def handle_summary_update(sid, data):
    if data is not None and "elements" in data and data["elements"] is not None:
        preprocessed_content = preprocess_excalidraw_elements(data["elements"])
        response = openAIClient.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "Generally, when user refers to anvas or board they are referring to the canvas from which elements are passed to you so answer based on that. If asked about things like whats on the canvas just tell them the type of elemnents there are and what they are from the json data provided, dont tell them that its from json data. Also convert hexcode colors to regular color names before telling them. Also give suggestions or insights on what can be drawn based on the figures of canvas."},
                {"role": "system", "content": preprocessed_content},
                {"role": "user", "content": data["question"]},
            ]
        )

        timestamp = datetime.datetime.utcnow().isoformat()

        if sid not in aimessages:
            aimessages[sid] = []
        aimessages[sid].append({"isuser": 1, "text": data["question"], "timestamp": timestamp})
        timestamp = datetime.datetime.utcnow().isoformat()
        aimessages[sid].append({"isuser": 0, "text": response.choices[0].message.content, "timestamp": timestamp})
        room_aimessages = aimessages.get(sid, {})
        print(room_aimessages)

        await sio_server.emit("handle_summary_update", room_aimessages, room=sid)
        print(response.choices[0].message.content)
    else:
        print("Data is None or does not contain 'elements', sending default response")
        default_response = "I'm here to assist you. Looks like your canvas is empty. Please insert something in canvas for me to analyze before asking questions."
        timestamp = datetime.datetime.utcnow().isoformat()
        if sid not in aimessages:
            aimessages[sid] = []
        aimessages[sid].append({"isuser": 0, "text": default_response, "timestamp": timestamp})
        room_aimessages = aimessages.get(sid, {})

        await sio_server.emit("handle_summary_update", room_aimessages, room=sid)
