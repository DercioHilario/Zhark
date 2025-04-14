import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import styles from "../Style/transporte";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons'

type TransportOption = {
    id: string;
    name: string;
    description: string;
    image: any;
    price: string;
};

const TRANSPORT_OPTIONS: TransportOption[] = [
    {
        id: 'basic',
        name: 'Básico',
        description: 'Viagens acessíveis para o dia a dia',
        image: require('../../../assets/img/carro-suv.png'),
        price: '1x',
    },
    {
        id: 'moto',
        name: 'Moto',
        description: 'Viagens rápidas pelo trânsito',
        image: require('../../../assets/img/motocicleta.png'),
        price: '0.8x',
    },
    {
        id: 'vip',
        name: 'VIP',
        description: 'Veículos de luxo com serviço premium',
        image: require('../../../assets/img/carro-esporte.png'),
        price: '2x',
    },
    {
        id: 'taxi',
        name: 'Táxi',
        description: 'Serviço tradicional de táxi',
        image: require('../../../assets/img/carro-suv.png'),
        price: '1.2x',
    },
];

export default function HomeScreen() {
    const [selectedOption, setSelectedOption] = useState<TransportOption | null>(null);

    const router = useRouter();
    const { width } = Dimensions.get('window');

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

    // Memoriza a função para evitar recriação a cada renderização
    const goToInicio = useCallback(() => {
        router.replace("/(panel)/inicio");
    }, [router]);

    if (!fontsLoaded) {
        return <Text>Carregando fontes...</Text>;
    }


    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View>
                <View style={styles.header}>
                    <TouchableOpacity onPress={goToInicio}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Transporte</Text>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </View>
                <View style={styles.searchContainer}>
                    <View style={styles.search}>
                        <TextInput
                            placeholder="O que você quer??"
                            placeholderTextColor="#666"
                            style={styles.searchInput}
                        />
                        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
                    </View>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.optionsContainer}
            >
                <View style={{
                    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10
                }}>
                    {TRANSPORT_OPTIONS.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.optionCard,
                                { width: '48%' }, // Ajuste para caber 2 por linha
                                selectedOption?.id === option.id && styles.selectedCard,
                            ]}
                            onPress={() => setSelectedOption(option)}
                        >
                            <Image source={option.image} style={styles.optionImage} />
                            <View style={styles.optionInfo}>
                                <Text style={styles.optionName}>{option.name}</Text>
                                <Text style={styles.optionDescription}>{option.description}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>


            <TouchableOpacity
                style={[
                    styles.bookButton,
                    !selectedOption && styles.bookButtonDisabled,
                ]}
                disabled={!selectedOption}
                onPress={() => router.push('/(categorias)/popap/popapTransporte')}>
                <Text style={styles.bookButtonText}>
                    {selectedOption ? 'Fazer pedito agora' : 'Selecione o tipo de transporte'}
                </Text>
            </TouchableOpacity>
        </View >
    );
}
