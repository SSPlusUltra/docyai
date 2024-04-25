"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function InputWithButton({
  onSocket,
  onAISocket,
  isAiChat,
  onAILoad,
  realLoad,
}: any) {
  const [message, setMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setMessage(e.target.value);
  }

  function handleClick(): void {
    if (isAiChat) {
      onAILoad(true);
      onAISocket(message);
    } else onSocket(message);
    console.log(message);
    setMessage("");
  }

  return (
    <div className="flex max-w-sm space-x-2 align-self-end justify-center mr-5 ">
      <Input
        type="text"
        placeholder="Type your message"
        value={message}
        onChange={handleChange} // Use handleChange function for onChange event
      />
      <Button
        onClick={handleClick}
        size="sm"
        type="button"
        className="relative"
      >
        {realLoad ? (
          <div className="flex items-center">
            <div>Generating</div>
            {realLoad && (
              <div className="ml-2 w-3 h-3 border-2 border-white rounded-full animate-spin"></div>
            )}
          </div>
        ) : (
          <div>Send</div>
        )}
      </Button>
    </div>
  );
}
