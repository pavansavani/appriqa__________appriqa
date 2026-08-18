"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Shield, Key, Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function AccountSecurityPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // Direct Change State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPass, setChangingPass] = useState(false);
  const [changeError, setChangeError] = useState("");
  const [changeSuccess, setChangeSuccess] = useState("");

  // Reset Link State
  const [sendingLink, setSendingLink] = useState(false);
  const [linkError, setLinkError] = useState("");
  const [linkSuccess, setLinkSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleDirectChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError("");
    setChangeSuccess("");

    if (newPassword !== confirmPassword) {
      setChangeError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setChangeError("Password must be at least 6 characters.");
      return;
    }

    setChangingPass(true);

    try {
      // First verify old password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: oldPassword,
      });

      if (signInError) {
        throw new Error("Incorrect old password. If you logged in with Google, please use the Reset Link method below.");
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setChangeSuccess("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setChangeError(err.message);
    } finally {
      setChangingPass(false);
    }
  };

  const handleSendResetLink = async () => {
    setLinkError("");
    setLinkSuccess("");
    setSendingLink(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setLinkSuccess(`Password reset link sent to ${email}`);
    } catch (err: any) {
      setLinkError(err.message);
    } finally {
      setSendingLink(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Security & Passwords</h1>
        <p className="text-muted-foreground mt-2">Manage your account security and authentication methods.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Direct Password Change */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Key className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Change Password</h2>
              <p className="text-sm text-muted-foreground">Update your password directly.</p>
            </div>
          </div>

          <form onSubmit={handleDirectChange} className="space-y-5">
            {changeError && (
              <div className="flex items-start gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{changeError}</span>
              </div>
            )}
            {changeSuccess && (
              <div className="flex items-start gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{changeSuccess}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Old Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={changingPass}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-all shadow-lg shadow-primary/25 disabled:opacity-50 mt-4"
            >
              {changingPass ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Send Reset Link (Google Auth users) */}
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm h-max">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Set Password via Email</h2>
              <p className="text-sm text-muted-foreground">Perfect for Google Sign-In users.</p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              If you signed up or logged in using Google, you don't have an "Old Password" to enter. 
              Instead, you can send a secure link to your email address <strong className="text-foreground">{email}</strong> to set a new dedicated password.
            </p>

            {linkError && (
              <div className="flex items-start gap-2 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{linkError}</span>
              </div>
            )}
            {linkSuccess && (
              <div className="flex items-start gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{linkSuccess}</span>
              </div>
            )}

            <button
              onClick={handleSendResetLink}
              disabled={sendingLink || !email}
              className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 border border-border/50"
            >
              <Mail className="w-5 h-5" />
              {sendingLink ? "Sending Link..." : "Send Password Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
