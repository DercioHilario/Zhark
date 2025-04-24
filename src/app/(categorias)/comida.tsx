import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, Modal, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, Check } from 'lucide-react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styles from "../Style/comida";
import * as Font from "expo-font";
import { useCartStore } from '../../stores/cartStore';

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
}

const products: Product[] = [
    {
        id: 10,
        name: 'Feijoada Completa',
        price: 45.90,
        description: 'Feijoada tradicional com arroz, couve, farofa, laranja e torresmo. Serve 1 pessoa.',
        image: 'https://images.unsplash.com/photo-1574343635105-4cf2ea136b8b?auto=format&fit=crop&w=600',
    },
    {
        id: 20,
        name: 'Pizza Margherita',
        price: 150.94,
        description: 'Pizza tradicional italiana com molho de tomate, mussarela de búfala, manjericão fresco e azeite. 8 fatias.',
        image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=600',
    },
    {
        id: 30,
        name: 'Combo Sushi',
        price: 150.54,
        description: 'Combinado com 30 peças incluindo sushis variados, sashimis de salmão e atum, e hot rolls.',
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600',
    },
    {
        id: 40,
        name: 'Picanha na Brasa',
        price: 150.90,
        description: 'Picanha grelhada no ponto com arroz, farofa, vinagrete e pão de alho. Serve 1 pessoa.',
        image: 'https://images.unsplash.com/photo-1594041680534-e8c8cdebd659?auto=format&fit=crop&w=600',
    },
    {
        id: 50,
        name: 'Pizza Pepperoni',
        price: 460.90,
        description: 'Pizza com generosa cobertura de pepperoni, molho de tomate e queijo mussarela. 8 fatias.',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600',
    },
    {
        id: 60,
        name: 'Temaki Salmão',
        price: 290.90,
        description: 'Temaki recheado com salmão fresco, cream cheese, cebolinha e arroz. Acompanha shoyu e wasabi.',
        image: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&w=600',
    }
];

export default function App() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const addToCart = useCartStore((state) => state.addToCart);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const router = useRouter();
    const goToInicio = useCallback(() => {
        router.replace("/(panel)/inicio");
    }, [router]);

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

    const handleAddToCart = () => {
        if (!selectedProduct) return;

        addToCart({
            id: selectedProduct.id,
            name: selectedProduct.name,
            price: selectedProduct.price.toString(),
            image: selectedProduct.image,
            quantity,
        });

        setAddedToCart(true);
        setTimeout(() => {
            setAddedToCart(false);
            setSelectedProduct(null);
            setQuantity(1);
        }, 1500);
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity style={styles.productCard} onPress={() => setSelectedProduct(item)}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>
                <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>{item.price.toFixed(2)} MTZ</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

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
                    <TouchableOpacity>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
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

            {/* Products */}
            <ScrollView style={styles.content}>
                <View style={styles.productsContainer}>
                    <FlatList
                        data={filteredProducts}
                        renderItem={renderProduct}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                    />
                </View>
            </ScrollView>

            {/* Product Details Modal */}
            <Modal visible={selectedProduct !== null} animationType="slide" transparent={true}>
                {selectedProduct && (
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalImageContainer}>
                                <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
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
                                <Text style={styles.modalPrice}>{selectedProduct.price.toFixed(2)} MTZ</Text>

                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity
                                        onPress={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        style={styles.quantityButton}
                                    >
                                        <Text style={styles.quantityText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.quantityValue}>{quantity}</Text>
                                    <TouchableOpacity
                                        onPress={() => setQuantity(prev => prev + 1)}
                                        style={styles.quantityButton}
                                    >
                                        <Text style={styles.quantityText}>+</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    style={[styles.addToCartButton, addedToCart && styles.addedToCartButton]}
                                    onPress={handleAddToCart}
                                >
                                    <Text style={styles.addToCartText}>
                                        {addedToCart ? 'Adicionado!' : 'Adicionar ao Carrinho'}
                                    </Text>
                                    {addedToCart && <Check size={20} color="#ffffff" style={styles.checkIcon} />}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </Modal>
        </SafeAreaView>
    );
}