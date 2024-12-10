import {
  RefreshControl,
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { observer } from 'mobx-react';
import { useContext, useEffect, useState } from 'react';
import { ProductData, ProductsContext } from '@/database/database';

const CheckoutListItem = observer(
  (props: ProductData & { count: number; checkoutId: number }) => {
    const productsStore = useContext(ProductsContext);
    const { image, title, checkoutId, count } = props;

    return (
      <View style={styles.card}>
        {/* Фото */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
        {/* Информация */}
        <View style={styles.details}>
          <Text style={styles.title}>{title}</Text>
          <Text>{`Количество: ${count}`}</Text>
          {/* Кнопки */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => productsStore.increaseCheckoutItem(checkoutId)}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => productsStore.decreaseCheckoutItem(checkoutId)}
            >
              <Text style={styles.buttonText}>—</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => productsStore.removeCheckoutItem(checkoutId)}
            >
              <Text style={styles.buttonText}>Удалить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
);

export default observer(function Checkout() {
  const productsStore = useContext(ProductsContext);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    productsStore.fetchCheckout();
  }, []);

  const loadCheckout = () => {
    setRefreshing(true);
    productsStore.fetchCheckout();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={productsStore.checkout}
        keyExtractor={(el) => el.id.toString()}
        renderItem={({ item }) => {
          const productItem = productsStore.products.find(
            (el) => el.id === item.item_id
          )!;
          return (
            <CheckoutListItem
              {...productItem}
              count={item.count}
              checkoutId={item.id}
            />
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadCheckout} />
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#005B96',
    borderRadius: 5,
    marginRight: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});
