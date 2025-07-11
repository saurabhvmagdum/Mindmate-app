import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Card, ProgressBar, MD3Colors } from 'react-native-paper';
import { LocalStorage, type UserProgress } from '../lib/storage';
import { TrendingUp, Award, Calendar, Target } from 'lucide-react-native';

export default function ProgressScreen() {
  const [userProgress, setUserProgress] = useState<UserProgress>({ xp: 0, level: 1, completedInterventions: [] });

  useEffect(() => {
    LocalStorage.getUserProgress().then(progress => {
      setUserProgress(progress);
    });
  }, []);

  const progressPercentage = ((userProgress.xp % 100) / 100);
  const xpToNextLevel = 100 - (userProgress.xp % 100);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Progress</Text>
        <Text style={styles.headerSubtitle}>Track your mental wellness journey</Text>
      </View>

      {/* Level Card */}
      <Card style={styles.levelCard}>
        <Card.Content style={styles.levelCardContent}>
          <View style={styles.awardIconContainer}>
            <Award size={32} color="white" />
          </View>
          <Text style={styles.levelText}>Level {userProgress.level}</Text>
          <Text style={styles.levelSubtitle}>Mental Health Explorer</Text>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarTextContainer}>
              <Text style={styles.progressBarLabel}>XP Progress</Text>
              <Text style={styles.progressBarValue}>{userProgress.xp % 100} / 100 XP</Text>
            </View>
            <ProgressBar progress={progressPercentage} color={MD3Colors.neutral100} style={styles.progressBar} />
            <Text style={styles.xpToNextLevelText}>
              {xpToNextLevel} XP to reach Level {userProgress.level + 1}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Card.Content style={styles.statCardContent}>
            <TrendingUp size={24} color="#6366f1" />
            <Text style={styles.statValue}>{userProgress.xp}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statCardContent}>
            <Target size={24} color="#6366f1" />
            <Text style={styles.statValue}>{userProgress.completedInterventions.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Completed Interventions */}
      <Card style={styles.sectionCard}>
        <Card.Title 
          title="Completed Interventions"
          left={() => <Calendar size={20} color="#111827" />}
          titleStyle={styles.sectionTitle}
        />
        <Card.Content>
          {userProgress.completedInterventions.length > 0 ? (
            <View style={styles.completedInterventionsList}>
              {userProgress.completedInterventions.map((intervention, index) => (
                <View key={index} style={styles.interventionItem}>
                  <Text style={styles.interventionText}>{intervention}</Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Completed</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Target size={48} color="#9ca3af" />
              <Text style={styles.emptyStateText}>No completed interventions yet</Text>
              <Text style={styles.emptyStateSubtitle}>Start your first exercise to see progress here</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Achievements Section */}
      <Card style={styles.sectionCard}>
        <Card.Title 
          title="Achievements"
          left={() => <Award size={20} color="#111827" />}
          titleStyle={styles.sectionTitle}
        />
        <Card.Content>
          <View style={styles.achievementsList}>
            {userProgress.completedInterventions.length >= 1 && (
              <View style={[styles.achievementItem, styles.achievementItemYellow]}>
                <View style={[styles.achievementIconBg, styles.achievementIconBgYellow]}>
                  <Award size={16} color="white" />
                </View>
                <View>
                  <Text style={styles.achievementTitle}>First Step</Text>
                  <Text style={styles.achievementSubtitle}>Completed your first intervention</Text>
                </View>
              </View>
            )}
            
            {userProgress.completedInterventions.length >= 5 && (
              <View style={[styles.achievementItem, styles.achievementItemBlue]}>
                <View style={[styles.achievementIconBg, styles.achievementIconBgBlue]}>
                  <Award size={16} color="white" />
                </View>
                <View>
                  <Text style={styles.achievementTitle}>Dedicated Learner</Text>
                  <Text style={styles.achievementSubtitle}>Completed 5 interventions</Text>
                </View>
              </View>
            )}
            
            {userProgress.level >= 2 && (
              <View style={[styles.achievementItem, styles.achievementItemPurple]}>
                <View style={[styles.achievementIconBg, styles.achievementIconBgPurple]}>
                  <Award size={16} color="white" />
                </View>
                <View>
                  <Text style={styles.achievementTitle}>Level Up</Text>
                  <Text style={styles.achievementSubtitle}>Reached Level 2</Text>
                </View>
              </View>
            )}
            
            {userProgress.completedInterventions.length === 0 && userProgress.level === 1 && (
              <View style={styles.emptyState}>
                <Award size={48} color="#9ca3af" />
                <Text style={styles.emptyStateText}>No achievements yet</Text>
                <Text style={styles.emptyStateSubtitle}>Complete interventions to unlock achievements</Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Bottom spacer for navigation */}
      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
    backgroundColor: '#f8fafc',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 42,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4b5563',
  },
  levelCard: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    marginBottom: 24,
  },
  levelCardContent: {
    padding: 24,
    alignItems: 'center',
  },
  awardIconContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  levelSubtitle: {
    color: '#e0e7ff',
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBarLabel: {
    color: '#e0e7ff',
    fontSize: 14,
  },
  progressBarValue: {
    color: '#e0e7ff',
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  xpToNextLevelText: {
    color: '#e0e7ff',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
  },
  statCardContent: {
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#4b5563',
  },
  sectionCard: {
    borderRadius: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  completedInterventionsList: {
    gap: 12,
  },
  interventionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  interventionText: {
    fontWeight: '500',
    color: '#111827',
  },
  badge: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#4b5563',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  achievementsList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  achievementItemYellow: {
    backgroundColor: '#fffbeb',
    borderColor: '#fcd34d',
  },
  achievementItemBlue: {
    backgroundColor: '#eff6ff',
    borderColor: '#93c5fd',
  },
  achievementItemPurple: {
    backgroundColor: '#f5f3ff',
    borderColor: '#c4b5fd',
  },
  achievementIconBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementIconBgYellow: {
    backgroundColor: '#f59e0b',
  },
  achievementIconBgBlue: {
    backgroundColor: '#3b82f6',
  },
  achievementIconBgPurple: {
    backgroundColor: '#8b5cf6',
  },
  achievementTitle: {
    fontWeight: '500',
    color: '#111827',
  },
  achievementSubtitle: {
    fontSize: 12,
    color: '#4b5563',
  },
  spacer: {
    height: 80,
  },
});