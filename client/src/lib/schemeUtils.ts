import { Scheme, UserInfo, AIExplanation } from '@shared/schema';
import { apiRequest } from './queryClient';
import { supportedLanguages, getTranslation } from './languageSystem';

// Re-export these for backward compatibility
export { supportedLanguages, getTranslation };

// Function to filter schemes based on user info
export async function filterSchemes(userInfo: UserInfo): Promise<Scheme[]> {
  try {
    const response = await apiRequest('POST', '/api/schemes/filter', userInfo);
    return await response.json();
  } catch (error) {
    console.error('Error filtering schemes:', error);
    return [];
  }
}

// Function to get scheme by ID
export async function getSchemeById(id: string): Promise<Scheme | null> {
  try {
    const response = await apiRequest('GET', `/api/schemes/${id}`);
    return await response.json();
  } catch (error) {
    console.error('Error getting scheme:', error);
    return null;
  }
}

// Function to get AI explanation for a scheme
export async function getSchemeExplanation(id: string, userInfo: UserInfo, language: string = 'en-IN'): Promise<AIExplanation | null> {
  try {
    const response = await apiRequest('POST', `/api/schemes/${id}/explain`, { userInfo, language });
    return await response.json();
  } catch (error) {
    console.error('Error getting scheme explanation:', error);
    return null;
  }
}

// Function to generate grievance template
export async function generateGrievanceTemplate(scheme: Scheme, userInfo: UserInfo, language: string = 'en-IN'): Promise<{ template: string } | null> {
  try {
    const response = await apiRequest('POST', '/api/grievance/template', { scheme, userInfo, language });
    return await response.json();
  } catch (error) {
    console.error('Error generating grievance template:', error);
    return null;
  }
}

// Function to get additional information about a scheme using Perplexity
export async function getAdditionalSchemeInfo(id: string, language: string = 'en-IN'): Promise<string | null> {
  try {
    const url = `/api/schemes/${id}/additional-info?language=${encodeURIComponent(language)}`;
    const response = await apiRequest('GET', url);
    const data = await response.json();
    return data.additionalInfo;
  } catch (error) {
    console.error('Error getting additional scheme info:', error);
    return null;
  }
}

// List of Indian states
export const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "National"
];

// List of sectors
export const sectors = [
  { value: "Housing", label: "Housing | आवास" },
  { value: "Financial Inclusion", label: "Financial Inclusion | वित्तीय समावेश" },
  { value: "Agriculture", label: "Agriculture | कृषि" },
  { value: "Insurance", label: "Insurance | बीमा" },
  { value: "Pension", label: "Pension | पेंशन" },
  { value: "Energy", label: "Energy | ऊर्जा" },
  { value: "Education", label: "Education | शिक्षा" },
  { value: "Health", label: "Health | स्वास्थ्य" },
  { value: "Employment", label: "Employment | रोज़गार" },
  { value: "Skill Development", label: "Skill Development | कौशल विकास" },
  { value: "Rural Development", label: "Rural Development | ग्रामीण विकास" },
  { value: "Urban Development", label: "Urban Development | शहरी विकास" },
  { value: "Water Supply", label: "Water Supply | जल आपूर्ति" },
  { value: "Social Welfare", label: "Social Welfare | सामाजिक कल्याण" },
  { value: "Infrastructure", label: "Infrastructure | बुनियादी ढांचा" },
  { value: "Fisheries", label: "Fisheries | मत्स्य पालन" },
  { value: "Food Processing", label: "Food Processing | खाद्य प्रसंस्करण" }
];