import { Section } from "@/components/layout/Section";

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-20">
      <Section>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-12">Last Updated: July 2026</p>

          <div className="prose prose-invert prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">1. Introduction</h2>
              <p className="text-muted-foreground">
                APPRIQA ("we", "our", or "us") respects your privacy and is committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">2. The Data We Collect About You</h2>
              <p className="text-muted-foreground">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mt-4 space-y-2">
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">3. How We Use Your Personal Data</h2>
              <p className="text-muted-foreground">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground mt-4 space-y-2">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">4. Data Security</h2>
              <p className="text-muted-foreground">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </section>
          </div>
        </div>
      </Section>
    </div>
  );
}
