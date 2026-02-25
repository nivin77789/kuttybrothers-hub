import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useCustomization } from "@/components/CustomizationProvider";
import { Moon, Sun, User, Bell, Shield, Palette, Layout as LayoutIcon, Check } from "lucide-react";

const colorThemes = [
  { id: "default", name: "Classic Blue", color: "bg-blue-500" },
  { id: "theme-emerald", name: "Neon Emerald", color: "bg-emerald-500" },
  { id: "theme-rose", name: "Sunset Rose", color: "bg-rose-500" },
  { id: "theme-amber", name: "Midnight Gold", color: "bg-amber-500" },
  { id: "theme-violet", name: "Royal Purple", color: "bg-violet-500" },
  { id: "theme-midnight", name: "Deep Space", color: "bg-slate-900" },
] as const;

const designStyles = [
  { id: "default", name: "Modern Hub (Default)", desc: "The standard high-end interface." },
  { id: "design-glass", name: "Glassmorphism", desc: "Frosted glass effects and depth." },
  { id: "design-minimal", name: "Zero Gravity", desc: "Clean, borderless, and minimalist." },
  { id: "design-industrial", name: "Industrial", desc: "Sharp edges and technical precision." },
  { id: "design-luxury", name: "Classic Luxury", desc: "Elegant serif fonts and gold accents." },
  { id: "design-cyberpunk", name: "Cyber Hub", desc: "High-contrast neon and futuristic glows." },
] as const;

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { colorTheme, setColorTheme, designStyle, setDesignStyle } = useCustomization();

  return (
    <Layout showBack title="Settings">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-4xl pb-24">
        {/* Appearance & Themes */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Palette className="h-6 w-6 text-primary" />
            Visual Customization
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Color Themes */}
            <Card className="border-0 shadow-xl bg-card/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Brand Interface</CardTitle>
                <CardDescription>Choose your primary operational color palette</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {colorThemes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setColorTheme(t.id)}
                      className={`
                        group relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all
                        ${colorTheme === t.id ? "border-primary bg-primary/5 shadow-lg shadow-primary/10" : "border-transparent hover:border-border hover:bg-muted/50"}
                      `}
                    >
                      <div className={`w-10 h-10 rounded-full ${t.color} mb-2 shadow-inner group-hover:scale-110 transition-transform`} />
                      <span className="text-[10px] font-bold uppercase tracking-tight text-center">{t.name}</span>
                      {colorTheme === t.id && (
                        <div className="absolute top-1 right-1 bg-primary text-white p-0.5 rounded-full">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mode Switch */}
            <Card className="border-0 shadow-xl bg-card/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Display Mode</CardTitle>
                <CardDescription>Switch between Day and Night operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
                    <div>
                      <Label className="text-base font-bold">Dark Mode</Label>
                      <p className="text-xs text-muted-foreground">High-contrast nighttime view</p>
                    </div>
                  </div>
                  <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Design Style */}
          <Card className="border-0 shadow-xl bg-card/40 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <LayoutIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Design Archetype</CardTitle>
                  <CardDescription>Select a layout style that suits your working preference</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {designStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setDesignStyle(style.id)}
                    className={`
                      relative flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left
                      ${designStyle === style.id ? "border-primary bg-primary/5 ring-4 ring-primary/5" : "border-border/50 hover:border-primary/30 hover:bg-muted/50"}
                    `}
                  >
                    <span className="text-sm font-black mb-1">{style.name}</span>
                    <span className="text-xs text-muted-foreground leading-tight">{style.desc}</span>
                    {designStyle === style.id && (
                      <Check className="absolute top-4 right-4 h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Profile */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10"><User className="h-5 w-5 text-primary" /></div>
              <div><CardTitle className="text-lg font-bold">Profile Settings</CardTitle><CardDescription>Update your personal and work credentials</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2"><Label className="text-xs font-black uppercase tracking-widest opacity-60">Full Name</Label><Input defaultValue="Admin User" className="h-12 rounded-xl" /></div>
              <div className="space-y-2"><Label className="text-xs font-black uppercase tracking-widest opacity-60">Email Address</Label><Input defaultValue="admin@kuttybrothers.com" className="h-12 rounded-xl" /></div>
              <div className="space-y-2"><Label className="text-xs font-black uppercase tracking-widest opacity-60">Phone Contact</Label><Input defaultValue="+91 98765 43210" className="h-12 rounded-xl" /></div>
              <div className="space-y-2"><Label className="text-xs font-black uppercase tracking-widest opacity-60">System Role</Label><Input defaultValue="Administrator" disabled className="h-12 rounded-xl bg-muted/50" /></div>
            </div>
            <Button className="h-12 px-8 gradient-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Save Profile Changes</Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-destructive" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10"><Shield className="h-5 w-5 text-destructive" /></div>
              <div><CardTitle className="text-lg font-bold">Security</CardTitle><CardDescription>Manage your gateway authentication</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-md space-y-4">
              <div className="space-y-2"><Label className="text-xs font-black uppercase tracking-widest">Current Password</Label><Input type="password" placeholder="••••••••" className="h-12 rounded-xl" /></div>
              <div className="space-y-2"><Label className="text-xs font-black uppercase tracking-widest">New Password</Label><Input type="password" placeholder="••••••••" className="h-12 rounded-xl" /></div>
              <Button variant="outline" className="h-11 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5 font-bold">Rotate Password</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SettingsPage;
