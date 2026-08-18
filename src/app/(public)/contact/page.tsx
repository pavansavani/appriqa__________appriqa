"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DURATION, EASE, VARIANTS } from "@/lib/motion";
import { submitContact, submitQuery } from "@/app/actions";
import { MapPin, Phone, Mail, Clock, CheckCircle2, HelpCircle, MessageSquare, Youtube, Twitter, Instagram } from "lucide-react";
import { Editable } from "@/components/Editable";

// ─── Schemas ─────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const querySchema = z.object({
  type: z.string().min(1, "Please select an inquiry type"),
  email: z.string().email("Invalid email address"),
  question: z.string().min(10, "Question must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;
type QueryFormValues = z.infer<typeof querySchema>;

// ─── Contact Form ─────────────────────────────────────────────
function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    if (!token) {
      alert("You must be logged in to send a message.");
      return;
    }

    const result = await submitContact(data, token);
    if (result.success) setIsSuccess(true);
    else alert(result.message || "Failed to send message.");
  };

  return (
    <AnimatePresence mode="wait">
      {!isSuccess ? (
        <motion.form
          key="contact-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name <span className="text-primary">*</span></label>
              <input
                {...register("name")}
                className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary transition-colors"
                placeholder="Your Name"
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-destructive text-xs">
                    {errors.name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address <span className="text-primary">*</span></label>
              <input
                {...register("email")}
                type="email"
                className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary transition-colors"
                placeholder="you@company.com"
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-destructive text-xs">
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Company (Optional)</label>
            <input
              {...register("company")}
              className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary transition-colors"
              placeholder="Organization Name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message <span className="text-primary">*</span></label>
            <textarea
              {...register("message")}
              rows={5}
              className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary transition-colors resize-none"
              placeholder="How can we help you?"
            />
            <AnimatePresence>
              {errors.message && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-destructive text-xs">
                  {errors.message.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full h-14 text-base">
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </motion.form>
      ) : (
        <motion.div
          key="contact-success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center py-12"
        >
          <div className="w-20 h-20 bg-accent/20 text-accent rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-heading font-bold mb-2">Message Sent!</h3>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Thank you for reaching out. An APPRIQA representative will be in touch with you shortly.
          </p>
          <Button variant="outline" onClick={() => setIsSuccess(false)}>Send Another Message</Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Query Form ───────────────────────────────────────────────
function QueryForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<QueryFormValues>({
    resolver: zodResolver(querySchema),
    defaultValues: { type: "general" }
  });

  const onSubmit = async (data: QueryFormValues) => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    if (!token) {
      alert("You must be logged in to submit a query.");
      return;
    }

    const result = await submitQuery(data, token);
    if (result.success) setIsSuccess(true);
    else alert(result.message || "Failed to submit query.");
  };

  return (
    <AnimatePresence mode="wait">
      {!isSuccess ? (
        <motion.form
          key="query-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Type of Inquiry <span className="text-primary">*</span></label>
            <select
              {...register("type")}
              className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary transition-colors appearance-none"
            >
              <option value="general">General Support</option>
              <option value="technical">Technical Support</option>
              <option value="partnership">Partnership Inquiry</option>
              <option value="media">Media / Press</option>
              <option value="product">Product Query</option>
              <option value="shipping">Shipping & Delivery</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email Address <span className="text-primary">*</span></label>
            <input
              {...register("email")}
              type="email"
              className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary transition-colors"
              placeholder="you@company.com"
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-destructive text-xs">
                  {errors.email.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Your Question <span className="text-primary">*</span></label>
            <textarea
              {...register("question")}
              rows={5}
              className="w-full bg-background border border-border rounded-lg p-3 outline-none focus:border-primary transition-colors resize-none"
              placeholder="Please describe your question or issue in detail."
            />
            <AnimatePresence>
              {errors.question && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-destructive text-xs">
                  {errors.question.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full h-14 text-base">
            {isSubmitting ? "Submitting..." : "Submit Inquiry"}
          </Button>
        </motion.form>
      ) : (
        <motion.div
          key="query-success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center text-center py-12"
        >
          <div className="w-20 h-20 bg-accent/20 text-accent rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-heading font-bold mb-2">Inquiry Received!</h3>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Your question has been routed to the appropriate department. We will respond within 24–48 hours.
          </p>
          <Button variant="outline" onClick={() => setIsSuccess(false)}>Submit Another Query</Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export default function ContactPage() {
  const contactInfo = [
    { icon: MapPin, label: "Office Address", value: "Appriqa Pvt. Ltd.\nTech Hub, Hyderabad, India" },
    { icon: Phone, label: "Phone", value: "+91 98765 43210" },
    { icon: Mail, label: "Email", value: "appriqapvtltd@gmail.com" },
    { icon: Clock, label: "Business Hours", value: "Mon – Fri: 9:00 AM – 6:00 PM IST" },
  ];

  const faqs = [
    { q: "Where is APPRIQA located?", a: "Our headquarters are in Hyderabad, India, with R&D centers and manufacturing partners across India." },
    { q: "What products do you offer?", a: "We offer a diverse range of products across four categories: 3D Printed Products (physical accessories and engineering parts), 3D Printed Designs (digital download STL/3MF files), Robotics Toys (programmable crawlers and wheeled rovers), and DIY Project Kits (STEM learning and IoT systems)." },
    { q: "Do you ship across India?", a: "Yes, we ship all physical products pan-India. Digital products are available for instant download after payment confirmation." },
    { q: "How do you structure project engagements?", a: "We offer end-to-end consulting, joint venture R&D partnerships, and direct turnkey solution delivery depending on project scope." },
    { q: "What is your primary tech stack?", a: "Our software stack utilizes C++/Rust for embedded systems, Python/TensorFlow for AI, and Next.js/React for cloud interfaces. Hardware design is done via Altium and SolidWorks." }
  ];

  const [hoveredFaqIndex, setHoveredFaqIndex] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
    });
  }, []);

  return (
    <div className="pt-20">
      <Section className="pb-10">
        <SectionHeader
          title={<Editable contentKey="contact.hero.title" defaultContent="Contact & Queries" />}
          subtitle={<Editable contentKey="contact.hero.subtitle" defaultContent="Reach out to our engineering team or get answers to common questions." />}
        />

        {/* 1 Row, 2 Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 mb-20 max-w-6xl mx-auto">
          
          {/* Left Column: Contact Form with Tabs */}
          <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl flex flex-col">
            {isAuthenticated === null ? (
              <div className="flex-1 flex items-center justify-center min-h-[300px]">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
              </div>
            ) : isAuthenticated ? (
              <Tabs defaultValue="contact" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-14 bg-secondary/50 rounded-xl p-1 mb-8">
                  <TabsTrigger value="contact" className="rounded-lg text-sm font-bold tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                    Contact Us
                  </TabsTrigger>
                  <TabsTrigger value="query" className="rounded-lg text-sm font-bold tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                    Submit a Query
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="contact">
                  <h3 className="text-2xl font-heading font-bold mb-6">Send us a message</h3>
                  <ContactForm />
                </TabsContent>
                <TabsContent value="query">
                  <h3 className="text-2xl font-heading font-bold mb-6">Ask us anything</h3>
                  <QueryForm />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4 min-h-[300px]">
                <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mb-6">
                  <HelpCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-heading font-bold mb-3">Login Required</h3>
                <p className="text-muted-foreground mb-8">
                  Please log in to submit a message or inquiry so we can securely track and respond to your requests.
                </p>
                <Link href="/login?redirect=/contact" className="w-full">
                  <Button size="lg" className="w-full h-14 text-base">
                    Log In to Continue
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Contact Info & Socials */}
          <div className="flex flex-col gap-6">
            <h3 className="text-2xl font-heading font-bold mb-2"><Editable contentKey="contact.info.title" defaultContent="Get in touch directly" /></h3>
            
            <div className="flex flex-col gap-4">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 bg-secondary/10 border border-border/60 rounded-xl p-5 hover:border-primary/40 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{label}</h4>
                    <p className="text-muted-foreground mt-0.5 text-sm whitespace-pre-line">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media Quick Buttons */}
            <div className="mt-4 bg-card border border-border/60 rounded-xl p-6 hover:border-primary/40 transition-all">
              <h4 className="font-semibold text-foreground text-sm mb-4"><Editable contentKey="contact.social.title" defaultContent="Follow Us" /></h4>
              <div className="flex flex-wrap gap-4">
                <a href="https://www.youtube.com/@Appriqa" target="_blank" rel="noopener noreferrer" className="px-4 py-2 flex items-center gap-2 text-sm font-bold bg-background border border-border rounded-lg hover:border-primary hover:text-primary transition-all">
                  <Youtube className="w-4 h-4" /> YouTube
                </a>
                <a href="https://x.com/appriqa" target="_blank" rel="noopener noreferrer" className="px-4 py-2 flex items-center gap-2 text-sm font-bold bg-background border border-border rounded-lg hover:border-primary hover:text-primary transition-all">
                  <Twitter className="w-4 h-4" /> Twitter (X)
                </a>
                <a href="https://www.instagram.com/appriqa_pvt_ltd?igsh=MW5mMnUzcDB1aW90Nw==" target="_blank" rel="noopener noreferrer" className="px-4 py-2 flex items-center gap-2 text-sm font-bold bg-background border border-border rounded-lg hover:border-primary hover:text-primary transition-all">
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section with Hover Animation */}
        <div className="max-w-4xl mx-auto mt-24 mb-12">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-heading font-bold flex items-center justify-center gap-3">
              <HelpCircle className="w-8 h-8 text-primary" />
              Frequently Asked Questions
            </h3>
            <p className="text-muted-foreground mt-2">Hover over any question to reveal the answer.</p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="border border-border rounded-xl bg-card overflow-hidden transition-all duration-300 hover:border-primary/50 shadow-sm"
                onMouseEnter={() => setHoveredFaqIndex(idx)}
                onMouseLeave={() => setHoveredFaqIndex(null)}
              >
                <div className="p-6 cursor-pointer flex justify-between items-center bg-card">
                  <h4 className={`font-bold text-lg transition-colors ${hoveredFaqIndex === idx ? 'text-primary' : 'text-foreground'}`}>
                    {faq.q}
                  </h4>
                  <div className={`w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all duration-300 ${hoveredFaqIndex === idx ? 'rotate-180 bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20' : 'bg-secondary/20 text-muted-foreground'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
                
                <AnimatePresence>
                  {hoveredFaqIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="p-6 pt-0 text-muted-foreground bg-card">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
