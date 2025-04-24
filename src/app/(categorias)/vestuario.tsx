import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback, useEffect } from 'react';
import ProductDetailsModal from '../../../components/ProductDetailsModal';
import { Search } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import * as Font from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../Style/vestuario";

interface ProductColor {
    name: string;
    code: string;
    images: string[];
}

interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    image: string;
    colors: ProductColor[];
    sizes: string[];
}



const FEATURED_PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'Camiseta Básica',
        price: '79,90',
        description: 'Camiseta básica em algodão premium com acabamento suave e confortável. Perfeita para o dia a dia, possui corte regular e gola careca reforçada. O tecido de alta qualidade garante durabilidade e mantém o formato mesmo após várias lavagens.',
        image: require("../../../assets/img/designer-de-web.png"),
        sizes: ['P', 'M', 'G', 'GG'],
        colors: [
            {
                name: 'Branco',
                code: '#FFFFFF',
                images: [
                    '../../../assets/img/produto/camisaBranca.png',
                    '../../../assets/img/produto/camisaBranca.png',
                    '../../../assets/img/produto/camisaBranca.png',
                ],
            },
            {
                name: 'Preto',
                code: '#000000',
                images: [
                    '../../../assets/img/produto/camisaBranca.png',
                    '../../../assets/img/produto/camisaBranca.png',
                    '../../../assets/img/produto/camisaBranca.png',
                ],
            },
            {
                name: 'Cinza',
                code: '#888888',
                images: [
                    '../../../assets/img/produto/camisaBranca.png',
                    '../../../assets/img/produto/camisaBranca.png',
                    '../../../assets/img/produto/camisaBranca.png',
                ],
            },
        ],
    },
    {
        id: 2,
        name: 'Calça Jeans',
        price: '159,90',
        description: 'Calça jeans de alta qualidade com lavagem moderna e acabamento premium. O corte slim favorece diversos tipos de corpo, enquanto o denim elástico garante conforto durante todo o dia. Possui cinco bolsos e detalhes em costura reforçada.',
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format',
        sizes: ['36', '38', '40', '42', '44'],
        colors: [
            {
                name: 'Azul Claro',
                code: '#6BA4B8',
                images: [
                    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format',
                    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format',
                    'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=500&auto=format',
                ],
            },
            {
                name: 'Azul Escuro',
                code: '#1B365C',
                images: [
                    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format',
                    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format',
                    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&auto=format',
                ],
            },
        ],
    },
    {
        id: 3,
        name: 'Vestido Floral',
        price: '199,90',
        description: 'Vestido floral confeccionado em tecido leve e fluido, perfeito para ocasiões especiais ou uso casual. O padrão floral exclusivo combina cores vibrantes que trazem vida ao look. Possui forro interno e fechamento em zíper invisível nas costas.',
        image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format',
        sizes: ['P', 'M', 'G'],
        colors: [
            {
                name: 'Rosa',
                code: '#FFB6C1',
                images: [
                    'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format',
                    'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format',
                    'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format',
                ],
            },
            {
                name: 'Azul',
                code: '#87CEEB',
                images: [
                    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format',
                    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format',
                    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format',
                ],
            },
        ],
    },
];

export default function HomeScreen() {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const openProductDetails = (product: Product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const router = useRouter();

    const goToHome = useCallback(() => {
        router.replace('/(panel)/inicio');
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

    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={goToHome}>
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

            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.featuredSection}>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={styles.productsContainer}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    >
                        <View style={styles.productsWrapper}>
                            {FEATURED_PRODUCTS.map((product) => (
                                <TouchableOpacity
                                    key={product.id}
                                    style={styles.productCard}
                                    onPress={() => openProductDetails(product)}
                                >
                                    <Image
                                        source={{ uri: product.image }}
                                        style={styles.productImage}
                                    />
                                    <View style={styles.productInfo}>
                                        <Text style={styles.productName}>{product.name}</Text>
                                        <Text style={styles.productPrice}>{product.price} MTZ</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>

            <ProductDetailsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                product={selectedProduct}
            />
        </SafeAreaView>
    );
}
