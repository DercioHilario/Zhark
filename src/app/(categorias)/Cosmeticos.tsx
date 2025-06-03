import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, TextInput, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback, useEffect } from 'react';
import ProductDetailsModal from '../../../components/CosmeticoDetailsModal';
import { Search } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useFocusEffect } from 'expo-router';
import * as Font from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "../Style/comida";
import { supabase } from '../../../constants/supabaseClient';

interface Product {
    id: number;
    nome: string;
    preço: string;
    descrição: string;
    imagem: string;
    imagens: string[];
    modo_uso?: string;
    beneficios?: string;
    categoria: string;
    tempo_entrega_minutos: number | null;
}

export default function HomeScreen() {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);

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

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                // Redireciona para a tela anterior
                router.replace('/(panel)/inicio'); // ou router.push() se preferir empilhar
                return true; // evita que o app feche
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [])
    );

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('cosmeticos_produtos')
                .select('*');
            if (error) {
                console.error('Erro ao buscar produtos:', error);
            } else if (Array.isArray(data)) {
                const validProducts = data.filter((p) => typeof p.nome === 'string');
                const mappedProducts = validProducts.map((item) => ({
                    id: item.id,
                    nome: item.nome,
                    preço: item.preço,
                    descrição: item.descrição,
                    imagem: item.imagem,
                    imagens: item.imagens,
                    modo_uso: item.modo_uso,
                    beneficios: item.beneficios,
                    categoria: item.categoria,
                    tempo_entrega_minutos: typeof item.tempo_entrega_minutos === 'number' ? item.tempo_entrega_minutos : 0,
                }));
                setProducts(mappedProducts);

                // Extraindo categorias únicas
                const uniqueCategories = [...new Set(mappedProducts.map(p => p.categoria).filter(Boolean))];
                setCategories(uniqueCategories);
            }
        } catch (err) {
            console.error('Erro ao carregar os produtos:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />

            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={goToHome}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Cosmeticos</Text>
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
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 10 }}>
                    <TouchableOpacity
                        onPress={() => setSelectedCategory(null)}
                        style={[styles.categoryButton, selectedCategory === null && styles.categoryButtonActive]}
                    >
                        <Text style={[styles.categoryText, selectedCategory === null && styles.categoryTextActive]}>
                            Todos
                        </Text>
                    </TouchableOpacity>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setSelectedCategory(cat)}
                            style={[
                                styles.categoryButton,
                                selectedCategory === cat && styles.categoryButtonActive
                            ]}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedCategory === cat && styles.categoryTextActive
                                ]}
                            >
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <Text style={styles.sectionTitle}>Produtos:</Text>
            </View>

            {/* Lista de produtos */}
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.featuredSection}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={styles.productsContainer}
                        contentContainerStyle={{ paddingVertical: 10 }}
                    >
                        {loading ? (
                            <View style={styles.productsWrapper}>
                                {[...Array(6)].map((_, index) => (
                                    <View key={index} style={styles.skeletonCard}>
                                        <View style={styles.skeletonImage} />
                                        <View style={styles.skeletonText} />
                                        <View style={styles.skeletonTextShort} />
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <View style={styles.productsWrapper}>
                                {products.filter(product => {
                                    const matchesSearch = searchTerm.trim() === '' || product.nome.toLowerCase().includes(searchTerm.toLowerCase());
                                    const matchesCategory = selectedCategory === null || product.categoria === selectedCategory;
                                    return matchesSearch && matchesCategory;
                                }).length === 0 ? (
                                    <View style={styles.noResultsContainer}>
                                        <Text style={styles.noResultsText}>
                                            {searchTerm.trim() !== ''
                                                ? `O produto "${searchTerm}" não existe!`
                                                : 'Nenhum produto encontrado.'}
                                        </Text>
                                    </View>
                                ) : (
                                    products
                                        .filter(product => {
                                            const matchesSearch = searchTerm.trim() === '' || product.nome.toLowerCase().includes(searchTerm.toLowerCase());
                                            const matchesCategory = selectedCategory === null || product.categoria === selectedCategory;
                                            return matchesSearch && matchesCategory;
                                        })
                                        .map((product) => (

                                            <TouchableOpacity
                                                key={product.id}
                                                style={styles.productCard}
                                                onPress={() => openProductDetails(product)}
                                            >
                                                <Image
                                                    source={{ uri: product.imagem }}
                                                    style={styles.productImage}
                                                />
                                                <View style={styles.productInfo}>
                                                    <Text
                                                        style={styles.productName}
                                                        numberOfLines={2}
                                                        ellipsizeMode="tail"
                                                    >
                                                        {product.nome}
                                                    </Text>
                                                    <Text style={styles.productPrice}>{product.preço} Z-coins</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))
                                )}
                            </View>
                        )}

                    </ScrollView>
                </View>
            </ScrollView>

            {/* Modal de detalhes */}
            <ProductDetailsModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                product={selectedProduct}
            />
        </SafeAreaView>
    );
}
