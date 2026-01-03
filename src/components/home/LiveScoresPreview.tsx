import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Radio } from "lucide-react";
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
};

const LiveScoresPreview = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true })
        .limit(4);

      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    };

    fetchEvents();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("events-realtime")
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
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="relative w-3 h-3">
                <span className="absolute inset-0 rounded-full bg-destructive animate-ping" />
                <span className="absolute inset-0 rounded-full bg-destructive" />
              </div>
              <span className="text-sm font-medium text-destructive">LIVE</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Live Scores & Events
            </h2>
          </div>
          <Link to="/live-scores">
            <Button variant="outline" className="hidden sm:flex">
              View All
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Events grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((event, index) => (
            <Card
              key={event.id}
              className="glass-card hover-lift overflow-hidden animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
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

                <div className="flex items-center justify-between">
                  {/* Team Home */}
                  <div className="text-center flex-1">
                    <div className="font-semibold text-lg">{event.team_home}</div>
                    {event.is_live && (
                      <div className="text-3xl font-display font-bold text-primary mt-2">
                        {event.score_home ?? 0}
                      </div>
                    )}
                  </div>

                  {/* VS / Score separator */}
                  <div className="px-4">
                    <span className="text-muted-foreground font-medium">VS</span>
                  </div>

                  {/* Team Away */}
                  <div className="text-center flex-1">
                    <div className="font-semibold text-lg">{event.team_away}</div>
                    {event.is_live && (
                      <div className="text-3xl font-display font-bold text-accent mt-2">
                        {event.score_away ?? 0}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                  <span>{event.venue}</span>
                  <span>
                    {new Date(event.event_date).toLocaleDateString("en-IN", {
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

        {/* Mobile CTA */}
        <div className="mt-8 sm:hidden">
          <Link to="/live-scores">
            <Button className="w-full" variant="outline">
              View All Events
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LiveScoresPreview;
