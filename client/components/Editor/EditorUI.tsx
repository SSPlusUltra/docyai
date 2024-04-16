"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import debounce from "lodash.debounce";
import avatar from "../../public/next.svg";
import {
  Excalidraw,
  LiveCollaborationTrigger,
  getSceneVersion,
} from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";

// const collaboratorPointer = {
//   x: null,
//   y: null,
//   tool: "pointer",
//   renderCursor: true,
//   laserColor: "#FF0000",
// };

interface CollabProps {
  username: string;
  avatarUrl: string;
  roomId: string;
}

const collaboratorMap = new Map();

const Editor = ({ username, avatarUrl, roomId }: CollabProps) => {
  const [excalidrawAPI, setAPI] = useState<any>();
  const socket = useRef<any>();
  const previousVersion = useRef<number | null>(null);

  const collaboratorInfo = {
    pointer: null,
    username: username,
    // userState: collaboratorUserIdleStateValue,
    color: {
      background: "red",
      stroke: "blue",
    },
    avatarUrl: avatarUrl,
    // socketId: collaboratorSocketIdValue,
    // isCurrentUser: collaboratorIsCurrentUserValue,
  };

  useEffect(() => {
    socket.current = io("http://localhost:8000", {
      transports: ["websocket"],
    });

    socket.current.on("connect", () => {
      console.log(`${socket.current.id} connected`);
      collaboratorMap.set(socket.current.id, collaboratorInfo);
      socket.current.emit("join_room", roomId);
      socket.current.emit("collaborators_data", { collaboratorInfo, roomId });
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

    // console.log("curr_scene", ele);

    const app_state = excalidrawAPI.getAppState();

    // console.log("AS", app_state);

    if (
      version !== previousVersion.current &&
      (ele.length > 0 || app_state["activeTool"]["type"] == "eraser")
    ) {
      debouncedHandleEditorChange(elements);
      previousVersion.current = version;
    }
  };

  // socket.current?.on("scene_data", (data: any) => {
  //   console.log("Received scene_data:", data);
  //   excalidrawAPI.updateScene({ elements: data });
  // });

  socket.current?.on("collaborators_data", (data: any) => {
    console.log("Received collaborators:", data);
    excalidrawAPI.updateScene({ collaborators: data });
  });

  socket.current?.on("joined_room", (data: any) => {
    console.log(data, "has joined the room");
  });

  socket.current?.on("handle_excalidraw_state_update", (data: any) => {
    console.log(data);
    excalidrawAPI.updateScene({ elements: data["elements"] });
  });

  function handlePointerUpdate(payload: {
    pointer: { x: number; y: number; tool: "pointer" | "laser" };
    button: "down" | "up";
    pointersMap: Map<number, Readonly<{ x: number; y: number }>>;
  }): void {
    const { x, y } = payload.pointer;
    const updatedCollaboratorPointer = {
      x: x,
      y: y,
    };

    socket.current.emit("handle_pointer_update", {
      updatedCollaboratorPointer,
      roomId,
    });
  }

  return (
    <>
      <div style={{ height: "500px" }}>
        <Excalidraw
          onChange={handleEditorChange}
          excalidrawAPI={(api) => setAPI(api)}
          onPointerUpdate={handlePointerUpdate}
          renderTopRightUI={() => (
            <LiveCollaborationTrigger
              isCollaborating={true}
              onSelect={() => {
                window.alert("You clicked on collab button");
              }}
            />
          )}
        ></Excalidraw>
      </div>
    </>
  );
};

export default Editor;
