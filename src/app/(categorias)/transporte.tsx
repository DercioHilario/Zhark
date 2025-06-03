import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, BackHandler } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons';
import { supabase } from '../../../constants/supabaseClient';
import styles from "../Style/transporte";

type TransportOption = {
    id: string;
    name: string;
    description: string;
    image_url: string;
    price: string;
};

export default function HomeScreen() {
    const [selectedOption, setSelectedOption] = useState<TransportOption | null>(null);
    const [transportOptions, setTransportOptions] = useState<TransportOption[]>([]);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const router = useRouter();

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
                router.replace('/(panel)/inicio');
                return true;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [])
    );

    useEffect(() => {
        const fetchTransportOptions = async () => {
            const { data, error } = await supabase.from('transportes').select('*');
            if (error) {
                console.error("Erro ao buscar transportes:", error);
            } else {
                setTransportOptions(data as TransportOption[]);
            }
        };
        fetchTransportOptions();
    }, []);

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
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }}>
                    {transportOptions.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.optionCard,
                                { width: '48%' },
                                selectedOption?.id === option.id && styles.selectedCard,
                            ]}
                            onPress={() => setSelectedOption(option)}
                        >
                            <Image source={{ uri: option.image_url }} style={styles.optionImage} />
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
                onPress={() =>
                    router.push({
                        pathname: '/(categorias)/popap/popapTransporte',
                        params: { preco: selectedOption?.price }
                    })
                }
            >
                <Text style={styles.bookButtonText}>
                    {selectedOption ? 'Fazer pedido agora' : 'Selecione o tipo de transporte'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
