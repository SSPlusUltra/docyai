"use client";

import { useRouter } from "next/navigation";
import supabase from "../../utils/supabase";
import { v4 as uuidv4 } from "uuid";

const Page = () => {
  let roomIdInput = "";
  const router = useRouter();

  const createRoom = async () => {
    try {
      const roomId = uuidv4();

      const { data, error } = await supabase
        .from("rooms")
        .insert([{ room_id: roomId }]);

      if (error) {
        console.error("Error creating room:", error);
        return;
      }

      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  const joinRoom = async (roomId: string) => {
    router.push(`/room/${roomId}`);
  };

  return (
    <div>
      <button onClick={createRoom}>Create room</button>
      <div className="flex gap-2">
        <input
          type="text"
          onChange={({ target }) => (roomIdInput = target.value)}
          className="border border-zinc-300"
        />

        <button onClick={() => joinRoom(roomIdInput)}>Join room</button>
      </div>
    </div>
  );
};
export default Page;
