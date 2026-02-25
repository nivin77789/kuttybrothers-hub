import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { Lock, Mail, LogIn, ShieldCheck, Zap, Globe, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate a fast login experience
    setTimeout(() => {
      navigate("/dashboard");
    }, 800);
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.5,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/30">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <main className="flex flex-1 flex-col md:flex-row overflow-hidden relative">
        {/* Left Side: Branding & Info */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden md:flex md:w-[60%] flex-col justify-center p-12 lg:p-24 relative overflow-hidden mesh-background text-white"
        >
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-white/10 blur-[120px]"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -90, 0],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-primary/20 blur-[120px]"
            />
          </div>

          <div className="relative z-10 max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium mb-6 animate-pulse-slow">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>System Status: Optimal</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6">
                KUTTY<span className="text-white/70">BROTHERS</span>
              </h1>
              <p className="text-xl text-white/80 mb-10 leading-relaxed">
                Empowering your business with a unified management hub. Streamlined, secure, and built for growth.
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                { icon: ShieldCheck, title: "Secure Infrastructure", desc: "Enterprise-grade security for your data." },
                { icon: Zap, title: "Real-time Analytics", desc: "Instant insights into your operations." },
                { icon: Globe, title: "Global Access", desc: "Manage your business from anywhere." }
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={featureVariants}
                  className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-white/5 transition-colors duration-300 border border-transparent hover:border-white/10 group"
                >
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{feature.title}</h3>
                    <p className="text-white/60 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Side: Login Card */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 bg-background relative"
        >
          {/* Mobile Background Branding (Only visible on small screens) */}
          <div className="md:hidden absolute inset-0 mesh-background -z-10" />

          <Card className="w-full max-w-md relative z-10 overflow-hidden ring-1 ring-white/20 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 gradient-primary" />

            <CardContent className="p-8 lg:p-10">
              <div className="mb-10 block md:hidden">
                <h1 className="text-3xl font-black tracking-tight text-white mb-2">KUTTYBROTHERS</h1>
                <div className="w-12 h-1 bg-white rounded-full mb-8" />
              </div>

              <div className="mb-10">
                <h2 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h2>
                <p className="text-muted-foreground">Please enter your credentials to access the hub.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold opacity-70">EMAIL ADDRESS</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10 h-12 bg-background/50 border-white/10 focus:ring-2 focus:ring-primary/20 transition-all rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-semibold opacity-70">PASSWORD</Label>
                    <button type="button" className="text-xs font-medium text-primary hover:underline">Forgot Password?</button>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 h-12 bg-background/50 border-white/10 focus:ring-2 focus:ring-primary/20 transition-all rounded-xl"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 gradient-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <span>Secure Login</span>
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center pt-8 border-t border-border/50">
                <p className="text-sm text-muted-foreground">
                  New to the hub? <button type="button" className="text-primary font-semibold hover:underline">Contact Administrator</button>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Bottom branding detail */}
          <div className="mt-12 text-center md:text-left w-full max-w-md opacity-50">
            <p className="text-xs font-medium">© 2026 KUTTYBROTHERS MANAGEMENT HUB. ALL RIGHTS RESERVED.</p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
