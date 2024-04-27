//socket connection logic
"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import throttle from "lodash.throttle";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import { getSceneVersion, serializeAsJSON } from "@excalidraw/excalidraw";
import { Collaborator } from "@excalidraw/excalidraw/types/types";

interface CollabProps {
  username: string;
  avatarUrl: string;
  roomId: string;
  initialData: any;
  excalidrawAPI: any;
}

interface BroadcastedMessageProps {
  handleBroadcastedMessages: (messages: string) => void;
  handleBroadcastedAIMessages: (messages: string) => void;
  handleCollabs: (data: [Collaborator]) => void;
}

interface SocketProps {
  broadcastedMessages: BroadcastedMessageProps;
  collabdata: CollabProps;
}

const useSocket = ({ collabdata, broadcastedMessages }: SocketProps) => {
  const socket = useRef<any>();
  const collaboratorMap = new Map();
  const [dataE, setDataE] = useState<any>(collabdata.initialData[0]?.elements);
  const previousVersion = useRef<number | null>(null);
  const collaboratorInfo = {
    pointer: null,
    username: collabdata.username,
    color: { background: "#ff0000", stroke: "#ff0000" },
    avatarUrl: collabdata.avatarUrl,
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
      socket.current.emit("join_room", collabdata.roomId);
      socket.current.emit("collaborators_data", {
        collaboratorInfo,
        roomId: collabdata.roomId,
      });
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const debouncedHandleEditorChange = useRef(
    throttle((elements: readonly ExcalidrawElement[]) => {
      socket.current.emit("handle_excalidraw_state_update", {
        elements,
        roomId: collabdata.roomId,
      });
    }, 800)
  ).current;

  const handleEditorChange = (elements: readonly ExcalidrawElement[]): void => {
    const version = getSceneVersion(elements);
    const ele = collabdata.excalidrawAPI.getSceneElements();
    const app_state = collabdata.excalidrawAPI.getAppState();
    if (
      version != previousVersion.current &&
      (ele.length > 0 || app_state["activeTool"]["type"] == "eraser")
    ) {
      setDataE(elements);
      debouncedHandleEditorChange(elements);
      previousVersion.current = version;
    }
  };

  const handleMessages = (message: string) => {
    socket.current?.emit("handle_message_update", {
      message,
      roomId: collabdata.roomId,
    });
  };

  const handleAIMessages = (message: string) => {
    socket.current?.emit("handle_summary_update", {
      elements: dataE,
      question: message,
    });
  };

  socket.current?.on("handle_summary_update", (data: string) => {
    broadcastedMessages.handleBroadcastedAIMessages(data);
  });

  socket.current?.on("handle_message_update", (messages: string) => {
    broadcastedMessages.handleBroadcastedMessages(messages);
  });

  socket.current?.on("collaborators_data", (data: [Collaborator]) => {
    console.log("Received collaborators:", data);
    const updatedCollaborators: any = data.map((collaborator: any) => {
      if (collaborator.socketId !== socket.current.id) {
        return { ...collaborator, isCurrentUser: false };
      } else {
        return { ...collaborator, pointer: null, isCurrentUser: true };
      }
    });
    broadcastedMessages.handleCollabs(updatedCollaborators);
    collabdata.excalidrawAPI.updateScene({
      collaborators: updatedCollaborators,
    });
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
    if (previousVersion !== currentVersion) {
      collabdata.excalidrawAPI.updateScene({ elements: data["elements"] });
    }
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
      roomId: collabdata.roomId,
    });
  }

  return {
    handleAIMessages,
    handleMessages,
    handleEditorChange,
    handlePointerUpdate,
  };
};
export default useSocket;
