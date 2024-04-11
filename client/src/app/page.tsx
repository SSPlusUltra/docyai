import dynamic from "next/dynamic";

const ExcalidrawWrapper = dynamic(
  async () => (await import("../../components/Editor/EditorUI")).default,
  {
    ssr: false,
  }
);

export default function Page() {
  return <ExcalidrawWrapper />;
}
