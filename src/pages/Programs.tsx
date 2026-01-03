import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

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
  eligibility_criteria: string | null;
}

const sportColors: Record<string, string> = {
  cricket: "bg-sport-cricket/20 text-sport-cricket border-sport-cricket/30",
  football: "bg-sport-football/20 text-sport-football border-sport-football/30",
  basketball: "bg-sport-basketball/20 text-sport-basketball border-sport-basketball/30",
  badminton: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  athletics: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  hockey: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  tennis: "bg-sport-tennis/20 text-sport-tennis border-sport-tennis/30",
  kabaddi: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  swimming: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [registering, setRegistering] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchPrograms = async () => {
      const { data, error } = await supabase
        .from("sports_programs")
        .select("*")
        .eq("is_active", true)
        .order("start_date", { ascending: true });

      if (!error && data) {
        setPrograms(data);
      }
      setLoading(false);
    };

    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport =
      sportFilter === "all" || program.sport_category === sportFilter;
    return matchesSearch && matchesSport;
  });

  const handleRegister = async (programId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setRegistering(programId);

    const { error } = await supabase.from("program_registrations").insert({
      program_id: programId,
      user_id: user.id,
    });

    setRegistering(null);

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Already Registered",
          description: "You have already registered for this program.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Registration Successful!",
        description: "Your registration is pending approval.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Sports <span className="gradient-text">Programs</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Discover world-class training programs and take your game to the next
            level.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search programs, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50 border-white/10"
            />
          </div>
          <Select value={sportFilter} onValueChange={setSportFilter}>
            <SelectTrigger className="w-full md:w-48 bg-secondary/50 border-white/10">
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              <SelectItem value="cricket">Cricket</SelectItem>
              <SelectItem value="football">Football</SelectItem>
              <SelectItem value="basketball">Basketball</SelectItem>
              <SelectItem value="badminton">Badminton</SelectItem>
              <SelectItem value="athletics">Athletics</SelectItem>
              <SelectItem value="hockey">Hockey</SelectItem>
              <SelectItem value="tennis">Tennis</SelectItem>
              <SelectItem value="swimming">Swimming</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Programs grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredPrograms.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No programs found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program, index) => (
              <Card
                key={program.id}
                className="glass-card hover-lift group overflow-hidden animate-fade-up"
                style={{ animationDelay: `${index * 50}ms` }}
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
                          {program.end_date &&
                            ` - ${new Date(program.end_date).toLocaleDateString(
                              "en-IN",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )}`}
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
                      {program.eligibility_criteria && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
                          {program.eligibility_criteria}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          ₹{program.fee.toLocaleString()}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleRegister(program.id)}
                        disabled={registering === program.id}
                        className="group-hover:bg-primary transition-colors"
                      >
                        {registering === program.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Register"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Programs;
