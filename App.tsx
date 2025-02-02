import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import CurateScreen from './src/screens/CurateScreen';
import SaleScreen from './src/screens/SaleScreen';
import MoreScreen from './src/screens/MoreScreen';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (routeName, color, size) => {
  const icons = {
    Home: 'home-outline',
    Category: 'list-outline',
    Curate: 'grid-outline',
    Sale: 'pricetags-outline',
    More: 'ellipsis-horizontal-outline',
  };
  return <Ionicons name={icons[routeName]} size={size} color={color} />;
};

const TAB_SCREENS = [
  { name: 'Home', component: HomeScreen },
  { name: 'Category', component: CategoryScreen },
  { name: 'Curate', component: CurateScreen },
  { name: 'Sale', component: SaleScreen },
  { name: 'More', component: MoreScreen },
];

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => getTabBarIcon(route.name, color, size),
          headerShown: false,
          tabBarActiveTintColor: '#7a7d50',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: styles.tabBar,
          tabBarIconStyle: styles.tabBarIcon,
          tabBarLabelStyle: styles.tabBarLabel,
        })}
      >
        {TAB_SCREENS.map(({ name, component }) => (
          <Tab.Screen key={name} name={name} component={component} />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    paddingBottom: 10,
  },
  tabBarIcon: {
    marginTop: 5,
  },
  tabBarLabel: {
    fontSize: 14,
  },
});
