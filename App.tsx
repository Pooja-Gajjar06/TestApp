import React from 'react';
import {StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './screens/HomeScreen';
import CategoryScreen from './screens/CategoryScreen';
import CurateScreen from './screens/CurateScreen';
import SaleScreen from './screens/SaleScreen';
import MoreScreen from './screens/MoreScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Tab = createBottomTabNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = '';
        
            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Category') {
              iconName = 'list-outline';
            } else if (route.name === 'Curate') {
              iconName = 'grid-outline';
            } else if (route.name === 'Sale') {
              iconName = 'pricetags-outline';
            } else if (route.name === 'More') {
              iconName = 'ellipsis-horizontal-outline';
            }
        
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          headerShown:false,
          tabBarActiveTintColor: '#7a7d50',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            height: 70, 
            paddingBottom: 10, 
          },
          tabBarIconStyle: {
            marginTop: 5,
          },
          tabBarLabelStyle: {
            fontSize: 14, 
          },

        })}
        
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Category" component={CategoryScreen} />
        <Tab.Screen name="Curate" component={CurateScreen} />
        <Tab.Screen name="Sale" component={SaleScreen} />
        <Tab.Screen name="More" component={MoreScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});
