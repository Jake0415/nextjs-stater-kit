export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left lg:px-10">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} MH OCR AI. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <span>MH Platform v1.0</span>
        </div>
      </div>
    </footer>
  );
}
