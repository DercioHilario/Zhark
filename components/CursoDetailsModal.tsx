import { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { X as Close, Minus, Plus, Check, RotateCcw } from 'lucide-react-native';
import { useCartStore } from '../src/stores/cartStore';
import * as Font from 'expo-font';
import styles from "../src/app/Style/popapProdutos";
import { Video, ResizeMode } from 'expo-av';

const screenWidth = Dimensions.get('window').width;

interface Product {
    id: number;
    nome: string;
    preço: string;
    descrição: string;
    imagem: string;
    imagens: string[];
    duracao: string;
    Autor: string;
    Bônus: string;
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
    const [showReplay, setShowReplay] = useState<boolean[]>([]);
    const videoRefs = useRef<(Video | null)[]>([]);

    const addToCart = useCartStore((state) => state.addToCart);

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

    useEffect(() => {
        if (product) {
            setShowReplay(Array(product.imagens.length).fill(false));
        }
    }, [product]);

    const handleVideoPlayback = async (index: number) => {
        const video = videoRefs.current[index];
        if (video) {
            try {
                await video.replayAsync(); // inicia o vídeo automaticamente
            } catch (error) {
                console.error('Erro ao reproduzir vídeo:', error);
            }
        }
    };

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

                    {/* Imagens/Vídeos e Título */}
                    <View>
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onScroll={(e) => {
                                const offset = e.nativeEvent.contentOffset.x;
                                const index = Math.round(offset / screenWidth);
                                setCurrentImageIndex(index);
                                const media = product.imagens[index];
                                if (media.endsWith('.mp4') || media.includes('video')) {
                                    handleVideoPlayback(index);
                                }
                            }}
                            scrollEventThrottle={16}
                        >
                            {product.imagens.map((media, index) => {
                                const isVideo = media.endsWith('.mp4') || media.includes('video');

                                return isVideo ? (
                                    <View key={index} style={{ width: screenWidth, justifyContent: 'center', alignItems: 'center' }}>
                                        <Video
                                            ref={(ref) => (videoRefs.current[index] = ref)}
                                            source={{ uri: media }}
                                            rate={1.0}
                                            volume={1.0}
                                            isMuted={false}
                                            resizeMode={ResizeMode.COVER}
                                            useNativeControls
                                            style={styles.productImage}
                                            onPlaybackStatusUpdate={(status) => {
                                                if (status.isLoaded && status.didJustFinish) {
                                                    const updated = [...showReplay];
                                                    updated[index] = true;
                                                    setShowReplay(updated);
                                                }
                                            }}
                                        />
                                        {showReplay[index] && (
                                            <TouchableOpacity
                                                style={styles.replayButton}
                                                onPress={async () => {
                                                    const video = videoRefs.current[index];
                                                    if (video) {
                                                        await video.setPositionAsync(0);
                                                        await video.playAsync();
                                                        const updated = [...showReplay];
                                                        updated[index] = false;
                                                        setShowReplay(updated);
                                                    }
                                                }}
                                            >
                                                <RotateCcw size={24} color="#ffffff" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ) : (
                                    <Image key={index} source={{ uri: media }} style={styles.productImage} />
                                );
                            })}
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

                            <Text style={styles.sectionTitle}>Duração:</Text>
                            <Text style={styles.description}>{product.duracao}</Text>

                            <Text style={styles.sectionTitle}>Autor:</Text>
                            <Text style={styles.description}>{product.Autor}</Text>

                            <Text style={styles.sectionTitle}>Bônus:</Text>
                            <Text style={styles.description}>{product.Bônus}</Text>
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