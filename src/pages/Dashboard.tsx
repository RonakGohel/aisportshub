import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Calendar, BookOpen, Settings, User, Loader2 } from "lucide-react";

interface Profile {
  full_name: string;
  email: string;
  user_type: string;
  preferred_sports: string[];
}

interface Registration {
  id: string;
  status: string;
  created_at: string;
  sports_programs: {
    title: string;
    sport_category: string;
  };
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch registrations
      const { data: registrationData } = await supabase
        .from("program_registrations")
        .select(`
          id,
          status,
          created_at,
          sports_programs (
            title,
            sport_category
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (registrationData) {
        setRegistrations(registrationData as unknown as Registration[]);
      }

      setLoading(false);
    };

    fetchData();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    approved: "bg-green-500/20 text-green-400",
    rejected: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24">
        {/* Welcome section */}
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{profile?.full_name || "Athlete"}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's what's happening with your sports journey.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="glass-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Programs Enrolled</p>
                  <p className="text-2xl font-bold">{registrations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Approved</p>
                  <p className="text-2xl font-bold">
                    {registrations.filter((r) => r.status === "approved").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Pending</p>
                  <p className="text-2xl font-bold">
                    {registrations.filter((r) => r.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Account Type</p>
                  <p className="text-2xl font-bold capitalize">{profile?.user_type || "Fan"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Registrations */}
          <div className="lg:col-span-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-display">My Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                {registrations.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      You haven't registered for any programs yet.
                    </p>
                    <Button onClick={() => navigate("/programs")}>
                      Browse Programs
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {registrations.map((reg) => (
                      <div
                        key={reg.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border"
                      >
                        <div>
                          <h4 className="font-semibold">{reg.sports_programs.title}</h4>
                          <p className="text-sm text-muted-foreground capitalize">
                            {reg.sports_programs.sport_category}
                          </p>
                        </div>
                        <Badge className={statusColors[reg.status] || ""}>
                          {reg.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick actions */}
          <div>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-display">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/programs")}
                >
                  <BookOpen className="mr-2 w-4 h-4" />
                  Browse Programs
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/live-scores")}
                >
                  <Trophy className="mr-2 w-4 h-4" />
                  Live Scores
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/chat")}
                >
                  <Settings className="mr-2 w-4 h-4" />
                  AI Assistant
                </Button>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="glass-card mt-6">
              <CardHeader>
                <CardTitle className="font-display">Your Sports</CardTitle>
              </CardHeader>
              <CardContent>
                {profile?.preferred_sports && profile.preferred_sports.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.preferred_sports.map((sport) => (
                      <Badge key={sport} variant="secondary" className="capitalize">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    No preferred sports set yet. Update your profile to get
                    personalized recommendations!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
