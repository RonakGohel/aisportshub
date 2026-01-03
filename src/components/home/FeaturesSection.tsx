import { Bot, BarChart3, Search, UserCheck, Trophy, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Bot,
    title: "AI Chatbot",
    description: "Get instant answers about programs, eligibility, and registration with our intelligent assistant.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: BarChart3,
    title: "Personalized Dashboard",
    description: "Track your progress, registrations, and get tailored recommendations based on your preferences.",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Find the perfect program with our intelligent search that understands what you're looking for.",
    color: "text-sport-tennis",
    bg: "bg-sport-tennis/10",
  },
  {
    icon: UserCheck,
    title: "Easy Registration",
    description: "Streamlined registration process for athletes with smart form filling and document management.",
    color: "text-sport-cricket",
    bg: "bg-sport-cricket/10",
  },
  {
    icon: Trophy,
    title: "Live Scores",
    description: "Real-time updates on matches and tournaments across multiple sports.",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    icon: Zap,
    title: "AI Recommendations",
    description: "Get personalized program recommendations based on your profile and goals.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-primary/5 to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-accent/5 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            AI-Enhanced <span className="gradient-text">Solutions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Modern features designed to enhance your sports experience with
            cutting-edge AI technology.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="glass-card hover-lift group animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-8">
                <div
                  className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="font-display text-xl font-bold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
