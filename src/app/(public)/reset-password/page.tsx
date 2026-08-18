"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DURATION, EASE } from "@/lib/motion";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) {
        throw error;
      }
      
      setIsSuccess(true);
      setSuccessMsg("Password successfully reset! Redirecting to login...");
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (e) {
      const err = e as Error;
      setErrorMsg(err.message || "Failed to update password. Your session may have expired.");
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
        className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-2xl relative z-10 overflow-hidden shadow-[0_0_50px_rgba(255,106,0,0.05)]"
      >
        <div className="p-8">

          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl mb-2 text-foreground">
              Set New Password
            </h1>
            <p className="text-muted-foreground text-sm">
              Please enter your new password below.
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
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">New Password</label>
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

              <Button type="submit" disabled={isSubmitting || !password || !confirmPassword} className="w-full h-12 text-base font-bold mt-2">
                {isSubmitting ? "Updating..." : "UPDATE PASSWORD"}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-6">
                Your password has been changed.
              </p>
              <Link href="/login">
                <Button className="w-full h-12 font-bold" variant="outline">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
