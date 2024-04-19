"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function InputWithButton({ onSocket }: any) {
  const [message, setMessage] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    // Update the message state when the input value changes
    setMessage(e.target.value);
  }

  function handleClick(): void {
    // Pass the message to the onSocket function when the button is clicked
    onSocket(message);
    console.log(message);
    // Clear the input field after sending the message
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
      <Button onClick={handleClick} size="sm" type="button">
        Send
      </Button>
    </div>
  );
}
