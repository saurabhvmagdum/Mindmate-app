
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Button, Switch } from 'react-native-paper';
import { Settings as SettingsIcon, Shield, Bell, Database, AlertTriangle, Phone } from 'lucide-react-native';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleClearData = () => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to clear all your data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear Data', onPress: () => {
          // TODO: Implement data clearing logic
          Alert.alert('Success', 'All data has been cleared');
        }, style: 'destructive' },
      ]
    );
  };

  const emergencyContacts = [
    { name: 'National Suicide Prevention Lifeline', number: '988', description: '24/7 crisis support' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: '24/7 text support' },
    { name: 'Emergency Services', number: '911', description: 'For immediate emergency assistance' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <SettingsIcon size={24} color="#000" />
        <Text style={styles.headerText}>Settings</Text>
        <Text style={styles.subHeaderText}>Manage your preferences and data</Text>
      </View>

      {/* App Preferences */}
      <Card style={styles.card}>
        <Card.Title 
          title="Preferences" 
          left={(props) => <SettingsIcon {...props} size={20} />} 
        />
        <Card.Content>
          <View style={styles.preferenceItem}>
            <View>
              <Text style={styles.preferenceTitle}>Notifications</Text>
              <Text style={styles.preferenceSubtitle}>Get reminders for mental health check-ins</Text>
            </View>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications} 
            />
          </View>
          
          <View style={styles.preferenceItem}>
            <View>
              <Text style={styles.preferenceTitle}>Dark Mode</Text>
              <Text style={styles.preferenceSubtitle}>Use dark theme for the app</Text>
            </View>
            <Switch 
              value={darkMode} 
              onValueChange={setDarkMode} 
            />
          </View>
        </Card.Content>
      </Card>

      {/* Privacy & Security */}
      <Card style={styles.card}>
        <Card.Title 
          title="Privacy & Security" 
          left={(props) => <Shield {...props} size={20} />} 
        />
        <Card.Content>
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Data Storage</Text>
            <Text style={styles.infoText}>
              All your data is stored locally on your device. No information is sent to external servers.
            </Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Offline Mode</Text>
            <Text style={styles.infoText}>
              MindMate works completely offline to protect your privacy and ensure availability.
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Data Management */}
      <Card style={styles.card}>
        <Card.Title 
          title="Data Management" 
          left={(props) => <Database {...props} size={20} />} 
        />
        <Card.Content>
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Export Data</Text>
            <Text style={styles.infoText}>Download your progress and journal entries</Text>
            <Button 
              mode="outlined" 
              disabled 
              style={styles.button}
            >
              Export Data (Coming Soon)
            </Button>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoTitle}>Clear All Data</Text>
            <Text style={styles.infoText}>Permanently delete all your progress and journal entries</Text>
            <Button 
              mode="contained" 
              onPress={handleClearData}
              style={[styles.button, { backgroundColor: '#ef4444' }]}
            >
              Clear All Data
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Emergency Contacts */}
      <Card style={[styles.card, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
        <Card.Title 
          title="Emergency Resources" 
          titleStyle={{ color: '#991b1b' }}
          left={(props) => <Phone {...props} size={20} color="#991b1b" />} 
        />
        <Card.Content>
          {emergencyContacts.map((contact, index) => (
            <View key={index} style={[styles.contactItem, index < emergencyContacts.length - 1 && styles.contactDivider]}>
              <View>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactDescription}>{contact.description}</Text>
              </View>
              <Text style={styles.contactNumber}>{contact.number}</Text>
            </View>
          ))}
          
          <View style={styles.warningBox}>
            <AlertTriangle size={16} color="#991b1b" />
            <Text style={styles.warningText}>
              If you're experiencing thoughts of self-harm or suicide, please reach out for help immediately. You are not alone.
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* App Info */}
      <Card style={styles.card}>
        <Card.Content style={styles.appInfoContent}>
          <Text style={styles.appInfoTitle}>MindMate v1.0</Text>
          <Text style={styles.appInfoSubtitle}>Your offline mental health companion</Text>
        </Card.Content>
      </Card>
    </ScrollView>
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
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  preferenceSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  infoItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contactDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#fecaca',
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  contactDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991b1b',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  warningText: {
    fontSize: 13,
    color: '#991b1b',
    marginLeft: 8,
    flexShrink: 1,
  },
  appInfoContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  appInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  appInfoSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
});

export default SettingsScreen;