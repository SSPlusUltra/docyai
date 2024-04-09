"use client";
import "tldraw/tldraw.css";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { io } from "socket.io-client";

const Tldraw = dynamic(async () => (await import("tldraw")).Tldraw, {
  ssr: false,
});

const Editor = () => {
  useEffect(() => {
    const socket = io("http://localhost:8000");

    socket.on("connect", () => {
      console.log(`${socket.id} connected`);
    });
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw />
    </div>
  );
};

export default Editor;
