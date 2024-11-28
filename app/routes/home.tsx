import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Heroes of Cheese Madness" },
    { name: "description", content: "Start a new game!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
