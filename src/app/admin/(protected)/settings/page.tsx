"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Shield, Key, Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminSettingsPage() {
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
        <div className="animate-spin w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-wide">Settings</h1>
        <p className="text-sm text-[#8A8A8A] mt-1">Manage your account security and preferences.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Direct Password Change */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#FF6B00]/10 flex items-center justify-center">
              <Key className="w-5 h-5 text-[#FF6B00]" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Change Password</h2>
              <p className="text-sm text-[#8A8A8A]">Update your password directly.</p>
            </div>
          </div>

          <form onSubmit={handleDirectChange} className="space-y-4">
            {changeError && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{changeError}</span>
              </div>
            )}
            {changeSuccess && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{changeSuccess}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#D4D4D4]">Old Password</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#D4D4D4]">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#D4D4D4]">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={changingPass}
              className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-medium py-2.5 rounded-lg transition-colors mt-2 disabled:opacity-50"
            >
              {changingPass ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Send Reset Link (Google Auth users) */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 h-max">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Set Password via Email</h2>
              <p className="text-sm text-[#8A8A8A]">Perfect if you use Google Sign-In.</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-[#D4D4D4] leading-relaxed">
              If you signed up or logged in using Google, you don't have an "Old Password" to enter. 
              Instead, you can send a secure link to your email address ({email}) to set a new dedicated password.
            </p>

            {linkError && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{linkError}</span>
              </div>
            )}
            {linkSuccess && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{linkSuccess}</span>
              </div>
            )}

            <button
              onClick={handleSendResetLink}
              disabled={sendingLink || !email}
              className="w-full bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2A2A2A] text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Mail className="w-4 h-4" />
              {sendingLink ? "Sending Link..." : "Send Password Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
