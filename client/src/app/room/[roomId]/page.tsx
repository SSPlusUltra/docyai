import { useState } from "react";
import ExcalidrawWrapper from "../../../../components/Editor/EditorUI";
import RoomInputs from "../../../../components/inputs/RoomInputs";
import supabase from "../../../../utils/supabase";

interface PageProps {
  params: {
    roomId: string;
  };
}

interface roomData {
  room_id: string;
  collab_id: string;
  elements: string;
}

export async function Page({ params }: PageProps) {
  const { roomId } = params;

  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("room_id", roomId)
    .single();

  if (error) {
    console.error("Error fetching room:", error.message);
  }

  return <RoomInputs roomData={data} />;
}

export default Page;
