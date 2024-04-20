import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Collaborator } from "@excalidraw/excalidraw/types/types";

interface Message {
  sid: string;
  timestamp: string;
  text: string;
}

interface ChatMessagesProps {
  collabs: Collaborator[];
  messages: Record<string, Message[]>;
  avatarUrl: string;
  username: string;
}

const ChatMessages = ({ collabs, messages, avatarUrl }: ChatMessagesProps) => {
  const compareTimestamps = (a: Message, b: Message) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  };

  const flattenedMessages = Object.keys(messages).reduce(
    (acc: Message[], sid) => {
      return acc.concat(
        messages[sid].map((message: Message) => ({
          sid,
          timestamp: message.timestamp,
          text: message.text,
        }))
      );
    },
    []
  );

  console.log(collabs);

  const sortedMessages = flattenedMessages.sort(compareTimestamps);

  return (
    <div>
      {sortedMessages.map((message: Message, index: number) => (
        <div key={index} className="flex flex-row gap-2 mb-5">
          <Avatar>
            <AvatarImage
              src={
                collabs.find((collab: any) => collab.socketId === message.sid)
                  ?.avatarUrl || ""
              }
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="border-2 h-auto border-black rounded w-60 rounded bg-white px-1">
            <div className="flex flex-col gap-2 text-sm">
              <div className="text-sm font-bold">
                {
                  collabs.find((collab: any) => collab.socketId === message.sid)
                    ?.username
                }
              </div>
              <p>{message.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
