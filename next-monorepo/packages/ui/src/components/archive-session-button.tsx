import Link from "next/link";
import { cn } from "../utils";
import { Button } from "./button";
import { ArchiveIcon } from "./icons";

export function ArchiveSessionButton({ link, className }: Props) {
  return (
    <Button variant={"outline"} asChild className={cn("flex items-center gap-2 rounded-xl border px-4 py-2", className)}>
      <Link href={link}>
        <ArchiveIcon className="h-4 w-4" /> <span className="text-sm font-medium">See archived sessions</span>
      </Link>
    </Button>
  );
}

type Props = {
  link: string;
  className?: string;
};
