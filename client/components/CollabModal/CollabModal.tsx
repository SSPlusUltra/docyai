import { DialogCloseButton } from "@/components/ui/share";

const CollabModal = ({ room }: { room: string }) => {
  console.log(room);
  return (
    <div>
      <DialogCloseButton roomId={room} />
    </div>
  );
};

export default CollabModal;
