"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("../Editor/EditorUI"), {
  ssr: false, // This tells Next.js not to server-render this component
});

export default function RoomInputs({ roomData }: any) {
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [datarender, setRender] = useState(false);

  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handleAvatarUrlChange = (event: any) => {
    setAvatarUrl(event.target.value);
  };

  const handleSubmit = (event: any) => {
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
          roomId={roomData["room_id"]}
        />
      )}
    </div>
  );
}
