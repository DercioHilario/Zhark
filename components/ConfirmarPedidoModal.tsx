// ConfirmarPedidoModal.tsx
import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    BackHandler,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

type ConfirmarPedidoModalProps = {
    visible: boolean;
    onClose: () => void;
    onConfirm: (dados: {
        recipientName: string;
        recipientPhone: string;
        deliveryLocation: string;
        locationReference: string;
    }) => void;
    isLoading: boolean;
    deliveryLocation: string;
    setDeliveryLocation: (loc: string) => void;
    setIsMapModalVisible: (visible: boolean) => void;
};

export default function ConfirmarPedidoModal({
    visible,
    onClose,
    onConfirm,
    isLoading,
    deliveryLocation,
    setDeliveryLocation,
    setIsMapModalVisible,
}: ConfirmarPedidoModalProps) {
    const [formData, setFormData] = useState({
        recipientName: '',
        recipientPhone: '',
        deliveryLocation: '',
        locationReference: '',
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            deliveryLocation: deliveryLocation,
        }));
    }, [deliveryLocation]);

    useEffect(() => {
        if (!visible) return;
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            onClose();
            return true;
        });
        return () => backHandler.remove();
    }, [visible]);

    const camposPreenchidos =
        formData.recipientName.trim() &&
        formData.recipientPhone.trim() &&
        formData.deliveryLocation.trim();

    const handleConfirmar = () => {
        if (!camposPreenchidos) return;
        onConfirm(formData);
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    style={styles.modalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.closeButton}>✕</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Confirmar Serviço</Text>
                        <View style={{ width: 30 }} />
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                        <Text style={styles.label}>Nome Completo:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome de quem envia"
                            placeholderTextColor="#999"
                            value={formData.recipientName}
                            onChangeText={(text) =>
                                setFormData({ ...formData, recipientName: text })
                            }
                        />

                        <Text style={styles.label}>Número de Telefone:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Número de quem envia"
                            placeholderTextColor="#999"
                            keyboardType="phone-pad"
                            value={formData.recipientPhone}
                            onChangeText={(text) =>
                                setFormData({ ...formData, recipientPhone: text })
                            }
                        />

                        <Text style={styles.label}>Local da Entrega:</Text>
                        <View style={styles.inputWithIcon}>
                            <TextInput
                                style={styles.inputFlex}
                                placeholder="Selecione a localização"
                                value={formData.deliveryLocation}
                                editable={false}
                                placeholderTextColor="#999"
                            />
                            <TouchableOpacity onPress={() => setIsMapModalVisible(true)}>
                                <FontAwesome5 name="map-marked-alt" size={24} color="black" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Referência:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Referência de localização (opcional)"
                            placeholderTextColor="#999"
                            value={formData.locationReference}
                            onChangeText={(text) =>
                                setFormData({ ...formData, locationReference: text })
                            }
                        />

                        <TouchableOpacity
                            style={[styles.confirmButton, { opacity: camposPreenchidos && !isLoading ? 1 : 0.5 }]}
                            onPress={handleConfirmar}
                            disabled={!camposPreenchidos || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.confirmText}>Finalizar Pedido</Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    closeButton: {
        fontSize: 28,
        color: '#333',
        fontFamily: 'Wellfleet',
    },
    title: {
        fontFamily: 'Wellfleet',
        fontSize: 24,
        textAlign: 'center',
        flex: 1,
        color: '#333',
    },
    scrollContainer: {
        paddingBottom: 20,
    },
    label: {
        fontFamily: 'Wellfleet',
        fontSize: 16,
        marginBottom: 6,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontFamily: "Wellfleet",
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderColor: '#ccc',
        borderRadius: 8,
        fontFamily: 'Wellfleet',
    },
    inputFlex: {
        flex: 1,
        fontFamily: 'Wellfleet',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cancelButton: {
        backgroundColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    cancelText: {
        fontFamily: 'Wellfleet',
        color: '#333',
    },
    confirmButton: {
        backgroundColor: '#1e90ff',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    confirmText: {
        fontFamily: 'Wellfleet',
        color: '#fff',
        textAlign: 'center',
    },
});
