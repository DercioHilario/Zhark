import { useState, useEffect, useRef } from 'react';
import { View, FlatList, Image, Dimensions } from 'react-native';
import Animated, { Layout, FadeInLeft, FadeOutRight } from 'react-native-reanimated';

const DATA = [
    { image: require('../../../assets/img/propaganda.png') },
    { image: require('../../../assets/img/propaganda2.png') },
    { image: require('../../../assets/img/propaganda3.png') },
];

const Carousel = () => {
    const [activeBanner, setActiveBanner] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const screenWidth = Dimensions.get('screen').width;

    const onViewableItemsChanged = ({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveBanner(viewableItems[0].index);
        }
    };

    const viewabilityConfig = { itemVisiblePercentThreshold: 80 };

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveBanner((prev) => {
                const nextIndex = (prev + 1) % DATA.length;
                flatListRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });
                return nextIndex;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <FlatList
                ref={flatListRef}
                data={DATA}
                renderItem={({ item }) => (
                    <View style={{
                        width: screenWidth * 0.9,
                        height: 180,
                        borderRadius: 15,
                        marginHorizontal: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Image
                            source={item.image}
                            style={{
                                flex: 1,
                                width: "100%",
                                height: "100%",
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            resizeMode='contain'
                        />
                    </View>
                )}
                horizontal
                pagingEnabled
                keyExtractor={(_, index) => String(index)}
                showsHorizontalScrollIndicator={false}
                viewabilityConfig={viewabilityConfig}
                onViewableItemsChanged={onViewableItemsChanged}
            />
            <FlatList
                data={DATA}
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

