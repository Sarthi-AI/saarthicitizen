import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fs from "fs";
import path from "path";
import { type Scheme } from "@shared/schema";
import { 
  generateSchemeExplanation, 
  generateGrievanceTemplate, 
  searchSchemeInformation,
  getLanguageCodeFromName,
  getLanguageNameFromCode
} from "./ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Load government schemes data
  const schemesData = JSON.parse(
    fs.readFileSync(path.resolve("attached_assets/Indian Government Schemes 2025.json"), "utf-8")
  ) as Scheme[];

  // Get all schemes
  app.get("/api/schemes", (_req, res) => {
    try {
      res.json(schemesData);
    } catch (error) {
      console.error("Error fetching schemes:", error);
      res.status(500).json({ message: "Failed to fetch schemes" });
    }
  });

  // Filter schemes by criteria
  app.post("/api/schemes/filter", (req, res) => {
    try {
      const { age, gender, state, sector } = req.body;

      if (!age || !gender || !state || !sector) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const filteredSchemes = schemesData.filter((scheme) => {
        const genderMatch = scheme.gender === "All" || scheme.gender === gender;
        const stateMatch = scheme.state === "National" || scheme.state === state;
        const sectorMatch = scheme.sector.toLowerCase().includes(sector.toLowerCase());
        
        return genderMatch && stateMatch && sectorMatch;
      });

      // Sort schemes by relevance score (simple implementation)
      const scoredSchemes = filteredSchemes.map(scheme => {
        let score = 0;
        // Exact state match gets higher score than National
        if (scheme.state === state) score += 2;
        else if (scheme.state === "National") score += 1;
        
        // Exact gender match gets higher score than All
        if (scheme.gender === gender) score += 2;
        else if (scheme.gender === "All") score += 1;
        
        // Exact sector match
        if (scheme.sector === sector) score += 3;
        
        return { scheme, score };
      });
      
      // Sort by score and get top 3
      const topSchemes = scoredSchemes
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(item => item.scheme);
      
      res.json(topSchemes);
    } catch (error) {
      console.error("Error filtering schemes:", error);
      res.status(500).json({ message: "Failed to filter schemes" });
    }
  });

  // Get scheme by ID
  app.get("/api/schemes/:id", (req, res) => {
    try {
      const { id } = req.params;
      const scheme = schemesData.find((s) => s.id === id);
      
      if (!scheme) {
        return res.status(404).json({ message: "Scheme not found" });
      }
      
      res.json(scheme);
    } catch (error) {
      console.error("Error fetching scheme:", error);
      res.status(500).json({ message: "Failed to fetch scheme" });
    }
  });

  // Generate AI explanation for a scheme
  app.post("/api/schemes/:id/explain", async (req, res) => {
    try {
      const { id } = req.params;
      const { userInfo, language = 'en-IN' } = req.body;
      
      if (!userInfo) {
        return res.status(400).json({ message: "Missing user information" });
      }
      
      const scheme = schemesData.find((s) => s.id === id);
      
      if (!scheme) {
        return res.status(404).json({ message: "Scheme not found" });
      }
      
      // Generate an AI-powered explanation using OpenAI
      const aiExplanation = await generateSchemeExplanation(scheme, userInfo, language);
      res.json(aiExplanation);
    } catch (error) {
      console.error("Error generating explanation:", error);
      res.status(500).json({ message: "Failed to generate explanation" });
    }
  });

  // Generate grievance template
  app.post("/api/grievance/template", async (req, res) => {
    try {
      const { scheme, userInfo, language = 'en-IN' } = req.body;
      
      if (!scheme || !userInfo) {
        return res.status(400).json({ message: "Missing required parameters" });
      }
      
      // Generate an AI-powered grievance template using OpenAI
      const result = await generateGrievanceTemplate(scheme, userInfo, language);
      res.json(result);
    } catch (error) {
      console.error("Error generating grievance template:", error);
      res.status(500).json({ message: "Failed to generate grievance template" });
    }
  });

  // Search for additional information about a scheme using Perplexity
  app.get("/api/schemes/:id/additional-info", async (req, res) => {
    try {
      const { id } = req.params;
      const { language = 'en-IN' } = req.query;
      const languageCode = typeof language === 'string' ? language : 'en-IN';
      
      const scheme = schemesData.find((s) => s.id === id);
      
      if (!scheme) {
        return res.status(404).json({ message: "Scheme not found" });
      }
      
      // Get additional information using Perplexity in the requested language
      const additionalInfo = await searchSchemeInformation(scheme.title, languageCode);
      res.json({ additionalInfo });
    } catch (error) {
      console.error("Error fetching additional information:", error);
      res.status(500).json({ message: "Failed to fetch additional information" });
    }
  });

  // Get supported languages
  app.get("/api/languages", (_req, res) => {
    try {
      // Import the supported languages from our language system
      const supportedLanguages = [
        { code: 'en-IN', name: 'English', nativeName: 'English' },
        { code: 'hi-IN', name: 'Hindi', nativeName: 'हिंदी' },
        { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
        { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்' },
        { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు' },
        { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी' },
        { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা' },
        { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી' },
        { code: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം' },
        { code: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
        { code: 'ur-IN', name: 'Urdu', nativeName: 'اردو' },
        { code: 'or-IN', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' }
      ];
      
      res.json({ languages: supportedLanguages });
    } catch (error) {
      console.error("Error fetching supported languages:", error);
      res.status(500).json({ message: "Failed to fetch supported languages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
