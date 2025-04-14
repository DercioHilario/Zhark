import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { X as Close, Minus, Plus, Check } from 'lucide-react-native';
import { useCartStore } from '../src/stores/cartStore';

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
    colors: ProductColor[];
}

interface ProductDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    product: Product | null;
}

export default function ProductDetailsModal({ visible, onClose, product }: ProductDetailsModalProps) {
    const [selectedColor, setSelectedColor] = React.useState<ProductColor | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
    const [quantity, setQuantity] = React.useState(1);
    const [addedToCart, setAddedToCart] = React.useState(false);
    const addToCart = useCartStore((state) => state.addToCart);

    React.useEffect(() => {
        if (product && product.colors.length > 0) {
            setSelectedColor(product.colors[0]);
        }
    }, [product]);

    if (!product || !selectedColor) return null;

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
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
        });
        setAddedToCart(true);
        setTimeout(() => {
            setAddedToCart(false);
            onClose();
        }, 1500);
    };

    const benefits = [
        'Material de alta qualidade',
        'Conforto durante todo o dia',
        'Durabilidade garantida',
        'Design moderno e versátil',
        'Fácil de combinar',
    ];

    const features = [
        'Tecido respirável',
        'Costuras reforçadas',
        'Acabamento premium',
        'Lavagem fácil',
        'Não desbota',
    ];

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
                                setCurrentImageIndex(Math.round(offset / styles.productImage.width));
                            }}
                            scrollEventThrottle={16}>
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
                            <Text style={styles.productPrice}>{product.price}</Text>

                            <Text style={styles.sectionTitle}>Descrição</Text>
                            <Text style={styles.description}>{product.description}</Text>

                            <Text style={styles.sectionTitle}>Benefícios</Text>
                            {benefits.map((benefit, index) => (
                                <View key={index} style={styles.listItem}>
                                    <Check size={20} color="#00C853" />
                                    <Text style={styles.listText}>{benefit}</Text>
                                </View>
                            ))}

                            <Text style={styles.sectionTitle}>Características</Text>
                            {features.map((feature, index) => (
                                <View key={index} style={styles.listItem}>
                                    <Check size={20} color="#2196F3" />
                                    <Text style={styles.listText}>{feature}</Text>
                                </View>
                            ))}

                            <Text style={styles.sectionTitle}>Cores disponíveis</Text>
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

                            <Text style={styles.sectionTitle}>Quantidade</Text>
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

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#ffffff',
        marginTop: 60,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        zIndex: 1,
        backgroundColor: '#ffffff',
        padding: 8,
        borderRadius: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productImage: {
        width: 400,
        height: 400,
        resizeMode: 'cover',
    },
    indicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 16,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#cccccc',
        marginHorizontal: 4,
    },
    indicatorActive: {
        backgroundColor: '#000000',
    },
    detailsContainer: {
        padding: 20,
    },
    productName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
    },
    productPrice: {
        fontSize: 20,
        color: '#666666',
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000000',
        marginTop: 24,
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#666666',
        lineHeight: 24,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    listText: {
        fontSize: 16,
        color: '#333333',
        marginLeft: 8,
    },
    colorContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    colorOption: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    colorOptionSelected: {
        borderWidth: 2,
        borderColor: '#000000',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    quantityButton: {
        backgroundColor: '#f5f5f5',
        padding: 8,
        borderRadius: 8,
    },
    quantityText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000000',
    },
    addToCartButton: {
        backgroundColor: '#000000',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 32,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    addedToCartButton: {
        backgroundColor: '#00C853',
    },
    addToCartText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    checkIcon: {
        marginLeft: 8,
    },
});