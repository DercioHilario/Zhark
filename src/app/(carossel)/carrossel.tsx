import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Image, Dimensions, ActivityIndicator } from 'react-native';
import Animated, { Layout, FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { supabase } from '../../../constants/supabaseClient';

const screenWidth = Dimensions.get('screen').width;
const ITEM_WIDTH = screenWidth * 0.9; // largura do item visível
const ITEM_MARGIN = 20; // margem horizontal em cada lado
const FULL_ITEM_WIDTH = ITEM_WIDTH + ITEM_MARGIN * 2; // largura + margens

const Carousel = () => {
    const [banners, setBanners] = useState<any[]>([]);
    const [activeBanner, setActiveBanner] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    // Buscar imagens do Supabase
    useEffect(() => {
        const fetchBanners = async () => {
            const { data, error } = await supabase.from('banners').select('*');
            if (error) {
                console.error('Erro ao buscar banners:', error);
            } else {
                setBanners(data || []);
            }
        };
        fetchBanners();
    }, []);

    // Scroll automático
    useEffect(() => {
        if (banners.length === 0) return;

        const interval = setInterval(() => {
            setActiveBanner((prev) => {
                const nextIndex = (prev + 1) % banners.length;
                if (flatListRef.current) {
                    flatListRef.current.scrollToIndex({
                        index: nextIndex,
                        animated: true,
                    });
                }
                return nextIndex;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [banners]);

    // Atualizar índice ativo ao rolar manualmente
    const onViewableItemsChanged = ({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveBanner(viewableItems[0].index);
        }
    };

    const viewabilityConfig = { itemVisiblePercentThreshold: 80 };

    if (banners.length === 0) {
        return (
            <View style={{
                width: ITEM_WIDTH,
                height: 160,
                borderRadius: 15,
                marginHorizontal: ITEM_MARGIN,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
            }}>
                <ActivityIndicator size="large" color="#00796B" />
            </View>
        );
    }

    return (
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <FlatList
                ref={flatListRef}
                data={banners}
                renderItem={({ item }) => (
                    <View
                        style={{
                            width: ITEM_WIDTH,
                            height: 180,
                            borderRadius: 15,
                            marginHorizontal: ITEM_MARGIN,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={{ uri: item.image_url }}
                            style={{
                                flex: 1,
                                width: '100%',
                                height: '100%',
                                borderRadius: 15,
                            }}
                            resizeMode="contain"
                        />
                    </View>
                )}
                horizontal
                pagingEnabled
                keyExtractor={(_, index) => String(index)}
                showsHorizontalScrollIndicator={false}
                viewabilityConfig={viewabilityConfig}
                onViewableItemsChanged={onViewableItemsChanged}
                getItemLayout={(_, index) => ({
                    length: FULL_ITEM_WIDTH,
                    offset: FULL_ITEM_WIDTH * index,
                    index,
                })}
            />

            {/* Indicadores de página */}
            <FlatList
                data={banners}
                renderItem={({ index }) => (
                    <Animated.View
                        layout={Layout}
                        entering={FadeInLeft.springify()}
                        exiting={FadeOutRight.springify()}
                        style={{
                            width: activeBanner === index ? 12 : 6,
                            height: 6,
                            borderRadius: 4,
                            backgroundColor: activeBanner === index ? 'black' : 'gray',
                            marginHorizontal: 2,
                            marginTop: 5,
                        }}
                    />
                )}
                scrollEnabled={false}
                horizontal
                keyExtractor={(_, index) => String(index)}
            />
        </View>
    );
};

export default Carousel;
