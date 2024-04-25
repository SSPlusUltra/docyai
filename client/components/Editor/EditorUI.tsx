"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import debounce from "lodash.debounce";
import throttle from "lodash.throttle";
import {
  Excalidraw,
  Footer,
  MainMenu,
  getSceneVersion,
  serializeAsJSON,
} from "@excalidraw/excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";
import {
  AppState,
  BinaryFiles,
  Collaborator,
} from "@excalidraw/excalidraw/types/types";
import ChatBox from "../ChatZone/ChatInput";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import CollabModal from "../CollabModal/CollabModal";
import useSocket from "../../hooks/useSocket";

interface InputProps {
  username: string;
  avatarUrl: string;
  roomId: string;
  initialData: any;
}
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

const collaboratorMap = new Map();

const Editor = ({ username, avatarUrl, roomId, initialData }: InputProps) => {
  const [excalidrawAPI, setAPI] = useState<any>();
  const socket = useRef<any>();
  const previousVersion = useRef<number | null>(null);
  const [messages, setMessages] = useState({});
  const [collabs, setCollabs] = useState<any>();
  const [isVisible, setIsVisible] = useState(false);
  const [aimessages, setAiMessages] = useState({});

  const handleBroadcastedAIMessages = (messages: string) => {
    setAiMessages(messages);
  };

  const handleBroadcastedMessages = (messages: string) => {
    setMessages(messages);
  };

  const handleCollabs = (collabs: [Collaborator]) => {
    setCollabs(collabs);
  };
  const collabdata: CollabProps = {
    username,
    avatarUrl,
    roomId,
    initialData,
    excalidrawAPI,
  };

  const broadcastedMessages: BroadcastedMessageProps = {
    handleBroadcastedMessages,
    handleBroadcastedAIMessages,
    handleCollabs,
  };

  const {
    handleAIMessages,
    handleMessages,
    handleEditorChange,
    handlePointerUpdate,
  } = useSocket({
    collabdata,
    broadcastedMessages,
  });

  const handleEmitPointerUpdate = (payload: {
    pointer: { x: number; y: number; tool: "pointer" | "laser" };
    button: "up" | "down";
    pointersMap: Map<number, Readonly<{ x: number; y: number }>>;
  }): void => {
    handlePointerUpdate(payload);
  };

  const handleEmiteEditorChange = (
    elements: readonly ExcalidrawElement[]
  ): void => {
    handleEditorChange(elements);
  };

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
          aimessages={aimessages}
          onAISocket={handleAIMessages}
        />
        <Excalidraw
          initialData={{ elements: initialData[0]?.elements }}
          onChange={handleEmiteEditorChange}
          excalidrawAPI={(api) => {
            setAPI(api);
          }}
          onPointerUpdate={handleEmitPointerUpdate}
          renderTopRightUI={() => <CollabModal room={roomId} />}
        >
          <MainMenu>
            <MainMenu.DefaultItems.ToggleTheme />
            <MainMenu.DefaultItems.Export />
            <MainMenu.ItemLink href="/">Home</MainMenu.ItemLink>
          </MainMenu>
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
