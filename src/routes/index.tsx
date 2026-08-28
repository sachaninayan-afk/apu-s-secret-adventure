import { createFileRoute } from "@tanstack/react-router";
import { App } from "@/components/apu/App";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Apu's Secret Adventure" },
      { name: "description", content: "A memory you weren't supposed to find." },
    ],
  }),
});

function Index() {
  return <App />;
}
