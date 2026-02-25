export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 bg-card/30 backdrop-blur-md py-6 px-6 relative z-10">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground/60">
        <div className="flex items-center gap-3">
          <span className="font-black tracking-tighter gradient-text text-base">KUTTYBROTHERS</span>
          <span className="opacity-20">|</span>
          <span className="font-medium">© {currentYear} Management Hub</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="hover:text-primary transition-colors hover:underline underline-offset-4">Legal Hub</button>
          <button className="hover:text-primary transition-colors hover:underline underline-offset-4">System Support</button>
        </div>
      </div>
    </footer>
  );
}
