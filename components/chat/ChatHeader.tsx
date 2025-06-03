import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import * as Font from 'expo-font';


export default function ChatHeader() {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        const loadFonts = async () => {
            try {
                await Font.loadAsync({
                    Wellfleet: require("../../assets/fonts/Wellfleet-Regular.ttf"),
                });
                setFontsLoaded(true);
            } catch (error) {
                console.error("Erro ao carregar fontes:", error);
            }
        };
        loadFonts();
    }, []);

    return (
        <View style={styles.header}>
            <Text style={styles.agentName}>Suporte Zhark</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        backgroundColor: '#000000',
        padding: 10,
    },
    agentName: {
        fontSize: 25,
        fontFamily: "Wellfleet",
        color: '#ffffff',
    },
});
