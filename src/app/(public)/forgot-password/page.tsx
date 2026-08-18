"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DURATION, EASE } from "@/lib/motion";
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter your registered Email address.");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }
      
      setIsSuccess(true);
      setSuccessMsg(`We've sent a password reset link to ${email}. Please check your inbox.`);
    } catch (e) {
      const err = e as Error;
      setErrorMsg(err.message || "Failed to send reset link. Please try again.");
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
          <Link href="/login" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Login
          </Link>

          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl mb-2 text-foreground">
              Forgot Password?
            </h1>
            <p className="text-muted-foreground text-sm">
              No worries, we'll send you reset instructions.
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

              <Button type="submit" disabled={isSubmitting || !email} className="w-full h-12 text-base font-bold mt-2">
                {isSubmitting ? "Sending Link..." : "SEND RESET LINK"}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-6">
                If an account with that email exists, you will receive a reset link shortly.
              </p>
              <Link href="/login">
                <Button className="w-full h-12 font-bold" variant="outline">
                  Return to Login
                </Button>
              </Link>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
