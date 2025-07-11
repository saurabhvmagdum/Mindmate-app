import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserProgress = {
  xp: number;
  level: number;
  completedInterventions: string[];
};

const USER_PROGRESS_KEY = 'userProgress';

export const LocalStorage = {
  async getUserProgress(): Promise<UserProgress> {
    try {
      const jsonValue = await AsyncStorage.getItem(USER_PROGRESS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : { xp: 0, level: 1, completedInterventions: [] };
    } catch (e) {
      console.error('Error reading user progress from AsyncStorage', e);
      return { xp: 0, level: 1, completedInterventions: [] };
    }
  },

  async saveUserProgress(progress: UserProgress) {
    try {
      const jsonValue = JSON.stringify(progress);
      await AsyncStorage.setItem(USER_PROGRESS_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving user progress to AsyncStorage', e);
    }
  },

  async markInterventionComplete(interventionTitle: string, xpEarned: number): Promise<UserProgress> {
    const currentProgress = await this.getUserProgress();
    
    if (!currentProgress.completedInterventions.includes(interventionTitle)) {
      currentProgress.completedInterventions.push(interventionTitle);
      currentProgress.xp += xpEarned;

      // Simple leveling system: 100 XP per level
      currentProgress.level = Math.floor(currentProgress.xp / 100) + 1;

      await this.saveUserProgress(currentProgress);
    }
    return currentProgress;
  },

  async clearAllData() {
    try {
      await AsyncStorage.clear();
      console.log('All data cleared from AsyncStorage');
    } catch (e) {
      console.error('Error clearing data from AsyncStorage', e);
    }
  },
};