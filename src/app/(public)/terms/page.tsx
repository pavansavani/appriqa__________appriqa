import { Section } from "@/components/layout/Section";

export default function TermsPage() {
  return (
    <div className="pt-20">
      <Section>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-12">Last Updated: July 2026</p>

          <div className="prose prose-invert prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground">
                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and APPRIQA ("we," "us" or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">2. Intellectual Property Rights</h2>
              <p className="text-muted-foreground">
                Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">3. User Representations</h2>
              <p className="text-muted-foreground">
                By using the Site, you represent and warrant that: 
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mt-4 space-y-2">
                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">4. Modifications and Interruptions</h2>
              <p className="text-muted-foreground">
                We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time.
              </p>
            </section>
          </div>
        </div>
      </Section>
    </div>
  );
}
