"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import supabase from "../../utils/supabase";
const Editor = dynamic(() => import("../Editor/EditorUI"), {
  ssr: false,
});

export default function RoomInputs({ roomId }: any) {
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [datarender, setRender] = useState(false);
  const [data, setData] = useState<any>();
  useEffect(() => {
    // Function to fetch data from Supabase
    async function fetchData() {
      try {
        // Example: fetching data from a 'todos' table
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

  console.log(data);

  // const dataObject = JSON.parse(roomData["elements"]);

  // const formattedDataString = JSON.stringify(dataObject, (key, value) => {
  //   if (typeof value === "object" && value !== null) {
  //     const newValue: any = {};
  //     for (const k in value) {
  //       if (Object.prototype.hasOwnProperty.call(value, k)) {
  //         newValue[k.replace(/"/g, "")] = value[k];
  //       }
  //     }
  //     return newValue;
  //   }
  //   return value;
  // });

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
