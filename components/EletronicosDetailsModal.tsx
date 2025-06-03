import { useState, useEffect } from 'react';;
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { X as Close, Minus, Plus, Check } from 'lucide-react-native';
import { useCartStore } from '../src/stores/cartStore';
import * as Font from 'expo-font';
import styles from "../src/app/Style/popapProdutos";

interface Product {
    id: number;
    nome: string;
    preço: string;
    descrição: string;
    cor: string | string[];
    imagem: string;
    imagens: string[];
    Garatia: string;
    Características: string;
    categoria: string;
    tempo_entrega_minutos: number | null;
}

interface ProductDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    product: Product | null;
}

export default function ProductDetailsModal({ visible, onClose, product }: ProductDetailsModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');

    const addToCart = useCartStore((state) => state.addToCart);

    // Mapeamento de cores
    const colorMap: { [key: string]: string } = {
        Branco: '#FFFFFF',
        Preto: '#000000',
        Vermelho: '#FF0000',
        Azul: '#0000FF',
        Verde: '#00FF00',
        Amarelo: '#FFFF00',
        Laranja: '#FFA500',
        Rosa: '#FFC0CB',
        Roxo: '#800080',
        Cinza: '#808080',
    };

    useEffect(() => {
        if (product) {
            setQuantity(1);
            setCurrentImageIndex(0);
            setSelectedColor('');
            setSelectedSize('');
        }
    }, [product]);

    useEffect(() => {
        const loadFonts = async () => {
            try {
                await Font.loadAsync({
                    Wellfleet: require('../assets/fonts/Wellfleet-Regular.ttf'),
                });
                setFontsLoaded(true);
            } catch (error) {
                console.error('Erro ao carregar fontes:', error);
            }
        };
        loadFonts();
    }, []);

    useEffect(() => {
        if (visible) {
            setQuantity(1);
        }
    }, [visible, product]);

    if (!product) return null;

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {

        if (!selectedColor) {
            alert('Por favor, escolha uma cor antes de adicionar ao carrinho!');
            return;
        }
        const tempoEntrega = typeof product.tempo_entrega_minutos === 'number'
            ? product.tempo_entrega_minutos
            : 0;

        addToCart({
            id: product.id,
            nome: product.nome,
            preço: product.preço,
            imagem: product.imagens[0],
            descrição: product.descrição,
            imagens: product.imagens,
            tempo_entrega_minutos: tempoEntrega,
            quantity,
        });

        setAddedToCart(true);
        setTimeout(() => {
            setAddedToCart(false);
            onClose();
        }, 1500);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Close size={24} color="#000000" />
                    </TouchableOpacity>

                    {/* Imagens e Título */}
                    <View>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={(e) => {
                                const offset = e.nativeEvent.contentOffset.x;
                                setCurrentImageIndex(Math.round(offset / 400));
                            }}
                            scrollEventThrottle={16}
                        >
                            {product.imagens.map((image, index) => (
                                <Image key={index} source={{ uri: image }} style={styles.productImage} />
                            ))}
                        </ScrollView>

                        <View style={styles.indicators}>
                            {product.imagens.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.indicator,
                                        index === currentImageIndex && styles.indicatorActive,
                                    ]}
                                />
                            ))}
                        </View>

                        <Text style={styles.productName}>{product.nome}</Text>
                        <Text style={styles.productPrice}>{product.preço} Z-coins</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 50 }}>
                            <Text style={styles.sectionTitle}>Descrição:</Text>
                            <Text style={styles.description}>{product.descrição}</Text>
                            <Text style={styles.sectionTitle}>Garantia:</Text>
                            <Text style={styles.description}>{product.Garatia}</Text>

                            <Text style={styles.sectionTitle}>Características:</Text>
                            <Text style={styles.description}>{product.Características}</Text>

                            {/* Cor com círculos visuais */}
                            <Text style={styles.sectionTitle}>Cor:</Text>
                            <View style={styles.optionsContainer}>
                                {(Array.isArray(product.cor) ? product.cor : [product.cor]).map((color, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.colorButton,
                                            selectedColor === color && styles.optionSelected,
                                        ]}
                                        onPress={() => setSelectedColor(color)}
                                    >
                                        <View
                                            style={[
                                                styles.colorCircle,
                                                { backgroundColor: colorMap[color] || '#CCC' },
                                            ]}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Footer Fixo */}
                    <View style={styles.footerFixed}>
                        <Text style={styles.sectionTitle}>Quantidade:</Text>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity style={styles.quantityButton} onPress={decreaseQuantity}>
                                <Minus size={20} color="#000000" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity style={styles.quantityButton} onPress={increaseQuantity}>
                                <Plus size={20} color="#000000" />
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
        </Modal>
    );
}
