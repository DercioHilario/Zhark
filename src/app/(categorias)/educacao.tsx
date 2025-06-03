import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, ScrollView, Platform, Vibration, BackHandler } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useFonts, Wellfleet_400Regular } from '@expo-google-fonts/wellfleet';
import { subjects } from '../../../constants/subjects';
import styles from "../Style/educacao";
import AntDesign from '@expo/vector-icons/AntDesign';
import { supabase } from '../../../constants/supabaseClient';
import { CustomAlert } from '../../../constants/CustomAlert';

export default function StudyGuide() {
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [detalhes, setDetalhes] = useState('');
    const [pages, setPages] = useState('5');
    const [classType, setClassType] = useState('0');
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const limiteCaracteres = 200;
    const [alertaMostrado, setAlertaMostrado] = useState(false);
    const [userPoints, setUserPoints] = useState<number>(0);
    const [userId, setUserId] = useState<string | null>(null);
    const router = useRouter();
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertOnConfirm, setAlertOnConfirm] = useState<(() => void) | undefined>(undefined);
    const [alertShowCancel, setAlertShowCancel] = useState(false);
    const [formData, setFormData] = useState({
        senderName: '',
        senderPhone: '',
        recipientName: '',
        recipientPhone: '',
        deliveryLocation: '',
        locationReference: '',
        customMessage: ''
    });


    useEffect(() => {
        const backAction = () => {
            if (showConfirmation) {
                setShowConfirmation(false); // Fecha o modal
                return true; // Intercepta o botão de voltar
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [showConfirmation]);

    // Pega o usuário autenticado e carrega pontos
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (error) {
                    console.error('Erro ao obter usuário:', error.message);
                    return;
                }
                if (data.user) {
                    setUserId(data.user.id);
                    fetchUserPoints(data.user.id);
                }
            } catch (error) {
                console.error('Erro ao buscar usuário autenticado:', error);
            }
        };

        const fetchUserPoints = async (id: string) => {
            const { data, error } = await supabase
                .from('users')
                .select('points')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Erro ao buscar pontos do usuário:', error.message);
            } else {
                setUserPoints(data.points);
            }
        };

        fetchUser();
    }, []);

    const showCustomAlert = (title: string, message: string, onConfirm?: () => void, showCancel = false) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertOnConfirm(() => onConfirm);
        setAlertShowCancel(showCancel);
        setAlertVisible(true);
    };

    useEffect(() => {
        if (detalhes.length === limiteCaracteres && !alertaMostrado) {
            showCustomAlert(
                'Limite atingido',
                `Você atingiu o limite de ${limiteCaracteres} caracteres.`
            );
            Vibration.vibrate(200);
            setAlertaMostrado(true);
        }

        if (detalhes.length < limiteCaracteres && alertaMostrado) {
            setAlertaMostrado(false);
        }
    }, [detalhes]);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                router.replace('/(panel)/inicio');
                return true;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [router])
    );

    useEffect(() => {
        const numPages = parseInt(pages, 10);
        if (numPages > 0 && numPages < 5) {
            showCustomAlert('Aviso', 'O número mínimo de páginas é 5.');
        }
    }, [pages]);

    const [fontsLoaded] = useFonts({
        Wellfleet: Wellfleet_400Regular,
    });

    const updateTotal = useCallback((selectedClassType: string, selectedPages: string) => {
        const numPages = parseInt(selectedPages, 10) || 0;
        if (selectedClassType === '0') {
            setTotalPrice(0);
        } else {
            const pricePerPage = selectedClassType === 'offline' ? 2 : 1;
            setTotalPrice(numPages * pricePerPage);
        }
    }, []);

    useEffect(() => {
        updateTotal(classType, pages);
    }, [classType, pages, updateTotal]);

    const isFormValid = subject && topic && parseInt(pages, 10) >= 5 && classType !== '0';

    const handleSubmit = async () => {
        if (!isFormValid) {
            showCustomAlert('Erro', 'Preencha todos os campos corretamente.');
            return;
        }

        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setShowConfirmation(true);
        } catch (error) {
            showCustomAlert('Erro', 'Ocorreu um erro ao processar seu pedido.');
        } finally {
            setIsLoading(false);
        }
    };

const handleFinalize = async () => {
  if (!userId) {
    showCustomAlert('Erro', 'Usuário não identificado.');
    return;
  }

  // Ponto = 1 MTZ, arredonda pra baixo
  const requiredPoints = Math.floor(totalPrice);

  if (userPoints < requiredPoints) {
    showCustomAlert(
      'Pontos Insuficientes',
      'Você não tem pontos suficientes para finalizar a compra.',
      () => router.push('/(categorias)/(Perfil)/RecargaPontos'),
      true
    );
    return;
  }

  setShowConfirmation(false);
  setIsLoading(true);

  try {
    const newPoints = userPoints - requiredPoints;

    // Atualiza pontos do usuário
    const { error: pontosError } = await supabase
      .from('users')
      .update({ points: newPoints })
      .eq('id', userId);

    if (pontosError) {
      console.error('Erro ao atualizar pontos:', pontosError);
      showCustomAlert('Erro', 'Não foi possível finalizar a compra.');
      setIsLoading(false);
      return;
    }

    // Define tipo de aula e tempo estimado
    const tipoAula = classType === 'online' ? 'online' : 'offline';
    const tempoEstimadoMinutos = tipoAula === 'online' ? 15 : 60;

    // Monta o objeto do pedido (um objeto simples)
    const pedidoObj = {
      tema: subject,
      topico: topic,
      tipo_aula: tipoAula,
      numero_paginas: parseInt(pages, 10),
    };

    // Garante que items seja uma string JSON representando um array com o pedidoObj dentro
    const itemsString = JSON.stringify([pedidoObj]);

    // Insere o pedido na tabela 'pedidos'
    const { data, error } = await supabase
      .from('pedidos')
      .insert([
        {
          user_id: userId,
          items: itemsString,  // aqui vai a string JSON do array
          total: totalPrice,
          status: 'pendente',
          tempo_entrega_minutos: tempoEstimadoMinutos,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Erro ao salvar pedido:', error);
      showCustomAlert('Erro', 'Não foi possível salvar o pedido.');
      setIsLoading(false);
      return;
    }

    // Atualiza pontos localmente
    setUserPoints(newPoints);

    showCustomAlert('Sucesso', 'Compra finalizada com sucesso!', () =>
      router.replace('/(panel)/inicio')
    );
  } catch (error) {
    console.error('Erro geral ao finalizar:', error);
    showCustomAlert('Erro', 'Ocorreu um erro inesperado.');
  } finally {
    setIsLoading(false);
  }
};

    const goToHome = useCallback(() => {
        router.replace('/(panel)/inicio');
    }, [router]);

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <StatusBar style="auto" />
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Carregando...</Text>
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
                                    <Picker.Item key={item.value} label={item.label} value={item.value} />
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
                            placeholder="Digite o número de páginas (mínimo 5)"
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
                                <Picker.Item label="Formato físico" value="offline" />
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
                            multiline
                            maxLength={limiteCaracteres}
                            placeholderTextColor="#999"
                        />
                        <Text style={styles.contador}>{detalhes.length}/{limiteCaracteres}</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={!isFormValid || isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.submitButtonText}>Solicitar Guia</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={showConfirmation}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowConfirmation(false)}
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
                                        <Text style={styles.totalLabel}>Total:</Text>
                                        <Text style={styles.modalTotalPrice}>{totalPrice} Z-coins</Text>
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
            </ScrollView>
        </View>
    );
}
