import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import BibleScreen from '../screens/BibleScreen';
import AssistantScreen from '../screens/AssistantScreen';
import UtilityScreen from '../screens/UtilityScreen';
import BookListScreen from '../screens/BookListScreen';
import ChapterListScreen from '../screens/ChapterListScreen';
import VerseDetailScreen from '../screens/VerseDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Bible Stack Navigator
function BibleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="BookList" 
        component={BookListScreen} 
        options={{ title: 'Bible' }}
      />
      <Stack.Screen 
        name="ChapterList" 
        component={ChapterListScreen} 
        options={{ title: 'Chapters' }}
      />
      <Stack.Screen 
        name="BibleReader" 
        component={BibleScreen} 
        options={{ title: 'Reading' }}
      />
      <Stack.Screen 
        name="VerseDetail" 
        component={VerseDetailScreen} 
        options={{ title: 'Verse Details' }}
      />
    </Stack.Navigator>
  );
}

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Bible') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Assistant') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Utilities') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarStyle: {
          backgroundColor: 'rgba(102, 126, 234, 0.95)',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 90,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Bible" 
        component={BibleStack}
        options={{
          tabBarLabel: 'Bible',
        }}
      />
      <Tab.Screen 
        name="Assistant" 
        component={AssistantScreen}
        options={{
          tabBarLabel: 'AI',
        }}
      />
      <Tab.Screen 
        name="Utilities" 
        component={UtilityScreen}
        options={{
          tabBarLabel: 'My Bible',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}
