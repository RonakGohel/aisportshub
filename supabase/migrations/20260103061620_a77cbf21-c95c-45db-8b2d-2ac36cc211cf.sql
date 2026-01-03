-- Create enum for user types
CREATE TYPE public.user_type AS ENUM ('athlete', 'fan', 'admin');

-- Create enum for sport categories
CREATE TYPE public.sport_category AS ENUM ('cricket', 'football', 'basketball', 'tennis', 'badminton', 'hockey', 'kabaddi', 'athletics', 'swimming', 'other');

-- Create enum for registration status
CREATE TYPE public.registration_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  user_type user_type NOT NULL DEFAULT 'fan',
  phone TEXT,
  date_of_birth DATE,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  preferred_sports sport_category[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create athlete_profiles table for athletes
CREATE TABLE public.athlete_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  primary_sport sport_category NOT NULL,
  secondary_sports sport_category[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  achievements TEXT,
  current_club TEXT,
  height_cm INTEGER,
  weight_kg INTEGER,
  coach_name TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sports_programs table
CREATE TABLE public.sports_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sport_category sport_category NOT NULL,
  location TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  eligibility_criteria TEXT,
  fee DECIMAL(10,2) DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create program_registrations table
CREATE TABLE public.program_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID NOT NULL REFERENCES public.sports_programs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status registration_status NOT NULL DEFAULT 'pending',
  application_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(program_id, user_id)
);

-- Create events table for matches/tournaments
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  sport_category sport_category NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'match',
  venue TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  team_home TEXT,
  team_away TEXT,
  score_home INTEGER,
  score_away INTEGER,
  status TEXT DEFAULT 'upcoming',
  description TEXT,
  image_url TEXT,
  is_live BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table for AI chatbot history
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athlete_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public profiles are viewable" ON public.profiles FOR SELECT USING (true);

-- Athlete profiles policies
CREATE POLICY "Athletes can view their own profile" ON public.athlete_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Athletes can update their own profile" ON public.athlete_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Athletes can insert their own profile" ON public.athlete_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public can view verified athletes" ON public.athlete_profiles FOR SELECT USING (is_verified = true);

-- Sports programs policies (public read)
CREATE POLICY "Anyone can view active programs" ON public.sports_programs FOR SELECT USING (is_active = true);

-- Program registrations policies
CREATE POLICY "Users can view their own registrations" ON public.program_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create registrations" ON public.program_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their pending registrations" ON public.program_registrations FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Events policies (public read)
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);

-- Chat messages policies
CREATE POLICY "Users can view their own messages" ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_athlete_profiles_updated_at BEFORE UPDATE ON public.athlete_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sports_programs_updated_at BEFORE UPDATE ON public.sports_programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_program_registrations_updated_at BEFORE UPDATE ON public.program_registrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample sports programs
INSERT INTO public.sports_programs (title, description, sport_category, location, start_date, end_date, max_participants, eligibility_criteria, fee, is_active) VALUES
('National Youth Cricket Camp', 'Intensive cricket training program for young talents aged 12-18. Learn from certified coaches.', 'cricket', 'Mumbai, Maharashtra', '2026-02-01', '2026-02-28', 100, 'Ages 12-18, basic cricket knowledge required', 5000, true),
('Football Excellence Academy', 'Professional football training with focus on technique, fitness, and tactical awareness.', 'football', 'Bangalore, Karnataka', '2026-03-15', '2026-06-15', 50, 'Ages 16-25, intermediate level', 8000, true),
('Badminton Rising Stars', 'State-level badminton coaching program with tournament preparation.', 'badminton', 'Hyderabad, Telangana', '2026-02-10', '2026-04-10', 30, 'Ages 10-20, beginner to intermediate', 3500, true),
('Athletics Sprint Training', 'Specialized training for 100m, 200m, and 400m sprinters.', 'athletics', 'Delhi', '2026-01-20', '2026-03-20', 40, 'Ages 14-28, good physical fitness', 4500, true);

-- Insert sample events
INSERT INTO public.events (title, sport_category, event_type, venue, event_date, team_home, team_away, status, is_live) VALUES
('IPL 2026: Mumbai vs Chennai', 'cricket', 'match', 'Wankhede Stadium, Mumbai', '2026-01-10 19:30:00+05:30', 'Mumbai Indians', 'Chennai Super Kings', 'upcoming', false),
('ISL: Bengaluru FC vs Kerala Blasters', 'football', 'match', 'Kanteerava Stadium, Bangalore', '2026-01-05 20:00:00+05:30', 'Bengaluru FC', 'Kerala Blasters', 'live', true),
('Pro Kabaddi: Patna Pirates vs Jaipur Pink Panthers', 'kabaddi', 'match', 'Patna Sports Complex', '2026-01-08 21:00:00+05:30', 'Patna Pirates', 'Jaipur Pink Panthers', 'upcoming', false),
('National Basketball Championship Finals', 'basketball', 'tournament', 'Indira Gandhi Stadium, Delhi', '2026-01-15 18:00:00+05:30', 'Delhi Dunkers', 'Chennai Cavaliers', 'upcoming', false);

-- Enable realtime for events table
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;