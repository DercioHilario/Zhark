import { View, Text, Image, ScrollView, TouchableOpacity, Alert } from "react-native";
import styles from "../Style/StyleInicio";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { router } from "expo-router";
import Carousel from '../(carossel)/carrossel';
import { MaterialCommunityIcons } from "@expo/vector-icons";


export default function Profile() {
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

    const handleCategoryPress = (category: string) => {

        if (category === "Comida") {
            router.replace('/(categorias)/comida');
        } if (category === "Serviços") {
            router.replace('/(categorias)/servicos');
        }
        if (category === "Transporte") {
            router.replace('/(categorias)/transporte');
        }
        if (category === "Educação") {
            router.replace('/(categorias)/educacao');
        }
        if (category === "Vestuário") {
            router.replace('/(categorias)/vestuario');
        }

    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Zhark</Text>

                </View>
            </View>
            <View style={styles.carousel}>
                <Carousel />
            </View>
            <Text style={styles.categoria}>Categoria:</Text>

            <ScrollView contentContainerStyle={styles.categoriesGrid}>
                {[
                    { name: "Comida", img: require('../../../assets/img/comida.png') },
                    { name: "Serviços", img: require('../../../assets/img/configuracao.png') },
                    { name: "Transporte", img: require('../../../assets/img/transporte.png') },
                    { name: "Eletrônicos", img: require('../../../assets/img/aparelhos.png') },
                    { name: "E-book", img: require('../../../assets/img/ebook.png') },
                    { name: "Educação", img: require('../../../assets/img/cerebro.png') },
                    { name: "Fans", img: require('../../../assets/img/sexy.png') },
                    { name: "Curso", img: require('../../../assets/img/bolsa-de-estudo.png') },
                    { name: "Vestuário", img: require('../../../assets/img/cabide.png') },
                ].map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => handleCategoryPress(item.name)} style={styles.categoryItem}>

                        <View style={styles.imgContainer}>
                            <Image source={item.img} style={styles.img} />
                        </View>
                        <Text style={styles.categoryText}>{item.name}</Text>

                    </TouchableOpacity>
                ))}

            </ScrollView>
        </View>
    );
}
