import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  timestamp: string;
  text: string;
  isuser: boolean;
}

interface AIProps {
  aimessages: Record<string, Message[]>;
  username: string;
  avatarUrl: string;
}

const AIChatMessages = ({ avatarUrl, aimessages, username }: AIProps) => {
  const compareTimestamps = (a: Message, b: Message) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  };
  console.log(aimessages);
  const flattenedMessages: Message[] = Object.values(aimessages)
    .flatMap((messages) => messages)
    .map((message: Message) => ({
      isuser: message.isuser,
      timestamp: message.timestamp,
      text: message.text,
    }));

  const sortedMessages = flattenedMessages.sort(compareTimestamps);

  return (
    <div>
      {sortedMessages.map((message: Message, index: number) => (
        <div key={index} className="flex flex-row gap-2 mb-5">
          <Avatar>
            <AvatarImage
              src={
                message.isuser
                  ? avatarUrl
                  : "https://www.shutterstock.com/image-illustration/chat-bot-logo-smiling-virtual-260nw-2307651817.jpg"
              }
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="border-2 h-auto border-black rounded w-60 rounded bg-white px-1">
            <div className="flex flex-col gap-2 text-sm">
              <div className="text-sm font-bold">{username}</div>
              <p>{message.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIChatMessages;
