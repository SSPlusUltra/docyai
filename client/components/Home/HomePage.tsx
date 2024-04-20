import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { MouseEventHandler, useState } from "react";
import excalidraw from "../../public/exc.png";
import Link from "next/link";

interface HomeProps {
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: () => void;
}

const HomePage = ({ onJoinRoom, onCreateRoom }: HomeProps) => {
  const [roomId, setRoomId] = useState<string>("");
  return (
    <div className="flex flex-col items-center gap-10">
      <div className=" flex items-center flex-col gap-2 text-white">
        <div className=" flex flex-row gap-1 font-bold text-2xl">
          <div>Let Your Ideas</div>
          <div className="text-blue-500">Flow</div>
          <div>With The</div>
          <div className="text-blue-500">Vibe</div>
        </div>
        <div>Build | Draw | Collab</div>
      </div>
      <Button
        onClick={onCreateRoom}
        className="bg-white"
        size={"sm"}
        variant={"secondary"}
      >
        Create Room
      </Button>
      <div>
        <div className="text-white">OR</div>
      </div>
      <div className="flex flex-row items-center gap-1">
        <Input
          placeholder="enter your roomId :D"
          value={roomId}
          onChange={(event) => {
            setRoomId(event.target.value);
          }}
        />
        <Button
          onClick={() => {
            onJoinRoom(roomId);
            setRoomId("");
          }}
          size={"sm"}
          className="bg-red-500"
          variant={"secondary"}
        >
          Join One
        </Button>
      </div>
      <div className="flex flex-row items-center gap-5">
        <div className="text-white">Powered By </div>

        <a href="https://excalidraw.com">
          <Image src={excalidraw} height={50} alt={"excalidraw image"} />
        </a>
      </div>
    </div>
  );
};

export default HomePage;
