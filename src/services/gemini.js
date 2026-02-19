import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Robust JSON extractor – handles ```json blocks, leading text, trailing garbage
function extractJSON(text) {
  // Strip markdown code fences
  let cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();

  // Try to find the first complete JSON object
  const startIdx = cleaned.indexOf("{");
  const lastIdx = cleaned.lastIndexOf("}");
  if (startIdx !== -1 && lastIdx !== -1) {
    cleaned = cleaned.slice(startIdx, lastIdx + 1);
  }

  return JSON.parse(cleaned);
}

export async function generateItinerary({ destination, country, days, travelStyle, interests }) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  });

  const prompt = `You are an expert travel planner. Create a detailed ${days}-day itinerary for ${destination}, ${country}.

Travel Style: ${travelStyle}
Interests: ${interests.join(", ")}

IMPORTANT: Respond with ONLY a valid JSON object. No markdown, no code blocks, no extra text before or after. 

The JSON must follow this exact structure:
{
  "destination": "${destination}",
  "country": "${country}",
  "days": ${days},
  "travelStyle": "${travelStyle}",
  "overview": "A 2-3 sentence overview of the trip",
  "tips": ["tip1", "tip2", "tip3"],
  "itinerary": [
    {
      "day": 1,
      "theme": "Day theme title",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "Activity name",
          "description": "Brief description of this activity",
          "duration": "2 hours",
          "type": "attraction"
        }
      ],
      "meals": {
        "breakfast": "Specific restaurant or food suggestion",
        "lunch": "Specific restaurant or food suggestion",
        "dinner": "Specific restaurant or food suggestion"
      },
      "accommodation": "Specific hotel or neighborhood suggestion"
    }
  ]
}

Activity types must be one of: "attraction", "food", "adventure", "culture", "relaxation", "shopping"
Include 3-5 activities per day. Make it realistic and fun!`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return extractJSON(text);
  } catch (err) {
    console.error("Gemini itinerary error:", err);
    throw new Error("Failed to generate itinerary. Please try again.");
  }
}

export async function chatWithAI(messages, destination, country) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { maxOutputTokens: 600, temperature: 0.8 },
  });

  const systemContext = `You are WanderAI, a friendly and knowledgeable travel assistant specializing in ${destination}, ${country}. 
You provide helpful, accurate, and engaging travel advice. Keep responses concise (2-4 sentences) but informative.
Focus on practical tips, local insights, hidden gems, and authentic experiences.`;

  // Build history excluding the last message
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  // Always start with a "model" primed response if first message is from model
  const filteredHistory = history.filter((_, i) => {
    if (i === 0 && history[0]?.role === "model") return false;
    return true;
  });

  try {
    const chat = model.startChat({
      history: filteredHistory,
      systemInstruction: systemContext,
    });
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    return result.response.text();
  } catch (err) {
    console.error("Gemini chat error:", err);
    throw new Error("Chat unavailable. Please try again.");
  }
}

export async function getWorldPlaceDetails(placeName, category) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
  });

  const prompt = `Give me detailed information about "${placeName}" which is a famous ${category} place.

Respond with ONLY a valid JSON object (no markdown, no code fences):
{
  "name": "${placeName}",
  "category": "${category}",
  "location": "City, Country",
  "continent": "Continent name",
  "description": "3-4 sentence description of this place",
  "history": "2-3 sentences of historical background",
  "highlights": ["highlight 1", "highlight 2", "highlight 3", "highlight 4"],
  "bestTime": "Best time of year to visit",
  "entryFee": "Approximate entry fee or 'Free'",
  "duration": "Recommended visit duration",
  "tips": ["practical tip 1", "practical tip 2", "practical tip 3"],
  "nearbyAttractions": ["nearby place 1", "nearby place 2", "nearby place 3"],
  "funFact": "One interesting fun fact about this place"
}`;

  const result = await model.generateContent(prompt);
  return extractJSON(result.response.text());
}

export async function fetchWorldPlaces(category, region) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { temperature: 0.5, maxOutputTokens: 4096 },
  });

  const prompt = `List 12 famous ${category} places${region !== "All" ? ` in ${region}` : " around the world"}.

Respond with ONLY a valid JSON array (no markdown, no code fences):
[
  {
    "name": "Place name",
    "location": "City, Country",
    "continent": "Continent",
    "tagline": "One catchy sentence about this place",
    "period": "Historical period or 'Modern' for tourist sites",
    "rating": 4.8,
    "visitors": "Annual visitors estimate like '5 million+'",
    "tags": ["tag1", "tag2"],
    "unsplashQuery": "specific landmark photo search keyword"
  }
]

Make the list diverse and globally recognized. Rating should be between 4.0 and 5.0.`;

  const result = await model.generateContent(prompt);
  return extractJSON(result.response.text());
}

export async function getDestinationInsights(destination, country) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
  });

  const prompt = `Give me 5 quick, interesting travel facts about ${destination}, ${country}. 
Format as a JSON array of strings (no markdown):
["fact 1", "fact 2", "fact 3", "fact 4", "fact 5"]`;

  try {
    const result = await model.generateContent(prompt);
    return extractJSON(result.response.text());
  } catch {
    return [];
  }
}
