import OpenAI from "openai";
import { Scheme, UserInfo, AIExplanation } from "@shared/schema";
import axios from "axios";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const OPENAI_MODEL = "gpt-4o";

// Language mapping for API requests
const languageMapping = {
  'en-IN': 'English',
  'hi-IN': 'Hindi',
  'kn-IN': 'Kannada', 
  'ta-IN': 'Tamil',
  'te-IN': 'Telugu',
  'mr-IN': 'Marathi',
  'bn-IN': 'Bengali',
  'gu-IN': 'Gujarati',
  'ml-IN': 'Malayalam',
  'pa-IN': 'Punjabi',
  'ur-IN': 'Urdu',
  'or-IN': 'Odia'
};

/**
 * Generate a personalized explanation for a government scheme based on user information and language
 */
export async function generateSchemeExplanation(
  scheme: Scheme, 
  userInfo: UserInfo, 
  language: string = 'en-IN'
): Promise<AIExplanation> {
  try {
    const userDescription = userInfo.description || '';
    const languageName = (languageMapping as Record<string, string>)[language] || 'English';
    
    const prompt = `
      I need a personalized explanation about a government scheme for a user with the following profile:
      - Age: ${userInfo.age}
      - Gender: ${userInfo.gender}
      - State: ${userInfo.state}
      - Sector of interest: ${userInfo.sector}
      ${userDescription ? `- User's described need: ${userDescription}` : ''}

      The government scheme details:
      - Name: ${scheme.title}
      - Description: ${scheme.description}
      - Eligibility: ${scheme.eligibility}
      - Benefits: ${scheme.benefits}
      - State coverage: ${scheme.state}
      - Sector: ${scheme.sector}
      - URL: ${scheme.url}

      Please provide:
      1. A personalized explanation of how this scheme applies to the user's situation in simple language
      2. A list of required documents they'll likely need to apply
      3. Clear next steps to apply for the scheme

      Format the response as valid JSON with these keys:
      - explanation (string)
      - requiredDocuments (array of strings)
      - nextSteps (string)
      
      IMPORTANT: Respond in ${languageName} language. Use simple, conversational ${languageName} that's easy to understand.
    `;

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { 
          role: "system", 
          content: `You are a helpful government services assistant that explains Indian government schemes in simple language and provides practical guidance. You can communicate fluently in ${languageName} and should adapt your response to this language.`
        },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the response as JSON
    const content = response.choices[0].message.content || "{}";
    const result = JSON.parse(content);
    return result as AIExplanation;
  } catch (error) {
    console.error("Error generating scheme explanation:", error);
    // Return a fallback response in case of API error
    return {
      explanation: `${scheme.title} provides ${scheme.benefits}. Based on your profile as a ${userInfo.age}-year-old ${userInfo.gender} from ${userInfo.state}, you may be eligible if you meet these criteria: ${scheme.eligibility}`,
      requiredDocuments: [
        "Aadhaar Card",
        "PAN Card",
        "Income Certificate",
        "Residence Proof",
        "Bank Account Details"
      ],
      nextSteps: `Visit the official website (${scheme.url}) to apply online or visit your nearest government office with your documents.`
    };
  }
}

/**
 * Generate a grievance template for a government scheme in the specified language
 */
export async function generateGrievanceTemplate(
  scheme: Scheme, 
  userInfo: UserInfo, 
  language: string = 'en-IN'
): Promise<{ template: string }> {
  try {
    const languageName = (languageMapping as Record<string, string>)[language] || 'English';
    
    const prompt = `
      Create a formal grievance letter template for a citizen who wants to file a complaint regarding a government scheme.
      
      Citizen's details:
      - Age: ${userInfo.age}
      - Gender: ${userInfo.gender}
      - State: ${userInfo.state}
      
      Scheme details:
      - Name: ${scheme.title}
      - Description: ${scheme.description}
      
      The template should include placeholders for:
      - Citizen's name
      - Contact details
      - Application number
      - Date of application
      - Specific issue description
      - Previous attempts to resolve
      - Date
      - Signature
      
      Make it formal but accessible. Format it as a proper letter with standard grievance format used in Indian government offices.
      
      IMPORTANT: Write the template in ${languageName} language. Use proper formal ${languageName} suitable for an official letter.
    `;

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { 
          role: "system", 
          content: `You are a helpful assistant that creates formal templates for government communication. You are fluent in ${languageName} and should create your response in this language.`
        },
        { role: "user", content: prompt }
      ]
    });

    const content = response.choices[0].message.content || '';
    return { template: content };
  } catch (error) {
    console.error("Error generating grievance template:", error);
    // Return a fallback template in case of API error
    return {
      template: `
Respected Sir/Madam,

Subject: Grievance Regarding ${scheme.title}

I, [Your Name], a [${userInfo.age}]-year-old [${userInfo.gender}] resident of [Your Address], ${userInfo.state}, would like to register a grievance regarding my application for the ${scheme.title}.

Application Details:
- Application Number: [Your Application Number]
- Date of Application: [Date of Application]
- Current Status: [Status if known]

Issue Description:
[Describe your issue here - e.g., application pending for extended period, rejection without proper reason, subsidy not received, etc.]

I have already attempted to resolve this issue by [mention previous attempts to resolve], but have not received a satisfactory response.

I request your immediate attention to this matter and would appreciate if you could provide a resolution at the earliest.

Thank you for your assistance.

Sincerely,
[Your Name]
[Your Contact Number]
[Your Email Address]
Date: [Current Date]
      `
    };
  }
}

/**
 * Search for additional information about a government scheme using Perplexity API
 * in the specified language
 */
export async function searchSchemeInformation(
  schemeName: string, 
  language: string = 'en-IN'
): Promise<string> {
  try {
    const languageName = (languageMapping as Record<string, string>)[language] || 'English';
    
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "system",
            content: `You are a government services assistant focused on Indian government schemes. Provide accurate, concise information with relevant details. You should respond in ${languageName} language.`
          },
          {
            role: "user",
            content: `Provide detailed information about the Indian government scheme "${schemeName}" including its purpose, eligibility criteria, benefits, application process, and any recent updates or changes. Focus on facts. Respond in ${languageName} language.`
          }
        ],
        max_tokens: 700,
        temperature: 0.2,
        search_domain_filter: ["perplexity.ai"],
        search_recency_filter: "month",
        stream: false
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching scheme information with Perplexity:", error);
    return `Sorry, I couldn't retrieve additional information about ${schemeName} at this time. Please refer to the scheme details provided or visit the official website.`;
  }
}

/**
 * Get language ISO code from language name
 */
export function getLanguageCodeFromName(languageName: string): string {
  const entries = Object.entries(languageMapping);
  const match = entries.find(([, name]) => name.toLowerCase() === languageName.toLowerCase());
  return match ? match[0] : 'en-IN';
}

/**
 * Get language name from ISO code
 */
export function getLanguageNameFromCode(languageCode: string): string {
  return (languageMapping as Record<string, string>)[languageCode] || 'English';
}