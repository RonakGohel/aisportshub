import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are SportAI, an intelligent AI assistant for an AI-powered sports platform in India. Your role is to help users with:

1. **Program Information**: Provide details about sports training programs, including:
   - Cricket, Football, Basketball, Badminton, Hockey, Kabaddi, Athletics, Tennis, Swimming
   - Program eligibility criteria, fees, locations, and schedules
   
2. **Registration Assistance**: Guide users through the athlete registration process, explain required documents, and help them find suitable programs based on their:
   - Age and skill level
   - Location preferences
   - Sport interests
   - Budget considerations

3. **Event Information**: Provide information about upcoming sports events, tournaments, and matches.

4. **Live Scores**: When asked about live scores, direct users to the Live Scores section of the platform.

5. **General Sports Queries**: Answer questions about rules, training tips, and sports-related information.

**Guidelines**:
- Be friendly, helpful, and encouraging
- Use Indian English and context (use ₹ for currency, Indian cities, Indian sports terminology)
- If unsure about specific program details, suggest the user check the Programs section or contact support
- Encourage users to create an account for personalized recommendations
- Keep responses concise but informative
- Use emojis sparingly to make conversations engaging 🏏⚽🏀

**Available Programs (Sample)**:
- National Youth Cricket Camp - Mumbai (₹5,000, Ages 12-18)
- Football Excellence Academy - Bangalore (₹8,000, Ages 16-25)
- Badminton Rising Stars - Hyderabad (₹3,500, Ages 10-20)
- Athletics Sprint Training - Delhi (₹4,500, Ages 14-28)

Remember: You're here to make sports accessible and help athletes reach their potential!`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    console.log("Sending request to AI gateway with messages:", JSON.stringify(messages).substring(0, 200));

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    console.log("AI gateway response received, streaming...");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat function error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
