import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { ProductsContext, type ProductData } from '@/database/database';
import { useContext } from 'react';
import { observer } from 'mobx-react';

const ListItem = observer((props: ProductData) => {
  const { id, description, title, image, price } = props;

  const productsStore = useContext(ProductsContext);

  const onPress = (id: number) => {
    productsStore.addCheckoutItem(id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={styles.price}>Цена {price} $</Text>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => onPress(id)}
        >
          <View style={styles.button}>
            <Text style={styles.buttonText}>Купить</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#d1d1d1',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#ffffff',
    marginHorizontal: 10,
    marginBottom: 10,
    position: 'relative',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#d1d1d1',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#555',
    flexWrap: 'wrap',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    position: 'absolute',
    bottom: 10,
    left: 130,
  },
  buttonContainer: {
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#005B96',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ListItem;
