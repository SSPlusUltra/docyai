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
                  : "https://img.freepik.com/premium-vector/support-bot-ai-assistant-flat-icon-with-blue-support-bot-white-background_194782-1421.jpg"
              }
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="border-2 h-auto border-black rounded w-60 rounded bg-white px-1">
            <div className="flex flex-col gap-2 text-sm">
              <div className="text-sm font-bold">
                {message.isuser ? username : "AI Assistant"}
              </div>
              <p>{message.text}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIChatMessages;
