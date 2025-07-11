import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { Card, Button } from "react-native-paper";
import { LocalStorage, type UserProgress } from "../lib/storage";
import {
  findBestMatch,
  findBestMatchCosine,
  getMatchingInterventions,
  getRecommendedInterventions,
  type KeywordItem,
  type Intervention,
  type ThoughtProItem,
} from "../lib/nlp";
import {
  Brain,
  Zap,
  Search,
  CheckCircle,
  Clock,
  Book,
  AlertTriangle,
} from "lucide-react-native";

import keywordsData from "../data/keywords.json";
import interventionsData from "../data/interventions.json";
import filteredInterventionsData from "../data/interventions_filtered.json";
import thoughtProData from "../data/thought_pro.json";
import thoughtProFilteredData from "../data/thought_pro_filtered.json";

const preloadedFeelings = [
  "I am Anxious",
  "I'm feeling down",
  "I'm stressed with work",
  "I'm having relationship issues",
];

export default function HomeScreen() {
  const [userInput, setUserInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    issue: string;
    score: number;
  } | null>(null);
  const [matchingInterventions, setMatchingInterventions] = useState<
    (Intervention | ThoughtProItem)[]
  >([]);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    xp: 0,
    level: 1,
    completedInterventions: [],
  });

  useEffect(() => {
    LocalStorage.getUserProgress().then((progress) => {
      setUserProgress(progress);
    });
  }, []);

  const handleAnalyzeInput = async (text?: string) => {
    const inputText = text || userInput;
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const keywords = keywordsData as KeywordItem[];
    
    // Use the new getRecommendedInterventions function that combines cosine similarity and string matching
    const recommendationResult = getRecommendedInterventions(
      inputText,
      keywords,
      interventionsData as Intervention[],
      filteredInterventionsData as Intervention[],
      thoughtProData as ThoughtProItem[]
    );

    if (recommendationResult.score > 0) {
      setAnalysisResult({
        issue: recommendationResult.issue,
        score: recommendationResult.score
      });
      setMatchingInterventions(recommendationResult.interventions);
    } else {
      setAnalysisResult({ issue: "No specific match found", score: 0 });
      setMatchingInterventions([]);
    }

    setIsAnalyzing(false);
  };

  const handleStartIntervention = (intervention: Intervention | ThoughtProItem) => {
    // Get the title and XP based on the intervention type
    const title = ('Title' in intervention) ? (intervention as Intervention | ThoughtProItem).Title : '';
    const xp = ('XP' in intervention) ? (intervention as { XP: number }).XP : 0;
    
    const newProgress = LocalStorage.markInterventionComplete(
      title,
      xp
    );
    newProgress.then((progress) => setUserProgress(progress));
    Alert.alert("Intervention Completed!", `You earned ${xp} XP!`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Brain size={24} color="white" />
          </View>
          <Text style={styles.appName}>MindMate</Text>
        </View>
        <View style={styles.xpContainer}>
          <Zap size={16} color="white" />
          <Text style={styles.xpText}>{userProgress.xp} XP</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeTitle}>
                How are you feeling today?
              </Text>
              <Text style={styles.welcomeSubtitle}>
                Share what's on your mind, and I'll help you find the right
                support
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                multiline
                numberOfLines={4}
                placeholder="Type how you're feeling..."
                value={userInput}
                onChangeText={setUserInput}
              />
              <View style={styles.preloadedButtonsContainer}>
                {preloadedFeelings.map((feeling, index) => (
                  <Button
                    key={index}
                    mode="outlined"
                    onPress={() => {
                      setUserInput(feeling);
                      handleAnalyzeInput(feeling);
                    }}
                    style={styles.preloadedButton}
                    labelStyle={styles.preloadedButtonLabel}
                  >
                    {feeling}
                  </Button>
                ))}
              </View>

              <Button
                mode="contained"
                onPress={() => handleAnalyzeInput()}
                disabled={!userInput.trim() || isAnalyzing}
                style={styles.findSupportButton}
                labelStyle={styles.findSupportButtonLabel}
                icon={() =>
                  isAnalyzing ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Search size={20} color="white" />
                  )
                }
              >
                {isAnalyzing ? "Analyzing..." : "Find Support"}
              </Button>
            </View>
          </Card.Content>
        </Card>

        {analysisResult && (
          <Card style={styles.analysisResultCard}>
            <Card.Content>
              <View style={styles.analysisHeader}>
                <View style={styles.analysisIconContainer}>
                  <CheckCircle size={20} color="white" />
                </View>
                <View>
                  <Text style={styles.analysisTitle}>Analysis Complete</Text>
                  <Text style={styles.analysisSubtitle}>
                    Detected:{" "}
                    <Text style={styles.analysisIssue}>
                      {analysisResult.issue}
                    </Text>
                  </Text>
                </View>
              </View>
              <View style={styles.analysisInfoBox}>
                <Text style={styles.analysisInfoText}>
                  Based on your description, I've found{" "}
                  <Text style={styles.analysisInfoCount}>
                    {matchingInterventions.length} interventions
                  </Text>{" "}
                  that may help you.
                </Text>
              </View>
            </Card.Content>
          </Card>
        )}

        {matchingInterventions.length > 0 && (
          <View style={styles.interventionsList}>
            {matchingInterventions.map((intervention, index) => {
              // Get the title and other properties based on the intervention type
              const title = ('Title' in intervention) ? (intervention as Intervention | ThoughtProItem).Title : '';
              const description = 'Description' in intervention ? (intervention as Intervention | ThoughtProItem).Description : '';
              const xp = 'XP' in intervention ? (intervention as { XP: number }).XP : 0;
              const journalTemplate = 'Journal Template' in intervention ? intervention["Journal Template"] : 
                                     intervention["Journal Template"] || "";
              const issueName = 'Issue Name' in intervention ? intervention["Issue Name"] : intervention["Issue Name"];
              
              const isCompleted = userProgress.completedInterventions.includes(title);
              const isSuicideRelated = issueName.toLowerCase().includes("suicidal");

              return (
                <Card
                  key={index}
                  style={[
                    styles.interventionCard,
                    {
                      borderLeftColor: isSuicideRelated ? "#ef4444" : "#6366f1",
                    },
                  ]}
                >
                  <Card.Content>
                    <View style={styles.interventionHeader}>
                      <View style={styles.interventionTitleContainer}>
                        <Text style={styles.interventionTitleText}>
                          {title}
                          {isSuicideRelated && (
                            <AlertTriangle
                              size={16}
                              color="#ef4444"
                              style={styles.alertIcon}
                            />
                          )}
                        </Text>
                        <Text style={styles.interventionDescription}>
                          {description}
                        </Text>
                      </View>
                      <View style={styles.interventionXpContainer}>
                        <View style={styles.xpBadge}>
                          <Text style={styles.xpBadgeText}>
                            +{xp} XP
                          </Text>
                        </View>
                        {journalTemplate && (
                          <View style={styles.journalIconContainer}>
                            <Book size={12} color="#2563eb" />
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={styles.interventionFooter}>
                      <View style={styles.interventionTime}>
                        <Clock size={16} color="#6b7280" />
                        <Text style={styles.interventionTimeText}>
                          {xp <= 5
                            ? "5"
                            : xp <= 10
                            ? "10"
                            : "15"}{" "}
                          minutes
                        </Text>
                      </View>
                      <Button
                        mode="contained"
                        onPress={() => handleStartIntervention(intervention)}
                        disabled={isCompleted}
                        style={[
                          styles.interventionButton,
                          isCompleted
                            ? styles.interventionButtonCompleted
                            : null,
                          isSuicideRelated
                            ? styles.interventionButtonSuicide
                            : null,
                          journalTemplate
                            ? styles.interventionButtonJournal
                            : null,
                        ]}
                        labelStyle={styles.interventionButtonLabel}
                      >
                        {isCompleted
                          ? "Completed"
                          : journalTemplate
                          ? "Open Journal"
                          : "Start Exercise"}
                      </Button>
                    </View>
                  </Card.Content>
                </Card>
              );
            })}
          </View>
        )}

        <View style={styles.spacer} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 42,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerLeft: { flexDirection: "row", alignItems: "center" },
  logoContainer: {
    width: 32,
    height: 32,
    backgroundColor: "#6366f1",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  appName: { fontSize: 20, fontWeight: "600", color: "#111827" },
  xpContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  xpText: { color: "white", fontSize: 14, fontWeight: "500", marginLeft: 4 },
  mainContent: { padding: 16, paddingBottom: 80 },
  welcomeCard: { borderRadius: 12, marginBottom: 24 },
  welcomeTextContainer: { alignItems: "center", marginBottom: 24 },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtitle: { fontSize: 14, color: "#4b5563", textAlign: "center" },
  inputContainer: { position: "relative" },
  textInput: {
    minHeight: 100,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    marginBottom: 16,
    textAlignVertical: "top",
  },
  preloadedButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
  },
  preloadedButton: { margin: 4, borderRadius: 20, borderColor: "#6366f1" },
  preloadedButtonLabel: { color: "#6366f1", fontWeight: "600" },
  findSupportButton: {
    width: "100%",
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 8,
    backgroundColor: "#6366f1",
  },
  findSupportButtonLabel: { fontSize: 16, fontWeight: "500", color: "white" },
  analysisResultCard: { borderRadius: 12, marginBottom: 24 },
  analysisHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  analysisIconContainer: {
    width: 32,
    height: 32,
    backgroundColor: "#6366f1",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  analysisTitle: { fontWeight: "600", color: "#111827", fontSize: 16 },
  analysisSubtitle: { fontSize: 14, color: "#4b5563" },
  analysisIssue: { fontWeight: "500", color: "#6366f1" },
  analysisInfoBox: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 16,
  },
  analysisInfoText: { fontSize: 14, color: "#1e40af" },
  analysisInfoCount: { fontWeight: "500" },
  interventionsList: { gap: 16 },
  interventionCard: { borderRadius: 12, borderLeftWidth: 4 },
  interventionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  interventionTitleContainer: { flex: 1, marginRight: 12 },
  interventionTitleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  alertIcon: { marginLeft: 8 },
  interventionDescription: { fontSize: 14, color: "#4b5563", lineHeight: 20 },
  interventionXpContainer: { alignItems: "center" },
  xpBadge: {
    backgroundColor: "#6366f1",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  xpBadgeText: { color: "white", fontSize: 12, fontWeight: "500" },
  journalIconContainer: {
    backgroundColor: "#dbeafe",
    padding: 4,
    borderRadius: 12,
  },
  interventionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  interventionTime: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  interventionTimeText: { fontSize: 14, color: "#6b7280", marginLeft: 4 },
  interventionButton: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  interventionButtonLabel: { fontSize: 14, fontWeight: "500", color: "white" },
  interventionButtonCompleted: { backgroundColor: "#9ca3af" },
  interventionButtonSuicide: { backgroundColor: "#dc2626" },
  interventionButtonJournal: { backgroundColor: "#10b981" },
  spacer: { height: 80 },
});
