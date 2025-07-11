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
};

// @ts-ignore
import { findBestMatch as findBestMatchString } from 'string-similarity';

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
  filteredInterventions: Intervention[]
) => {
  if (issue.toLowerCase().includes('suicidal')) {
    return filteredInterventions.filter(int => int["Issue Name"].toLowerCase().includes('suicidal'));
  } else {
    return allInterventions.filter(int => int["Issue Name"].toLowerCase() === issue.toLowerCase());
  }
};