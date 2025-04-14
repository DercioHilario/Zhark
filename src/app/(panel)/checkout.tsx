import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '../../stores/cartStore';
import { Trash2, Plus, Minus } from 'lucide-react-native';

export default function CartScreen() {
    const { items, removeFromCart, updateQuantity } = useCartStore();

    const total = items.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('R$ ', '').replace(',', '.'));
        return sum + price * item.quantity;
    }, 0);

    const handleIncreaseQuantity = (id: number, colorCode: string, currentQuantity: number) => {
        updateQuantity(id, colorCode, currentQuantity + 1);
    };

    const handleDecreaseQuantity = (id: number, colorCode: string, currentQuantity: number) => {
        if (currentQuantity > 1) {
            updateQuantity(id, colorCode, currentQuantity - 1);
        }
    };

    if (items.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Meu Carrinho</Text>
                {items.map((item) => (
                    <View key={`${item.id}-${item.selectedColor.code}`} style={styles.cartItem}>
                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemColor}>Cor: {item.selectedColor.name}</Text>
                            <Text style={styles.itemPrice}>{item.price}</Text>
                            <View style={styles.quantityContainer}>
                                <View style={styles.quantityControls}>
                                    <TouchableOpacity
                                        style={styles.quantityButton}
                                        onPress={() => handleDecreaseQuantity(item.id, item.selectedColor.code, item.quantity)}
                                    >
                                        <Minus size={20} color="#000000" />
                                    </TouchableOpacity>
                                    <Text style={styles.quantityText}>{item.quantity}</Text>
                                    <TouchableOpacity
                                        style={styles.quantityButton}
                                        onPress={() => handleIncreaseQuantity(item.id, item.selectedColor.code, item.quantity)}
                                    >
                                        <Plus size={20} color="#000000" />
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    onPress={() => removeFromCart(item.id, item.selectedColor.code)}
                                    style={styles.removeButton}
                                >
                                    <Trash2 size={20} color="#FF4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
                <View style={styles.totalContainer}>
                    <Text style={styles.totalText}>Total:</Text>
                    <Text style={styles.totalAmount}>R$ {total.toFixed(2).replace('.', ',')}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutText}>Finalizar Compra</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#666666',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 20,
    },
    cartItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 15,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '500',
    },
    itemColor: {
        fontSize: 14,
        color: '#666666',
        marginTop: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 4,
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 4,
    },
    quantityButton: {
        padding: 8,
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '500',
        marginHorizontal: 12,
    },
    removeButton: {
        padding: 8,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    totalText: {
        fontSize: 18,
        fontWeight: '600',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    checkoutButton: {
        backgroundColor: '#000000',
        margin: 20,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    checkoutText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});
