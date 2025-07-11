import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { Home, Book, Settings, TrendingUp, Heart } from 'lucide-react-native';

import HomeScreen from './screens/HomeScreen';
import JournalScreen from './screens/JournalScreen';
import ProgressScreen from './screens/ProgressScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let IconComponent;

              if (route.name === 'Home') {
                IconComponent = Home;
              } else if (route.name === 'Journal') {
                IconComponent = Book;
              } else if (route.name === 'Progress') {
                IconComponent = TrendingUp;
              } else if (route.name === 'Settings') {
                IconComponent = Settings;
              }

              // You can return any component that you like here!
              return IconComponent ? <IconComponent color={color} size={size} /> : null;
            },
            tabBarActiveTintColor: '#6200ee',
            tabBarInactiveTintColor: 'gray',
            headerShown: false, // Hide the header for all screens
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Journal" component={JournalScreen} />
          <Tab.Screen name="Progress" component={ProgressScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
