import { useState, useEffect } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { X as Close, Minus, Plus, Check } from 'lucide-react-native';
import { useCartStore } from '../src/stores/cartStore';
import * as Font from 'expo-font';
import styles from "../src/app/Style/popapVestuario";

interface ProductColor {
    name: string;
    code: string;
    images: string[];
}

type ProductSize = {
    id: string;
    label: string;
}

interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    colors: ProductColor[];
    sizes: string[];
}

interface ProductDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    product: Product | null;
}

export default function ProductDetailsModal({ visible, onClose, product }: ProductDetailsModalProps) {
    const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
    const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [fontsLoaded, setFontsLoaded] = useState(false);

    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        if (product) {
            if (product.colors.length > 0) {
                setSelectedColor(product.colors[0]);
            }
            if (product.sizes.length > 0) {
                setSelectedSize(null); // usuário deve escolher
            }
        }
    }, [product]);

    useEffect(() => {
        const loadFonts = async () => {
            try {
                await Font.loadAsync({
                    Wellfleet: require("../assets/fonts/Wellfleet-Regular.ttf"),
                });
                setFontsLoaded(true);
            } catch (error) {
                console.error("Erro ao carregar fontes:", error);
            }
        };
        loadFonts();
    }, []);

    if (!product || !selectedColor) return null;

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            Alert.alert("Selecione um tamanho", "Por favor, selecione um tamanho antes de adicionar ao carrinho.");
            return;
        }

        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: selectedColor.images[0],
            quantity,
            selectedColor: {
                name: selectedColor.name,
                code: selectedColor.code,
            },
            selectedSize: {
                name: selectedSize.id,
                code: selectedSize.label,
            },
        });

        setAddedToCart(true);
        setTimeout(() => {
            setAddedToCart(false);
            onClose();
        }, 1500);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Close size={24} color="#000000" />
                    </TouchableOpacity>

                    <ScrollView showsVerticalScrollIndicator={false}>
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
                            {selectedColor.images.map((image, index) => (
                                <Image key={index} source={{ uri: image }} style={styles.productImage} />
                            ))}
                        </ScrollView>

                        <View style={styles.indicators}>
                            {selectedColor.images.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.indicator,
                                        index === currentImageIndex && styles.indicatorActive,
                                    ]}
                                />
                            ))}
                        </View>

                        <View style={styles.detailsContainer}>
                            <Text style={styles.productName}>{product.name}</Text>
                            <Text style={styles.productPrice}>{product.price} MTZ</Text>

                            <Text style={styles.sectionTitle}>Descrição:</Text>
                            <Text style={styles.description}>{product.description}</Text>

                            <Text style={styles.sectionTitle}>Cores disponíveis:</Text>
                            <View style={styles.colorContainer}>
                                {product.colors.map((color) => (
                                    <TouchableOpacity
                                        key={color.code}
                                        style={[
                                            styles.colorOption,
                                            { backgroundColor: color.code },
                                            selectedColor.code === color.code && styles.colorOptionSelected,
                                        ]}
                                        onPress={() => {
                                            setSelectedColor(color);
                                            setCurrentImageIndex(0);
                                        }}
                                    />
                                ))}
                            </View>

                            <Text style={styles.sectionTitle}>Tamanhos disponíveis:</Text>
                            <View style={styles.sizeContainer}>
                                {product.sizes.map((size) => (
                                    <TouchableOpacity
                                        key={size}
                                        style={[
                                            styles.sizeOption,
                                            selectedSize?.label === size && styles.sizeOptionSelected,
                                        ]}
                                        onPress={() => setSelectedSize({ id: size, label: size })}
                                    >
                                        <Text
                                            style={[
                                                styles.sizeText,
                                                selectedSize?.label === size && styles.sizeTextSelected,
                                            ]}
                                        >
                                            {size}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

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
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}