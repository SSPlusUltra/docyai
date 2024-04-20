"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import supabase from "../../utils/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import ProfileForm from "./FormInput";
const Editor = dynamic(() => import("../Editor/EditorUI"), {
  ssr: false,
});

interface RoomInputsProps {
  roomId: string;
}

export default function RoomInputs({ roomId }: RoomInputsProps) {
  const [name, setName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
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

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (avatarFile) {
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("images")
          .upload(`${roomId}/${avatarFile.name}`, avatarFile, {
            upsert: true,
          });

        if (uploadError) {
          throw uploadError;
        }
        const { data: publicUrlData } = await supabase.storage
          .from("images")
          .getPublicUrl(`${roomId}/${avatarFile.name}`);

        const { publicUrl } = publicUrlData;

        setAvatarUrl(publicUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    setRender(true);
  };
  return (
    <div>
      {!datarender && (
        <form
          className=" flex flex-col pt-20 items-center h-screen gap-5"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <div className="text-white text-sm font-bold">Username</div>
              <Input
                className="w-50 h-7 border-2"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={handleNameChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-white text-sm font-bold">Upload Image</div>
              <Input
                className="w-45 h-7"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
            <Button
              className="w-70 h-7 bg-green-500"
              variant={"secondary"}
              type="submit"
            >
              Submit
            </Button>
          </div>
          <div className="text-white">Tips:</div>
          <p className="text-black w-200 rounded px-2 bg-white">
            Now introducing Rooms, where your work is saved as long as you have
            access to your roomid.
          </p>
          <p className="text-white rounded">
            Collaborate all you want by inviting your friends, click on Share
            button on top right for the code.
          </p>
          <p className="text-black w-200 rounded px-2 bg-white">
            Never worry about losing your progress, your work is safe with us
            😉.
          </p>
          <p className="text-white rounded">
            Chat with people real time, chat area loves you . Its always present
            at the bottom left of the screen.
          </p>
          <p className="text-black w-200 rounded px-2 bg-white">
            No account creation or password barriers. Dive right in, all you
            need is right here.
          </p>
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
