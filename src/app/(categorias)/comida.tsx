import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Modal, StyleSheet, Dimensions, FlatList, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShoppingCart, Search, X, Trash2 } from 'lucide-react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styles from "../Style/comida";
import * as Font from "expo-font";

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    quantity?: number;
}

interface CartItem extends Product {
    quantity: number;
}

const products: Product[] = [
    {
        id: 1,
        name: 'Feijoada Completa',
        price: 45.90,
        description: 'Feijoada tradicional com arroz, couve, farofa, laranja e torresmo. Serve 1 pessoa.',
        image: 'https://images.unsplash.com/photo-1574343635105-4cf2ea136b8b?auto=format&fit=crop&w=600',

    },
    {
        id: 2,
        name: 'Pizza Margherita',
        price: 150.94,
        description: 'Pizza tradicional italiana com molho de tomate, mussarela de búfala, manjericão fresco e azeite. 8 fatias.',
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600',

    },
    {
        id: 3,
        name: 'Combo Sushi',
        price: 150.54,
        description: 'Combinado com 30 peças incluindo sushis variados, sashimis de salmão e atum, e hot rolls.',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600',

    },
    {
        id: 4,
        name: 'Picanha na Brasa',
        price: 150.90,
        description: 'Picanha grelhada no ponto com arroz, farofa, vinagrete e pão de alho. Serve 1 pessoa.',
        image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=600',

    },
    {
        id: 5,
        name: 'Pizza Pepperoni',
        price: 460.90,
        description: 'Pizza com generosa cobertura de pepperoni, molho de tomate e queijo mussarela. 8 fatias.',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600',

    },
    {
        id: 6,
        name: 'Temaki Salmão',
        price: 290.90,
        description: 'Temaki recheado com salmão fresco, cream cheese, cebolinha e arroz. Acompanha shoyu e wasabi.',
        image: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&w=600',

    }
];

