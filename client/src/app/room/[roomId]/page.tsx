import { useState } from "react";
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

const Page: React.FC<PageProps> = ({ params }) => {
  const { roomId } = params;
  return <RoomInputs roomId={roomId} />;
};

export default Page;
