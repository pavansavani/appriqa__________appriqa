import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans, Orbitron } from "next/font/google";
import "./globals.css";


const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-inter", // keeping the variable name to avoid breaking tailwind config
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-brand",
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://appriqa.com"),
  title: {
    template: "%s | APPRIQA Engineering",
    default: "APPRIQA | Industrial Precision At Scale",
  },
  description: "Global deep-tech engineering firm specializing in Robotics, AI, IoT, Embedded Systems, and Sustainable Energy solutions.",
  keywords: ["Engineering", "Robotics", "AI", "IoT", "Embedded Systems", "Deep Tech", "Energy Solutions"],
  authors: [{ name: "APPRIQA" }],
  openGraph: {
    title: "APPRIQA | Industrial Precision At Scale",
    description: "Global deep-tech engineering firm specializing in Robotics, AI, IoT, and Energy solutions.",
    url: "https://appriqa.com",
    siteName: "APPRIQA",
    images: [{ url: "/logo/logo-orange.png", width: 800, height: 600 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "APPRIQA | Engineering The Future",
    description: "Deep-tech solutions for mission-critical industrial applications.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "APPRIQA",
  url: "https://appriqa.com",
  logo: "https://appriqa.com/logo/logo-orange.png",
  description: "Global deep-tech engineering firm specializing in Robotics, AI, IoT, Embedded Systems, and Sustainable Energy solutions.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Innovation Drive, Tech Park",
    addressLocality: "Silicon Valley",
    addressRegion: "CA",
    postalCode: "94043",
    addressCountry: "US"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${plusJakarta.variable} ${orbitron.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col selection:bg-primary/30 selection:text-primary-foreground`}
      >
        {children}
      </body>
    </html>
  );
}



