import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useContext, useEffect, useState } from 'react';
import ListItem from '@/components/ListItem';
import { ProductsContext } from '@/database/database';
import { observer } from 'mobx-react';

export default observer(function ProductsList() {
  const [refreshing, setRefreshing] = useState(true);
  const productsStore = useContext(ProductsContext);

  const loadProducts = () => {
    setRefreshing(true);
    productsStore
      .fetchProducts()
      .then((_) => setRefreshing(false))
      .catch((_) => setRefreshing(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={productsStore.products}
        renderItem={(item) => <ListItem {...item.item} />}
        keyExtractor={(el) => el.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadProducts} />
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
