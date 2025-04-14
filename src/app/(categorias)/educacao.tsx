import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Modal, ActivityIndicator, ScrollView, Platform, Vibration } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useFonts, Wellfleet_400Regular } from '@expo-google-fonts/wellfleet';
import { subjects } from '../../../constants/subjects';
import styles from "../Style/educacao";
import AntDesign from '@expo/vector-icons/AntDesign';


export default function StudyGuide() {
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [detalhes, setDetalhes] = useState('');
    const [pages, setPages] = useState('1');
    const [classType, setClassType] = useState('0');
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const limiteCaracteres = 200;
    const [alertaMostrado, setAlertaMostrado] = useState(false);

    useEffect(() => {
        if (detalhes.length === limiteCaracteres && !alertaMostrado) {
            Alert.alert('Limite atingido', `Você atingiu o limite de ${limiteCaracteres} caracteres.`);
            Vibration.vibrate(200); // vibra por 200ms
            setAlertaMostrado(true);
        }

        if (detalhes.length < limiteCaracteres && alertaMostrado) {
            setAlertaMostrado(false); // reseta o alerta para futuros avisos
        }
    }, [detalhes]);

    const [fontsLoaded] = useFonts({
        Wellfleet: Wellfleet_400Regular,
    });

    const router = useRouter();

    const updateTotal = useCallback((selectedClassType: string, selectedPages: string) => {
        const numPages = parseInt(selectedPages, 10) || 0;
        if (selectedClassType === '0') {
            setTotalPrice(0);
        } else {
            const pricePerPage = selectedClassType === 'offline' ? 10 : 5;
            setTotalPrice(numPages * pricePerPage);
        }
    }, []);

    useEffect(() => {
        updateTotal(classType, pages);
    }, [classType, pages, updateTotal]);

    const isFormValid = subject && topic && parseInt(pages, 10) > 0 && classType !== '0';

    const handleSubmit = async () => {
        if (!isFormValid) {
            Alert.alert('Error', 'Please fill in all fields correctly.');
            return;
        }

        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setShowConfirmation(true);
        } catch (error) {
            Alert.alert('Error', 'An error occurred while processing your request.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalize = () => {
        setShowConfirmation(false);
        router.replace('/(panel)/inicio');
    };

    const goToHome = useCallback(() => {
        router.replace('/(panel)/inicio');
    }, [router]);

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.header}>
                <TouchableOpacity onPress={goToHome} style={styles.backButton}>
                    <ArrowLeft size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}> Guia de Estudo </Text>
                <View style={{ width: 24 }} />
            </View>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.card}>
                    <Text style={styles.title}>Solicitar Guia de Estudo</Text>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Matéria:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={subject}
                                onValueChange={setSubject}
                                style={[styles.picker, Platform.OS === 'web' && styles.webPicker]}
                            >
                                {subjects.map((item) => (
                                    <Picker.Item
                                        key={item.value}
                                        label={item.label}
                                        value={item.value}
                                    />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Tópico Específico:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Álgebra, Gramática..."
                            value={topic}
                            onChangeText={setTopic}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Número de Páginas:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter number of pages"
                            keyboardType="numeric"
                            value={pages}
                            onChangeText={setPages}
                            placeholderTextColor="#999"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Formato de Entrega:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={classType}
                                onValueChange={setClassType}
                                style={[styles.picker, Platform.OS === 'web' && styles.webPicker]}
                            >
                                <Picker.Item label="Selecionar formato" value="0" />
                                <Picker.Item label="Formato Digital" value="online" />
                                <Picker.Item label="Formato fisico" value="offline" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Detalhes:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Detalhes do guia (opcional)"
                            value={detalhes}
                            onChangeText={setDetalhes}
                            multiline={true}
                            maxLength={limiteCaracteres}
                            placeholderTextColor="#999"
                        />
                        <Text style={styles.contador}>{detalhes.length}/{limiteCaracteres}</Text>
                    </View>
                </View>

                <Modal
                    visible={showConfirmation}
                    transparent
                    animationType="fade"
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity style={styles.modalBackButton} onPress={() => setShowConfirmation(false)}>
                                    <AntDesign name="closecircleo" size={24} color="black" />
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>Confirmação do Pedido</Text>
                            </View>

                            <View style={styles.modalBody}>
                                <Text style={styles.modalText}>
                                    Seu guia de estudo foi processado com sucesso!
                                </Text>

                                <View style={styles.orderDetails}>
                                    <View style={styles.orderItem}>
                                        <Text style={styles.orderLabel}>Matéria:</Text>
                                        <Text style={styles.orderValue}>
                                            {subjects.find(s => s.value === subject)?.label}
                                        </Text>
                                    </View>

                                    <View style={styles.orderItem}>
                                        <Text style={styles.orderLabel}>Tópico:</Text>
                                        <Text style={styles.orderValue}>{topic}</Text>
                                    </View>

                                    <View style={styles.orderItem}>
                                        <Text style={styles.orderLabel}>Páginas:</Text>
                                        <Text style={styles.orderValue}>{pages}</Text>
                                    </View>

                                    <View style={styles.orderItem}>
                                        <Text style={styles.orderLabel}>Detalhes:</Text>
                                        <Text style={styles.orderValueD}>{detalhes}</Text>
                                    </View>

                                    <View style={[styles.orderItemv, styles.totalItem]}>
                                        <Text style={styles.totalLabel}>Preço Total:</Text>
                                        <Text style={styles.modalTotalPrice}>{totalPrice} MZ</Text>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.finalizeButton}
                                onPress={handleFinalize}
                            >
                                <Text style={styles.finalizeButtonText}>Finalizar Pedido</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
}
