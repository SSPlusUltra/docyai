"use client";

import "tldraw/tldraw.css";
import dynamic from "next/dynamic";
const Tldraw = dynamic(async () => (await import("tldraw")).Tldraw, {
  ssr: false,
});

const Editor = () => {
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw />
    </div>
  );
};

export default Editor;
