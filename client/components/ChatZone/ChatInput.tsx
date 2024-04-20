import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InputWithButton } from "@/components/ui/inputwithbutton";
import Draggable from "react-draggable";
import ChatMessages from "./ChatMessages";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collaborator } from "@excalidraw/excalidraw/types/types";

interface ChatBoxProps {
  isVisible: boolean;
  collabs: Collaborator[];
  username: string;
  messages: Record<string, Message[]>;
  onSocket: (messages: string) => void;
  avatarUrl: string;
}
interface Message {
  sid: string;
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
}: ChatBoxProps) => {
  const [isChatBoxVisible, setIsChatBoxVisible] = useState(isVisible);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const chatBoxRef = useRef<HTMLDivElement>(null);

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

  return (
    <Draggable
      handle=".handle"
      position={position}
      onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
    >
      <div
        ref={chatBoxRef}
        className={`flex flex-col-reverse gap-2  cursor-move absolute bg-white top-20 right-20 px-2 z-50 border-4 border-black h-5/6 py-2 rounded-lg overflow-y-auto handle items-end ${
          isVisible ? "" : "hidden"
        }`}
      >
        <ScrollArea>
          <div className="grow">
            <ChatMessages
              collabs={collabs}
              username={username}
              messages={messages}
              avatarUrl={avatarUrl}
            />
          </div>
          <div className="flex items-center py-2 px-4 ">
            <InputWithButton onSocket={onSocket} />
          </div>
        </ScrollArea>
        <div className="grow self-center font-bold mb-2">Chat Area</div>
      </div>
    </Draggable>
  );
};

export default ChatBox;
