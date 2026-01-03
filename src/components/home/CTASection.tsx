import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot } from "lucide-react";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-8 animate-float">
            <Bot className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Heading */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Need Help?{" "}
            <span className="gradient-text">Ask Our AI Assistant</span>
          </h2>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Get instant answers about programs, registration, eligibility criteria,
            and more. Our AI chatbot is available 24/7 to assist you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate("/chat")}
              className="btn-hero group"
            >
              Start Chatting
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/auth")}
              className="border-white/20 hover:bg-white/10 px-8 py-6"
            >
              Create Account
            </Button>
          </div>

          {/* Sample questions */}
          <div className="mt-12">
            <p className="text-sm text-muted-foreground mb-4">
              Try asking:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "How do I register for cricket training?",
                "What programs are available in Mumbai?",
                "Show me upcoming football events",
              ].map((question) => (
                <button
                  key={question}
                  onClick={() => navigate("/chat", { state: { initialMessage: question } })}
                  className="px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary border border-border text-sm transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
