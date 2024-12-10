import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ProductsStore, ProductsContext } from '@/database/database';

export default function RootLayout() {
  return (
    <ProductsContext.Provider value={new ProductsStore()}>
      <StatusBar style='light' backgroundColor='#005B96' translucent={false} />
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        <Stack.Screen name='+not-found' />
      </Stack>
    </ProductsContext.Provider>
  );
}
