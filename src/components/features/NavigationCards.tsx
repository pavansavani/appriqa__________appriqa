import Link from "next/link";
import { ArrowRight, Bot, ShoppingCart, Info } from "lucide-react";
import { Section } from "@/components/layout/Section";

export function NavigationCards() {
  const cards = [
    {
      id: "solution",
      title: "I Need a Solution",
      description: "Looking for robotics, AI, software, 3D printing, prototyping, or product development support?",
      buttonText: "Start a Project",
      href: "/contact",
      icon: Bot,
      color: "group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(255,106,0,0.15)]",
      iconColor: "text-primary",
      bgHover: "group-hover:bg-primary/10",
      buttonStyle: "bg-primary text-primary-foreground hover:bg-primary/90"
    },
    {
      id: "buy",
      title: "I Want to Buy Something",
      description: "Explore Appriqa's products, add your favorites to the cart, and complete your purchase securely.",
      buttonText: "Explore Products",
      href: "/store",
      icon: ShoppingCart,
      color: "group-hover:border-accent/50 group-hover:shadow-[0_0_30px_rgba(0,255,153,0.1)]", // using accent color (usually green/cyan)
      iconColor: "text-accent",
      bgHover: "group-hover:bg-accent/10",
      buttonStyle: "bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]" // Neutral alternate button
    },
    {
      id: "about",
      title: "I Want to Know About Appriqa",
      description: "Learn about Appriqa, explore our projects, understand our work, and get in touch with our team.",
      buttonText: "Learn About Appriqa",
      href: "/about",
      icon: Info,
      color: "group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(255,106,0,0.15)]",
      iconColor: "text-primary",
      bgHover: "group-hover:bg-primary/10",
      buttonStyle: "bg-primary text-primary-foreground hover:bg-primary/90"
    }
  ];

  return (
    <Section className="py-20 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                href={card.href}
                className={`group flex flex-col justify-between bg-[#141414] border border-[#2A2A2A] rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 cursor-pointer ${card.color}`}
              >
                <div>
                  <div className={`w-14 h-14 rounded-xl bg-[#202020] border border-[#3A3A3A] flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 ${card.bgHover}`}>
                    <Icon className={`w-7 h-7 transition-colors duration-500 ${card.iconColor}`} />
                  </div>
                  
                  <h3 className="text-2xl font-heading font-bold text-white mb-4">
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-400 font-medium leading-relaxed mb-8">
                    {card.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className={`inline-flex items-center px-6 py-3 rounded-full font-semibold text-sm transition-colors duration-300 ${card.buttonStyle}`}>
                    {card.buttonText}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#202020] flex items-center justify-center border border-[#3A3A3A] group-hover:bg-[#3A3A3A] transition-colors duration-300">
                    <ArrowRight className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

