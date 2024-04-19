"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import supabase from "../../utils/supabase";
const Editor = dynamic(() => import("../Editor/EditorUI"), {
  ssr: false,
});

interface RoomInputsProps {
  roomId: string;
}

export default function RoomInputs({ roomId }: RoomInputsProps) {
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [datarender, setRender] = useState(false);
  const [data, setData] = useState<any>();
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: rooms, error } = await supabase
          .from("rooms")
          .select("elements")
          .eq("room_id", roomId);

        if (error) {
          throw error;
        }

        setData(rooms);
      } catch (error: any) {
        console.error("Error fetching data:", error.message);
      }
    }
    fetchData();
  }, []);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleAvatarUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAvatarUrl(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRender(true);
  };

  return (
    <div>
      {!datarender && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={handleNameChange}
          />
          <input
            type="text"
            placeholder="Enter avatar URL"
            value={avatarUrl}
            onChange={handleAvatarUrlChange}
          />
          <button type="submit">Submit</button>
        </form>
      )}

      {datarender && (
        <Editor
          username={name}
          avatarUrl={avatarUrl}
          roomId={roomId}
          initialData={data}
        />
      )}
    </div>
  );
}
