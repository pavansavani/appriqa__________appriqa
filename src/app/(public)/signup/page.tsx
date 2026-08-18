"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DURATION, EASE } from "@/lib/motion";
import { Mail, User, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Suspense } from "react";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  
  // Form Data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${nextPath || "/account"}`
      }
    });
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
            customer_type: 'ecommerce'
          }
        }
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      setSuccessMsg(`We sent verification message on your ${email}. Please verify it.`);

      // Clear password fields for security
      setPassword("");
      setConfirmPassword("");

    } catch (e) {
      const err = e as Error;
      setErrorMsg(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)] pt-20 pb-20 px-4 relative">
      <div className="absolute inset-0 bg-background z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] mix-blend-screen" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.base, ease: EASE.standard }}
        className="w-full max-w-lg bg-card border border-border/80 rounded-2xl shadow-2xl relative z-10 overflow-hidden shadow-[0_0_50px_rgba(255,106,0,0.05)]"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl mb-2 text-foreground">
              Create Account
            </h1>
            <p className="text-muted-foreground text-sm">
              Start your journey with APPRIQA
            </p>
          </div>

          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-destructive">{errorMsg}</p>
              </motion.div>
            )}
            {successMsg && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-emerald-500">{successMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {!isSuccess ? (
            <form onSubmit={handleSignupSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-background border border-border rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-primary transition-colors disabled:opacity-50"
                      placeholder="John"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-background border border-border rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-primary transition-colors disabled:opacity-50"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-background border border-border rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-primary transition-colors disabled:opacity-50"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-background border border-border rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-primary transition-colors disabled:opacity-50"
                    placeholder="Min. 8 characters"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-background border border-border rounded-xl py-3.5 pl-10 pr-4 outline-none focus:border-primary transition-colors disabled:opacity-50"
                    placeholder="Re-enter password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-bold mt-2"
              >
                {isSubmitting ? "Creating Account..." : "SIGN UP"}
              </Button>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border/40" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground font-semibold">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-12 font-bold mt-6"
                  onClick={handleGoogleLogin}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Google
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-6">
                Please check your email and click the verification link to activate your account. Once verified, you can log in below.
              </p>
              <Link href="/login">
                <Button className="w-full h-12 font-bold">
                  Go to Log In
                </Button>
              </Link>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border/40 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href={nextPath ? `/login?next=${encodeURIComponent(nextPath)}` : "/login"} className="text-primary font-bold hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-[calc(100vh-80px)]"><div className="animate-pulse w-8 h-8 rounded-full bg-primary/50" /></div>}>
      <SignupContent />
    </Suspense>
  );
}
