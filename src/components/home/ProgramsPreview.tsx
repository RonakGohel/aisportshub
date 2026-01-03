import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Program {
  id: string;
  title: string;
  description: string;
  sport_category: string;
  location: string;
  start_date: string;
  end_date: string | null;
  max_participants: number | null;
  current_participants: number;
  fee: number;
}

const sportColors: Record<string, string> = {
  cricket: "bg-sport-cricket/20 text-sport-cricket border-sport-cricket/30",
  football: "bg-sport-football/20 text-sport-football border-sport-football/30",
  basketball: "bg-sport-basketball/20 text-sport-basketball border-sport-basketball/30",
  badminton: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  athletics: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const ProgramsPreview = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      const { data, error } = await supabase
        .from("sports_programs")
        .select("*")
        .eq("is_active", true)
        .order("start_date", { ascending: true })
        .limit(3);

      if (!error && data) {
        setPrograms(data);
      }
      setLoading(false);
    };

    fetchPrograms();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Featured <span className="gradient-text">Programs</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-xl">
              Join world-class training programs and take your game to the next level.
            </p>
          </div>
          <Link to="/programs" className="mt-6 md:mt-0">
            <Button variant="outline">
              View All Programs
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Programs grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <Card
              key={program.id}
              className="glass-card hover-lift group overflow-hidden animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                {/* Card header with gradient */}
                <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 relative">
                  <div className="absolute bottom-4 left-4">
                    <Badge
                      variant="outline"
                      className={sportColors[program.sport_category] || ""}
                    >
                      {program.sport_category}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {program.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{program.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(program.start_date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {program.max_participants && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>
                          {program.current_participants} / {program.max_participants}{" "}
                          enrolled
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        ₹{program.fee.toLocaleString()}
                      </span>
                    </div>
                    <Link to={`/programs/${program.id}`}>
                      <Button size="sm" className="group-hover:bg-primary transition-colors">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsPreview;
