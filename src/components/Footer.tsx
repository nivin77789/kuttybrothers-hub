export function Footer() {
  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm py-4 px-6">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-bold gradient-text">KUTTYBROTHERS</span>
          <span>|</span>
          <span>© 2025 Hevinka</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="hover:text-foreground transition-colors">Privacy Policy</button>
          <button className="hover:text-foreground transition-colors">Terms & Conditions</button>
        </div>
      </div>
    </footer>
  );
}
