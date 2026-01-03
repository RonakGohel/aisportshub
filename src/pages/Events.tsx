import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  title: string;
  sport_category: string;
  event_type: string;
  venue: string;
  event_date: string;
  description: string | null;
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

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  const upcomingEvents = events.filter((e) => new Date(e.event_date) >= new Date());
  const pastEvents = events.filter((e) => new Date(e.event_date) < new Date());

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-24">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Sports <span className="gradient-text">Events</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Stay updated with upcoming tournaments, matches, and sports events.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Upcoming Events */}
            <section className="mb-16">
              <h2 className="font-display text-2xl font-bold mb-6">
                Upcoming Events
              </h2>
              {upcomingEvents.length === 0 ? (
                <p className="text-muted-foreground">No upcoming events.</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event, index) => (
                    <Card
                      key={event.id}
                      className="glass-card hover-lift overflow-hidden animate-fade-up"
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
                          <Badge variant="secondary">{event.event_type}</Badge>
                        </div>

                        <h3 className="font-display text-lg font-bold mb-3">
                          {event.title}
                        </h3>

                        {event.description && (
                          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                            {event.description}
                          </p>
                        )}

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{event.venue}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(event.event_date).toLocaleDateString(
                                "en-IN",
                                {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-bold mb-6 text-muted-foreground">
                  Past Events
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                  {pastEvents.map((event) => (
                    <Card key={event.id} className="glass-card overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <Badge
                            variant="outline"
                            className={sportColors[event.sport_category] || ""}
                          >
                            {event.sport_category}
                          </Badge>
                          <Badge variant="secondary">{event.event_type}</Badge>
                        </div>

                        <h3 className="font-display text-lg font-bold mb-3">
                          {event.title}
                        </h3>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{event.venue}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(event.event_date).toLocaleDateString(
                                "en-IN",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Events;
