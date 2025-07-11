
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Card, Button, IconButton, Portal, Dialog, Paragraph } from 'react-native-paper';
import { Book, PlusCircle, Trash2, Lightbulb, X } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

const JournalScreen = () => {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newEntryContent, setNewEntryContent] = useState('');
  const [isTipModalVisible, setIsTipModalVisible] = useState(false);

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem('journalEntries');
      if (storedEntries) {
        setJournalEntries(JSON.parse(storedEntries));
      }
    } catch (error) {
      console.error('Failed to load journal entries:', error);
    }
  };

  const saveJournalEntries = async (entries: JournalEntry[]) => {
    try {
      await AsyncStorage.setItem('journalEntries', JSON.stringify(entries));
    } catch (error) {
      console.error('Failed to save journal entries:', error);
    }
  };

  const addJournalEntry = () => {
    if (newEntryContent.trim() === '') {
      Alert.alert('Error', 'Journal entry cannot be empty.');
      return;
    }
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      content: newEntryContent.trim(),
    };
    const updatedEntries = [newEntry, ...journalEntries];
    setJournalEntries(updatedEntries);
    saveJournalEntries(updatedEntries);
    setNewEntryContent('');
    setIsModalVisible(false);
  };

  const deleteJournalEntry = (id: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => {
          const updatedEntries = journalEntries.filter(entry => entry.id !== id);
          setJournalEntries(updatedEntries);
          saveJournalEntries(updatedEntries);
        }, style: 'destructive' },
      ]
    );
  };

  const journalTips = [
    "Write freely without judgment. This is your space.",
    "Focus on your feelings. What emotions are you experiencing?",
    "Explore triggers. What led to these feelings or events?",
    "Practice gratitude. List things you're thankful for.",
    "Reflect on your day. What went well? What was challenging?",
    "Set intentions. What do you want to achieve or focus on?",
    "Use prompts if you're stuck. (e.g., 'Today I felt...', 'One thing I learned...')"
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Book size={24} color="#000" />
        <Text style={styles.headerText}>Journal</Text>
        <Text style={styles.subHeaderText}>Reflect on your thoughts and feelings</Text>
      </View>

      {/* Journal Entries */}
      <ScrollView style={styles.entriesContainer}>
        {journalEntries.length === 0 ? (
          <View style={styles.emptyJournalContainer}>
            <Text style={styles.emptyJournalText}>No journal entries yet.</Text>
            <Text style={styles.emptyJournalSubText}>Tap the '+' button to add your first entry.</Text>
          </View>
        ) : (
          journalEntries.map((entry) => (
            <Card key={entry.id} style={styles.card}>
              <Card.Content>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryDate}>{entry.date}</Text>
                  <IconButton
                    icon={() => <Trash2 size={20} color="#ef4444" />}
                    onPress={() => deleteJournalEntry(entry.id)}
                    size={20}
                    style={{ margin: 0, padding: 0 }}
                  />
                </View>
                <Text style={styles.entryContent}>{entry.content}</Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <Button
          icon={() => <Lightbulb size={20} color="#6200ee" />}
          mode="outlined"
          onPress={() => setIsTipModalVisible(true)}
          style={styles.actionButton}
          labelStyle={styles.actionButtonLabel}
        >
          Journal Tips
        </Button>
        <Button
          icon={() => <PlusCircle size={20} color="#fff" />}
          mode="contained"
          onPress={() => setIsModalVisible(true)}
          style={styles.actionButton}
          labelStyle={styles.actionButtonLabel}
        >
          Add Entry
        </Button>
      </View>

      {/* Add Entry Modal */}
      <Portal>
        <Dialog visible={isModalVisible} onDismiss={() => setIsModalVisible(false)} style={styles.modalContainer}>
          <Dialog.Title>New Journal Entry</Dialog.Title>
          <Dialog.Content>
            <TextInput
              placeholder="What's on your mind today?"
              value={newEntryContent}
              onChangeText={setNewEntryContent}
              multiline
              numberOfLines={6}
              style={styles.textInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsModalVisible(false)}>Cancel</Button>
            <Button onPress={addJournalEntry}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Journal Tips Modal */}
      <Portal>
        <Dialog visible={isTipModalVisible} onDismiss={() => setIsTipModalVisible(false)} style={styles.modalContainer}>
          <Dialog.Title>Journaling Tips</Dialog.Title>
          <Dialog.Content>
            <ScrollView style={{ maxHeight: 200 }}>
              {journalTips.map((tip, index) => (
                <Paragraph key={index} style={styles.tipText}>• {tip}</Paragraph>
              ))}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsTipModalVisible(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 42,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  subHeaderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  entriesContainer: {
    flex: 1,
  },
  emptyJournalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyJournalText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptyJournalSubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  entryContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  actionButtonLabel: {
    fontSize: 14,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    margin: 20,
  },
  textInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  tipText: {
    marginBottom: 8,
    fontSize: 16,
    lineHeight: 24,
  },
});

export default JournalScreen;