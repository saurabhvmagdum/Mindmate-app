export type KeywordItem = {
  keyword: string;
  issue: string;
  score: number;
};

export type Intervention = {
  Title: string;
  Description: string;
  XP: number;
  "Issue Name": string;
  "Journal Template"?: string;
  "Intervention Sub Type"?: string;
};

export type ThoughtProItem = {
  "Issue Name": string;
  "Intervention Sub Type": string;
  Title: string;
  Description: string;
  XP: number;
  "Journal Template": string;
};

// @ts-ignore
import { findBestMatch as findBestMatchString } from 'string-similarity';

// Function to calculate cosine similarity between two vectors
const calculateCosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have the same length');
  }
  
  // Calculate dot product
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  
  // Calculate magnitudes
  const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  
  // Calculate cosine similarity
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0; // Avoid division by zero
  }
  
  return dotProduct / (magnitudeA * magnitudeB);
};

// Convert text to a simple vector representation (term frequency)
// Simple stemming function to handle common word variations
const stemWord = (word: string): string => {
  // Handle common suffixes
  if (word.endsWith('ing')) return word.slice(0, -3);
  if (word.endsWith('ed')) return word.slice(0, -2);
  if (word.endsWith('s')) return word.slice(0, -1);
  if (word.endsWith('y')) return word.slice(0, -1) + 'i';
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y';
  return word;
};

// Update the textToVector function to use stemming
const textToVector = (text: string, vocabulary: string[]): number[] => {
  const words = text.toLowerCase().split(/\W+/).filter(word => word.length > 0)
    .map(word => stemWord(word)); // Apply stemming to each word
  
  return vocabulary.map(term => {
    const stemmedTerm = stemWord(term);
    const count = words.filter(word => word === stemmedTerm).length;
    return count / words.length; // Normalize by text length
  });
};

// Find best match using cosine similarity
export const findBestMatchCosine = (input: string, keywords: KeywordItem[]) => {
  // Create a vocabulary from all keywords
  const vocabulary = Array.from(new Set(keywords.map(k => k.keyword.toLowerCase().split(/\W+/).filter(word => word.length > 0)).flat()));
  
  // Convert input to vector
  const inputVector = textToVector(input, vocabulary);
  
  // Calculate similarity with each keyword
  const similarities = keywords.map(keyword => {
    const keywordVector = textToVector(keyword.keyword, vocabulary);
    const similarity = calculateCosineSimilarity(inputVector, keywordVector);
    return { keyword, similarity };
  });
  
  // Find the best match
  const bestMatch = similarities.sort((a, b) => b.similarity - a.similarity)[0];
  
  if (bestMatch && bestMatch.similarity > 0.3) { // Threshold can be adjusted
    return { issue: bestMatch.keyword.issue, score: bestMatch.similarity };
  }
  
  return { issue: "No specific match found", score: 0 };
};

// Legacy string similarity method
export const findBestMatch = (input: string, keywords: KeywordItem[]) => {
  const matches = findBestMatchString(input, keywords.map(k => k.keyword));
  if (matches.bestMatch.rating > 0.3) { // Threshold can be adjusted
    const bestKeyword = keywords.find(k => k.keyword === matches.bestMatch.target);
    if (bestKeyword) {
      return { issue: bestKeyword.issue, score: matches.bestMatch.rating };
    }
  }
  return { issue: "No specific match found", score: 0 };
};

export const getMatchingInterventions = (
  issue: string,
  allInterventions: Intervention[],
  filteredInterventions: Intervention[],
  thoughtProItems: ThoughtProItem[] = []
) => {
  let interventions: (Intervention | ThoughtProItem)[] = [];
  
  if (issue.toLowerCase().includes('suicidal')) {
    // For suicidal thoughts, only use filtered interventions for safety
    interventions = filteredInterventions.filter(int => 
      int["Issue Name"].toLowerCase().includes('suicidal')
    );
  } else {
    // Get matching interventions from regular interventions
    const matchingRegularInterventions = allInterventions.filter(int => 
      int["Issue Name"].toLowerCase() === issue.toLowerCase()
    );
    
    // Get matching interventions from thought pro items
    const matchingThoughtProItems = thoughtProItems.filter(item => 
      item["Issue Name"].toLowerCase() === issue.toLowerCase()
    );
    
    // Combine both types of interventions
    interventions = [...matchingRegularInterventions, ...matchingThoughtProItems];
  }
  
  return interventions;
};

// Function to get recommended interventions based on user input
export const getRecommendedInterventions = (
  userInput: string,
  keywords: KeywordItem[],
  allInterventions: Intervention[],
  filteredInterventions: Intervention[],
  thoughtProItems: ThoughtProItem[] = []
) => {
  // Try cosine similarity first for better matching
  let result = findBestMatchCosine(userInput, keywords);
  
  // If cosine similarity doesn't find a good match, fall back to string similarity
  if (result.score === 0) {
    result = findBestMatch(userInput, keywords);
  }
  
  // Get matching interventions based on the identified issue
  const interventions = getMatchingInterventions(
    result.issue,
    allInterventions,
    filteredInterventions,
    thoughtProItems
  );
  
  return {
    issue: result.issue,
    score: result.score,
    interventions
  };
};