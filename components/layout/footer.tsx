import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-8 md:flex-row md:justify-between">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} StarterKit. All rights reserved.
        </p>
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <Link href="#" className="hover:text-foreground transition-colors">
            개인정보처리방침
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Link href="#" className="hover:text-foreground transition-colors">
            이용약관
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Link
            href="https://github.com"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}