export default function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product: Product, quantity: number) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(cartItem => cartItem.id === product.id);
            if (existingItem) {
                return currentCart.map(cartItem =>
                    cartItem.id === product.id
                        ? { ...cartItem, quantity: cartItem.quantity + quantity }
                        : cartItem
                );
            }
            return [...currentCart, { ...product, quantity }];
        });
    };


    const removeFromCart = (itemId: number) => {
        setCart(currentCart => currentCart.filter(item => item.id !== itemId));
    };

    const updateQuantity = (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) {
            removeFromCart(itemId);
            return;
        }
        setCart(currentCart =>
            currentCart.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => setSelectedProduct(item)}
        >
            <Image
                source={{ uri: item.image }}
                style={styles.productImage}
            />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDescription} numberOfLines={2} ellipsizeMode="tail">
                    {item.description}
                </Text>
                <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>{item.price.toFixed(2)} MTZ</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const router = useRouter();
    const goToInicio = useCallback(() => {
        router.replace("/(panel)/inicio");
    }, [router]);

    const [quantity, setQuantity] = useState(1);

    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        const loadFonts = async () => {
            try {
                await Font.loadAsync({
                    Wellfleet: require("../../../assets/fonts/Wellfleet-Regular.ttf"),
                });
                setFontsLoaded(true);
            } catch (error) {
                console.error("Erro ao carregar fontes:", error);
            }
        };
        loadFonts();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={goToInicio}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Comida</Text>
                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={() => setIsCartOpen(true)}
                    >
                        <ShoppingCart stroke="black" width={24} height={24} />
                        {cart.length > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>{cart.length}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                {/* Search */}
                <View style={styles.searchContainer}>
                    <Search stroke="#9CA3AF" width={20} height={20} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar produtos"
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                </View>
                <Text style={styles.sectionTitle}>Produtos:</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Products */}
                <View style={styles.productsContainer}>
                    <FlatList
                        data={filteredProducts}
                        renderItem={renderProduct}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                        numColumns={2} // Define duas colunas por linha
                        columnWrapperStyle={{ justifyContent: 'space-between' }} // Distribui os itens uniformemente

                    />
                </View>
            </ScrollView>
            {/* Product Details Modal */}
            <Modal
                visible={selectedProduct !== null}
                animationType="slide"
                transparent={true}
            >
                {selectedProduct && (
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalImageContainer}>
                                <Image
                                    source={{ uri: selectedProduct.image }}
                                    style={styles.modalImage}
                                />
                                <TouchableOpacity
                                    style={styles.modalCloseButton}
                                    onPress={() => {
                                        setSelectedProduct(null);
                                        setQuantity(1);
                                    }}
                                >
                                    <X color="black" size={24} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.modalInfo}>
                                <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                                <Text style={styles.modalDescription}>{selectedProduct.description}</Text>

                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity
                                        style={styles.quantityButton}
                                        onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    >
                                        <Text style={styles.quantityText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.quantityValue}>{quantity}</Text>
                                    <TouchableOpacity
                                        style={styles.quantityButton}
                                        onPress={() => setQuantity(prev => prev + 1)}
                                    >
                                        <Text style={styles.quantityText}>+</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text style={styles.modalPrice}>
                                    {(selectedProduct.price * quantity).toFixed(2)} MTZ
                                </Text>
                                <TouchableOpacity
                                    style={styles.modalAddButton}
                                    onPress={() => {
                                        addToCart(selectedProduct, quantity); // Passa o produto e a quantidade
                                        setSelectedProduct(null);
                                        setQuantity(1); // Reseta a quantidade para 1 após adicionar ao carrinho
                                    }}
                                >
                                    <Text style={styles.modalAddButtonText}>Adicionar ao Carrinho</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </Modal>

            {/* Cart Modal */}
            <Modal
                visible={isCartOpen}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.cartModal}>
                    <View style={styles.cartContent}>
                        <View style={styles.cartHeader}>

                            <TouchableOpacity
                                onPress={() => setIsCartOpen(false)}
                            >
                                <MaterialCommunityIcons name="arrow-left" size={28} color="#000" />
                            </TouchableOpacity>
                            <Text style={styles.cartTitle}>Carrinho</Text>
                            <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
                        </View>


                        {cart.length === 0 ? (
                            <View style={styles.emptyCart}>
                                <Text style={styles.emptyCartText}>Seu carrinho está vazio</Text>
                            </View>
                        ) : (
                            <>
                                <ScrollView style={styles.cartItems}>
                                    {cart.map((item) => (
                                        <View key={item.id} style={styles.cartItem}>
                                            <Image
                                                source={{ uri: item.image }}
                                                style={styles.cartItemImage}
                                            />
                                            <View style={styles.cartItemInfo}>
                                                <View style={styles.cartItemHeader}>
                                                    <View>
                                                        <Text style={styles.cartItemName}>{item.name}</Text>
                                                        <Text style={styles.cartItemPrice}>
                                                            {item.price.toFixed(2)} MTZ
                                                        </Text>
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => removeFromCart(item.id)}
                                                    >
                                                        <Trash2 color="#EF4444" size={24} />
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={styles.quantityControls}>
                                                    <TouchableOpacity
                                                        style={styles.quantityButton}
                                                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        <Text style={styles.quantityButtonText}>-</Text>
                                                    </TouchableOpacity>
                                                    <Text style={styles.quantityText}>{item.quantity}</Text>
                                                    <TouchableOpacity
                                                        style={styles.quantityButton}
                                                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        <Text style={styles.quantityButtonText}>+</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                                <View style={styles.cartFooter}>
                                    <View style={styles.totalContainer}>
                                        <Text style={styles.totalLabel}>Total:</Text>
                                        <Text style={styles.totalPrice}>
                                            {totalPrice.toFixed(2)} MTZ
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.checkoutButton}
                                        onPress={() => {
                                            Alert.alert('Sucesso', 'Pedido realizado com sucesso!');
                                            setCart([]);
                                            setIsCartOpen(false);
                                        }}
                                    >
                                        <Text style={styles.checkoutButtonText}>Finalizar Pedido</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
