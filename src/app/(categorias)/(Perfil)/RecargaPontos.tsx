import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform, BackHandler, } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../../constants/supabaseClient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CustomAlert } from '../../../../constants/CustomAlert';

const PointsWallet = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [meticais, setMeticais] = useState('');
    const [currentPoints, setCurrentPoints] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertOnConfirm, setAlertOnConfirm] = useState<(() => void) | undefined>(undefined);
    const [alertShowCancel, setAlertShowCancel] = useState(false);

    const showCustomAlert = (title: string, message: string, onConfirm?: () => void, showCancel = false) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertOnConfirm(() => onConfirm);
        setAlertShowCancel(showCancel);
        setAlertVisible(true);
    };


    const conversionRate = 5;

    useEffect(() => {
        const loadFonts = async () => {
            try {
                await Font.loadAsync({
                    'Wellfleet': require('../../../../assets/fonts/Wellfleet-Regular.ttf'),
                });
                setFontsLoaded(true);
            } catch (error) {
                console.error('Erro ao carregar fontes:', error);
            }
        };
        loadFonts();
    }, []);

    // Lida com o botão "voltar" físico do celular
    useEffect(() => {
        const backAction = () => {
            router.back(); // Fecha a tela
            return true;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, []);

    // Obtém usuário autenticado e pontos
    useEffect(() => {
        const getUserAndPoints = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                showCustomAlert('Erro', 'Usuário não autenticado.');
                setLoading(false);
                return;
            }

            setUserId(user.id);
            fetchUserPoints(user.id);
        };

        getUserAndPoints();
    }, []);

    const fetchUserPoints = async (id: string) => {
        const { data, error } = await supabase
            .from('users')
            .select('points')
            .eq('id', id)
            .single();

        if (error) {
            console.log('Erro ao buscar pontos:', error);
            showCustomAlert('Erro', 'Não foi possível buscar seus pontos.');
        } else {
            setCurrentPoints(data?.points || 0);
        }
        setLoading(false);
    };

    const handleRecharge = async () => {
        const mt = parseFloat(meticais);
        if (!mt || mt <= 5) return showCustomAlert('Erro', 'Digite um valor válido.');

        const addedPoints = Math.floor(mt / conversionRate);
        const newPoints = currentPoints + addedPoints;

        if (!userId) return showCustomAlert('Erro', 'Usuário não identificado.');

        const { error } = await supabase
            .from('users')
            .update({ points: newPoints })
            .eq('id', userId);

        if (error) {
            console.error('Erro ao atualizar pontos:', error);
            showCustomAlert('Erro', 'Não foi possível atualizar seus pontos.');
        } else {
            setCurrentPoints(newPoints);
            setMeticais('');
            showCustomAlert('Sucesso', `Você ganhou ${addedPoints} pontos.`);
        }
    };

    if (!fontsLoaded || loading) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar style="auto" />
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar style="auto" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Carteira de Pontos</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <View style={styles.saldo}>
                    <Text style={styles.ZcoinsText}>Seu Saldo:</Text>
                    <Text style={styles.pointsText}>{currentPoints} Z-coins</Text>
                </View>

                <TextInput
                    placeholder="Valor em Meticais (MT)"
                    value={meticais}
                    onChangeText={setMeticais}
                    keyboardType="numeric"
                    style={styles.input}
                    placeholderTextColor="#aaa"
                />

                <Text style={styles.convertedText}>
                    Você receberá {Math.floor(Number(meticais || 0) / conversionRate)} pontos
                </Text>

                <TouchableOpacity
                    onPress={handleRecharge}
                    style={[
                        styles.rechargeButton,
                        (!parseFloat(meticais) || parseFloat(meticais) < 5) && styles.disabledButton,
                    ]}
                    disabled={!parseFloat(meticais) || parseFloat(meticais) < 5}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Adicionar Pontos</Text>
                </TouchableOpacity>
            </View>
            {/* Custom Alert */}
            <CustomAlert
                visible={alertVisible}
                title={alertTitle}
                message={alertMessage}
                showCancel={alertShowCancel}
                onCancel={() => setAlertVisible(false)}
                onConfirm={() => {
                    setAlertVisible(false);
                    alertOnConfirm && alertOnConfirm();
                }}
            />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 10,
    },
    header: {
        paddingTop: 10,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 5,
    },
    title: {
        fontFamily: 'Wellfleet',
        fontSize: 22,
        color: '#222',
    },
    content: {
        flex: 1,
        gap: 15,
        marginTop: 35,
    },
    pointsText: {
        fontSize: 18,
        color: 'blue',
        fontFamily: 'Wellfleet',
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        fontFamily: 'Wellfleet',
        color: '#333',
    },
    convertedText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        fontFamily: 'Wellfleet',
    },
    rechargeButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        paddingVertical: 16,
    },
    disabledButton: {
        backgroundColor: '#BDBDBD',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Wellfleet',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontFamily: 'Wellfleet',
        fontSize: 16,
        color: '#555',
    },
    ZcoinsText: {
        fontSize: 18,
        color: '#222',
        fontFamily: 'Wellfleet',
        textAlign: 'center',
    },
    saldo: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default PointsWallet;
