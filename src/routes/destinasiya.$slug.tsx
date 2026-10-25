import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/destinasiya/$slug")({
  component: () => <Outlet />,
});
