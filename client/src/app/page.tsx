"use client";

import { useRouter } from "next/navigation";
import supabase from "../../utils/supabase";
import { v4 as uuidv4 } from "uuid";
import NavBar from "../../components/Navbar/Navbar";
import HomePage from "../../components/Home/HomePage";
import { Toast, ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

const Page = () => {
  const { toast } = useToast();
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
    try {
      const { data: roomData, error: roomError } = await supabase
        .from("rooms")
        .select("*")
        .eq("room_id", roomId)
        .single();

      if (!roomData) {
        toast({
          variant: "destructive",
          title: "Uh oh! that room doesn't exist. Wanna create one?",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        return;
      }

      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="flex flex-col gap-20 justify-center items-center">
      <NavBar />
      <HomePage onCreateRoom={createRoom} onJoinRoom={joinRoom} />
      <Toaster />
    </div>
  );
};
export default Page;
