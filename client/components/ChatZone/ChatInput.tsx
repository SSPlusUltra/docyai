import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InputWithButton } from "@/components/ui/inputwithbutton";
import Draggable from "react-draggable";
import ChatMessages from "./ChatMessages";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collaborator } from "@excalidraw/excalidraw/types/types";
import AIChatMessagegs from "./AIChatMessagegs";
import AIChatMessages from "./AIChatMessagegs";

interface ChatBoxProps {
  isVisible: boolean;
  collabs: Collaborator[];
  username: string;
  messages: Record<string, Message[]>;
  onSocket: (messages: string) => void;
  avatarUrl: string;
  aimessages: Record<string, AIMessage[]>;
  onAISocket: (messages: string) => void;
}
interface Message {
  sid: string;
  timestamp: string;
  text: string;
}

interface AIMessage {
  isuser: boolean;
  timestamp: string;
  text: string;
}

const ChatBox = ({
  isVisible,
  collabs,
  username,
  messages,
  onSocket,
  avatarUrl,
  aimessages,
  onAISocket,
}: ChatBoxProps) => {
  const [isChatBoxVisible, setIsChatBoxVisible] = useState(isVisible);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [isChatSelected, setIsChatSelected] = useState(true);
  const [isAiChat, setIsAiChat] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  const handleChatSelection = (isChat: boolean) => {
    setIsChatSelected(isChat);
  };
  useEffect(() => {
    setIsLoading(false);
  }, [aimessages]);

  useEffect(() => {
    if (chatBoxRef.current) {
      const windowHeight = window.innerHeight;
      const chatBoxHeight = chatBoxRef.current.offsetHeight;
      if (position.y + chatBoxHeight > windowHeight) {
        setPosition((prevPosition) => ({
          ...prevPosition,
          y: windowHeight - chatBoxHeight,
        }));
      }
    }
  }, [isVisible]);

  const handleAILoad = () => {
    setIsLoading(true);
  };

  return (
    <Draggable
      handle=".handle"
      position={position}
      onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
    >
      <div
        ref={chatBoxRef}
        className={`flex flex-col gap-2 justify-between cursor-move absolute bg-white top-20 right-20 px-2 z-50 border-4 border-black h-5/6 py-2 rounded-lg overflow-y-auto handle items-end ${
          isVisible ? "" : "hidden"
        }`}
      >
        <div className="flex items-center rounded-lg flex-row border-2 border-black self-center  mb-2">
          <div
            className={` text-sm text-center py-1 w-20 rounded-tl-md rounded-bl-md cursor-pointer transition-all duration-500 ${
              isChatSelected ? "bg-red-500 text-white" : ""
            }`}
            onClick={() => {
              setIsAiChat(false);
              handleChatSelection(true);
            }}
          >
            Chat
          </div>
          <div
            className={`px-2 text-sm py-1 w-20 text-center rounded-tr-md rounded-br-md cursor-pointer transition-all duration-500 ${
              !isChatSelected ? "bg-red-500 text-white" : ""
            }`}
            onClick={() => {
              setIsAiChat(true);
              handleChatSelection(false);
            }}
          >
            AI Chat
          </div>
        </div>
        <ScrollArea>
          <div>
            {isChatSelected ? (
              <ChatMessages
                collabs={collabs}
                username={username}
                messages={messages}
                avatarUrl={avatarUrl}
              />
            ) : (
              <AIChatMessages
                username={username}
                aimessages={aimessages}
                avatarUrl={avatarUrl}
              />
            )}
          </div>
          <div className="flex items-center py-2 px-4 ">
            <InputWithButton
              isAiChat={isAiChat}
              onAISocket={onAISocket}
              onSocket={onSocket}
              onAILoad={handleAILoad}
              realLoad={isloading}
            />
          </div>
        </ScrollArea>
      </div>
    </Draggable>
  );
};

export default ChatBox;
