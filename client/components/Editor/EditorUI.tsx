"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import debounce from "lodash.debounce";
import { Excalidraw, getSceneVersion } from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";

const Editor = () => {
  const [excalidrawAPI, setAPI] = useState<any>();
  const socket = useRef<any>();
  const previousVersion = useRef<number | null>(null);

  useEffect(() => {
    socket.current = io("http://localhost:8000", {
      transports: ["websocket"],
    });

    socket.current.on("connect", () => {
      console.log(`${socket.current.id} connected`);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const debouncedHandleEditorChange = useRef(
    debounce((elements: readonly ExcalidrawElement[]) => {
      socket.current.emit("handle_excalidraw_state_update", { elements });
    }, 500)
  ).current;

  const handleEditorChange = (elements: readonly ExcalidrawElement[]): void => {
    const version = getSceneVersion(elements);
    if (version !== previousVersion.current) {
      debouncedHandleEditorChange(elements);
      previousVersion.current = version;
    }
  };

  socket.current?.on("collaborators_data", (data: any) => {
    console.log("Received collaborators:", data);
    excalidrawAPI.updateScene({ collaborators: data });
  });

  socket.current?.on("handle_excalidraw_state_update", (data: any) => {
    console.log(data);
    excalidrawAPI.updateScene({ elements: data["elements"] });
  });

  return (
    <>
      <div style={{ height: "500px" }}>
        <Excalidraw
          onChange={handleEditorChange}
          isCollaborating={true}
          excalidrawAPI={(api) => setAPI(api)}
        />
      </div>
    </>
  );
};

export default Editor;
