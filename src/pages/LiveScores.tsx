import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Radio, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  title: string;
  sport_category: string;
  team_home: string | null;
  team_away: string | null;
  score_home: number | null;
  score_away: number | null;
  venue: string;
  event_date: string;
  is_live: boolean;
  status: string;
}

const sportColors: Record<string, string> = {
  cricket: "bg-sport-cricket/20 text-sport-cricket border-sport-cricket/30",
  football: "bg-sport-football/20 text-sport-football border-sport-football/30",
  basketball: "bg-sport-basketball/20 text-sport-basketball border-sport-basketball/30",
  kabaddi: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  tennis: "bg-sport-tennis/20 text-sport-tennis border-sport-tennis/30",
  hockey: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

const LiveScores = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchEvents();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("live-scores-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        (payload) => {
          if (payload.eventType === "UPDATE") {
            setEvents((prev) =>
              prev.map((e) =>
                e.id === payload.new.id ? (payload.new as Event) : e
              )
            );
          } else if (payload.eventType === "INSERT") {
            setEvents((prev) => [...prev, payload.new as Event]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredEvents =
    activeTab === "all"
      ? events
      : activeTab === "live"
      ? events.filter((e) => e.is_live)
      : events.filter((e) => e.sport_category === activeTab);

  const liveCount = events.filter((e) => e.is_live).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24">
        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            {liveCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/20 border border-destructive/30">
                <div className="relative w-3 h-3">
                  <span className="absolute inset-0 rounded-full bg-destructive animate-ping" />
                  <span className="absolute inset-0 rounded-full bg-destructive" />
                </div>
                <span className="text-sm font-medium text-destructive">
                  {liveCount} LIVE
                </span>
              </div>
            )}
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Live <span className="gradient-text">Scores & Events</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Real-time updates on matches and tournaments across multiple sports.
          </p>
        </div>

        {/* Filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="live" className="text-destructive">
              Live
            </TabsTrigger>
            <TabsTrigger value="cricket">Cricket</TabsTrigger>
            <TabsTrigger value="football">Football</TabsTrigger>
            <TabsTrigger value="basketball">Basketball</TabsTrigger>
            <TabsTrigger value="kabaddi">Kabaddi</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No events found.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredEvents.map((event, index) => (
                  <Card
                    key={event.id}
                    className={`glass-card hover-lift overflow-hidden animate-fade-up ${
                      event.is_live ? "ring-2 ring-destructive/50" : ""
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge
                          variant="outline"
                          className={sportColors[event.sport_category] || ""}
                        >
                          {event.sport_category}
                        </Badge>
                        {event.is_live && (
                          <div className="flex items-center gap-1.5 text-destructive">
                            <Radio className="w-4 h-4 animate-pulse" />
                            <span className="text-xs font-semibold">LIVE</span>
                          </div>
                        )}
                      </div>

                      <h3 className="font-display font-bold text-lg mb-4">
                        {event.title}
                      </h3>

                      <div className="flex items-center justify-between">
                        {/* Team Home */}
                        <div className="text-center flex-1">
                          <div className="font-semibold">{event.team_home}</div>
                          {event.is_live && (
                            <div className="text-4xl font-display font-bold text-primary mt-2 score-update">
                              {event.score_home ?? 0}
                            </div>
                          )}
                        </div>

                        {/* VS */}
                        <div className="px-6">
                          <span className="text-muted-foreground font-medium text-lg">
                            VS
                          </span>
                        </div>

                        {/* Team Away */}
                        <div className="text-center flex-1">
                          <div className="font-semibold">{event.team_away}</div>
                          {event.is_live && (
                            <div className="text-4xl font-display font-bold text-accent mt-2 score-update">
                              {event.score_away ?? 0}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                        <span>{event.venue}</span>
                        <span>
                          {new Date(event.event_date).toLocaleDateString("en-IN", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default LiveScores;
