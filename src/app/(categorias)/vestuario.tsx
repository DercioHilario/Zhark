import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import ProductDetailsModal from '../../../components/ProductDetailsModal';
import { ArrowLeft } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

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
}

const CATEGORIES = [
    'Novidades',
    'Camisetas',
    'Calças',
    'Vestidos',
    'Sapatos',
    'Acessórios',
];

const FEATURED_PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'Camiseta Básica',
        price: 'R$ 79,90',
        description: 'Camiseta básica em algodão premium com acabamento suave e confortável. Perfeita para o dia a dia, possui corte regular e gola careca reforçada. O tecido de alta qualidade garante durabilidade e mantém o formato mesmo após várias lavagens.',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format',
        colors: [
            {
                name: 'Branco',
                code: '#FFFFFF',
                images: [
                    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format',
                    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&auto=format',
                    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format',
                ],
            },
            {
                name: 'Preto',
                code: '#000000',
                images: [
                    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format',
                    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format',
                    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&auto=format',
                ],
            },
            {
                name: 'Cinza',
                code: '#888888',
                images: [
                    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&auto=format',
                    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&auto=format',
                    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&auto=format',
                ],
            },
        ],
    },
    {
        id: 2,
        name: 'Calça Jeans',
        price: 'R$ 159,90',
        description: 'Calça jeans de alta qualidade com lavagem moderna e acabamento premium. O corte slim favorece diversos tipos de corpo, enquanto o denim elástico garante conforto durante todo o dia. Possui cinco bolsos e detalhes em costura reforçada.',
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format',
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
        price: 'R$ 199,90',
        description: 'Vestido floral confeccionado em tecido leve e fluido, perfeito para ocasiões especiais ou uso casual. O padrão floral exclusivo combina cores vibrantes que trazem vida ao look. Possui forro interno e fechamento em zíper invisível nas costas.',
        image: 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=500&auto=format',
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

    const openProductDetails = (product: Product) => {
        setSelectedProduct(product);
        setModalVisible(true);
    };

    const router = useRouter();

    const goToHome = useCallback(() => {
        router.replace('/(panel)/inicio');
    }, [router]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.header}>
                <TouchableOpacity onPress={goToHome} style={styles.backButton}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}> Vestuario </Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={styles.featuredSection}>
                    <Text style={styles.sectionTitle}>Produtos:</Text>
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
                                        <Text style={styles.productPrice}>{product.price}</Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        backgroundColor: '#F3F4F6',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: "Wellfleet",
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000000',
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666666',
        marginTop: 4,
    },

    featuredSection: {
        padding: 5,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#000000',
    },

    backButton: {
        padding: 8,
    },
    productsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    productsContainer: {
        flex: 1,
        paddingHorizontal: 5,
    },

    productCard: {
        width: '48%', // dois por linha com espaço entre
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        marginBottom: 10,
        padding: 5,
    },
    productImage: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        resizeMode: 'contain',
    },
    productInfo: {
        marginTop: 8,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 14,
        color: '#888',
    },
});