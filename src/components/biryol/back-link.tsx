import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

type Props =
  | { to: "/"; label: string; params?: never }
  | { to: "/destinasiya/$slug"; label: string; params: { slug: string } }
  | { to: "/destinasiya/$slug/rooms"; label: string; params: { slug: string } };

export function BackLink(props: Props) {
  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={props.to as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params={props.params as any}
      className="inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-primary hover:underline"
    >
      <ArrowLeft className="h-4 w-4 shrink-0" />
      {props.label}
    </Link>
  );
}
