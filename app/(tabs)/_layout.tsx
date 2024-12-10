import { ProductsContext } from '@/database/database';
import { Tabs } from 'expo-router';
import { useContext, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  const productsStore = useContext(ProductsContext);

  useEffect(() => {
    productsStore.fetchProducts();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#005B96',
        headerStyle: {
          backgroundColor: '#005B96',
          height: 50,
        },
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontSize: 22,
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Список товаров',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'storefront' : 'storefront-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name='checkout'
        options={{
          title: 'Корзина',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'cart' : 'cart-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
