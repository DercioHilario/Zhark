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

    const handleIncreaseQuantity = (id: number, colorCode: string | undefined, currentQuantity: number) => {
        updateQuantity(id, colorCode, currentQuantity + 1);
    };

    const handleDecreaseQuantity = (id: number, colorCode: string | undefined, currentQuantity: number) => {
        if (currentQuantity > 1) {
            updateQuantity(id, colorCode, currentQuantity - 1);
        }
    };

    if (items.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Meu Carrinho</Text>
                </View>
                <View style={styles.emptyContainer}>
                    <Image
                        source={require('../../../assets/img/empty.gif')} // substitua pelo nome correto da imagem
                        style={styles.emptyImage}
                        resizeMode="contain"
                    />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Meu Carrinho</Text>
            <ScrollView>
                {items.map((item) => (
                    <View key={`${item.id}-${item.selectedColor?.code || 'default'}`} style={styles.cartItems}>
                        <View style={styles.cartItem}>
                            <Image source={{ uri: item.image }} style={styles.itemImage} />
                            <View style={styles.itemDetails}>
                                <View style={styles.cartItemHeader}>
                                    <View>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemPrice}>{item.price} MTZ</Text>
                                        {/* Verifica se selectedColor existe antes de exibir */}
                                        {item.selectedColor ? (
                                            <Text style={styles.itemColor}>Cor: {item.selectedColor.name}</Text>
                                        ) : null}
                                        {/* Verifica se selectedTamanho existe antes de exibir */}
                                        {item.selectedSize ? (
                                            <Text style={styles.itemTamanho}>Tamanho: {item.selectedSize.name}</Text>
                                        ) : null}
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => removeFromCart(item.id, item.selectedColor?.code)}
                                        style={styles.removeButton}
                                    >
                                        <Trash2 size={24} color="#FF4444" />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.quantityContainer}>
                                    <View style={styles.quantityControls}>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => handleDecreaseQuantity(item.id, item.selectedColor?.code, item.quantity)}
                                        >
                                            <Minus size={20} color="#000000" />
                                        </TouchableOpacity>
                                        <Text style={styles.quantityText}>{item.quantity}</Text>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => handleIncreaseQuantity(item.id, item.selectedColor?.code, item.quantity)}
                                        >
                                            <Plus size={20} color="#000000" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.cartFooter}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalAmount}>{total.toFixed(2).replace('.', ',')} MTZ</Text>
                </View>
                <TouchableOpacity style={styles.checkoutButton}>
                    <Text style={styles.checkoutText}>Finalizar Compra</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        backgroundColor: '#fff',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "Wellfleet",
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerTitle: {
        fontSize: 24,
        color: 'black',
        fontFamily: "Wellfleet",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyImage: {
        height: 300,
        width: 250,
        marginBottom: 120,
    },
    title: {
        fontSize: 24,
        padding: 10,
        textAlign: 'center',
        fontFamily: "Wellfleet",
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',

    },
    cartItems: {
        flex: 1,
        paddingHorizontal: 16,
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 1,
        marginTop: 5,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    itemImage: {
        width: 100,
        height: 130,
        borderRadius: 10,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 15,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        fontFamily: "Wellfleet",
    },
    itemColor: {
        fontSize: 14,
        color: '#666666',
        marginTop: 4,
        fontFamily: "Wellfleet",
    },
    itemPrice: {
        color: '#666666',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 4,
        fontFamily: "Wellfleet",
    },
    itemTamanho: {
        color: '#666666',
        fontSize: 16,
        fontWeight: '600',
        marginTop: 4,
        fontFamily: "Wellfleet",
    },

    cartItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
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
        marginTop: 0,
    },
    quantityButton: {
        borderRadius: 5,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#d6d6d6',
    },
    quantityText: {
        fontSize: 17,
        fontWeight: '500',
        marginHorizontal: 12,
        fontFamily: "Wellfleet",
    },
    removeButton: {

    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    totalText: {
        fontSize: 18,
        fontWeight: '600',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: "Wellfleet",
    },
    checkoutButton: {
        backgroundColor: '#1CA9C9',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    checkoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: "Wellfleet",
    },
    cartFooter: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: "Wellfleet",
    },
});
