"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import debounce from "lodash.debounce";
import {
  Excalidraw,
  Footer,
  getSceneVersion,
  serializeAsJSON,
} from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { Collaborator } from "@excalidraw/excalidraw/types/types";
import ChatBox from "../ChatZone/ChatInput";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import CollabModal from "../CollabModal/CollabModal";

interface CollabProps {
  username: string;
  avatarUrl: string;
  roomId: string;
  initialData: any;
}

const collaboratorMap = new Map();

const Editor = ({ username, avatarUrl, roomId, initialData }: CollabProps) => {
  const [excalidrawAPI, setAPI] = useState<any>();
  const socket = useRef<any>();
  const previousVersion = useRef<number | null>(null);
  const [messages, setMessages] = useState({});
  const [collabs, setCollabs] = useState<any>();
  const [isVisible, setIsVisible] = useState(false);

  const collaboratorInfo = {
    pointer: null,
    username: username,
    color: { background: "#ff0000", stroke: "#ff0000" },
    avatarUrl: avatarUrl,
    socketId: null,
    isCurrentUser: false,
  };

  useEffect(() => {
    socket.current = io("http://localhost:8000", {
      transports: ["websocket"],
    });

    socket.current?.on("connect", () => {
      console.log(`${socket.current.id} connected`);
      collaboratorMap.set(socket.current.id, collaboratorInfo);
      socket.current.emit("join_room", roomId);
      socket.current.emit("collaborators_data", { collaboratorInfo, roomId });
      // excalidrawAPI && excalidrawAPI.updateScene({ elements: initialData });
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const debouncedHandleEditorChange = useRef(
    debounce((elements: readonly ExcalidrawElement[]) => {
      socket.current.emit("handle_excalidraw_state_update", {
        elements,
        roomId,
      });
    }, 500)
  ).current;

  const handleEditorChange = (elements: readonly ExcalidrawElement[]): void => {
    const version = getSceneVersion(elements);
    const ele = excalidrawAPI.getSceneElements();
    const app_state = excalidrawAPI.getAppState();
    if (
      version != previousVersion.current &&
      (ele.length > 0 || app_state["activeTool"]["type"] == "eraser")
    ) {
      debouncedHandleEditorChange(elements);
      previousVersion.current = version;
    }
  };

  const handleMessages = (message: string) => {
    socket.current?.emit("handle_message_update", {
      message,
      roomId,
    });
  };
  socket.current?.on("collaborators_data", (data: [Collaborator]) => {
    console.log("Received collaborators:", data);
    const updatedCollaborators = data.map((collaborator: Collaborator) => {
      if (collaborator.socketId !== socket.current.id) {
        return { ...collaborator, isCurrentUser: false };
      } else {
        return { ...collaborator, pointer: null, isCurrentUser: true };
      }
    });
    setCollabs(updatedCollaborators);
    excalidrawAPI.updateScene({ collaborators: updatedCollaborators });
  });

  socket.current?.on("joined_room", (data: CollabProps["roomId"]) => {
    console.log(data, "has joined the room");
  });

  socket.current?.on("handle_excalidraw_state_update", (data: any) => {
    let previousVersion = localStorage.getItem("excalidraw_scene_version");
    if (!previousVersion) {
      previousVersion = "initial_version";
      localStorage.setItem("excalidraw_scene_version", previousVersion);
    }
    const serializedElements = serializeAsJSON(
      data["elements"],
      {},
      {},
      "local"
    );

    const currentVersion: string = serializedElements;

    localStorage.setItem("excalidraw_scene_version", currentVersion);
    console.log(data);
    if (previousVersion !== currentVersion)
      excalidrawAPI.updateScene({ elements: data["elements"] });
  });

  function handlePointerUpdate(payload: {
    pointer: { x: number; y: number; tool: "pointer" | "laser" };
    button: "down" | "up";
    pointersMap: Map<number, Readonly<{ x: number; y: number }>>;
  }): void {
    const { x, y, tool } = payload.pointer;
    const updatedCollaboratorPointer = {
      x: x,
      y: y,
      tool: tool,
    };

    socket.current.emit("handle_pointer_update", {
      updatedCollaboratorPointer,
      roomId,
    });
  }
  socket.current?.on("handle_message_update", (messages: string) => {
    setMessages(messages);
  });

  return (
    <>
      <div
        style={{
          height: "100vh",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <ChatBox
          isVisible={isVisible}
          username={username}
          messages={messages}
          onSocket={handleMessages}
          collabs={collabs}
          avatarUrl={avatarUrl}
        />
        <Excalidraw
          initialData={{ elements: initialData[0]?.elements }}
          onChange={handleEditorChange}
          theme={"light"}
          excalidrawAPI={(api) => {
            setAPI(api);
          }}
          onPointerUpdate={handlePointerUpdate}
          renderTopRightUI={() => <CollabModal room={roomId} />}
        >
          <Footer>
            <div className="ml-5">
              <Button
                onClick={() => {
                  setIsVisible(!isVisible);
                }}
                className="flex gap-2"
              >
                <div>chat Zone</div>
                <FontAwesomeIcon icon={faComments} />
              </Button>
            </div>
          </Footer>
        </Excalidraw>
      </div>
    </>
  );
};

export default Editor;
