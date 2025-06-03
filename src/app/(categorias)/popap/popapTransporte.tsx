import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Modal } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import styles from "../../Style/popapTrasporte";
import LocalModal from "../../../../constants/local";
import { supabase } from "../../../../constants/supabaseClient"; // Certifique-se que esse caminho está correto

type FormFields = {
    nome: string;
    telefone: string;
    origem: string;
    destino: string;
};

export default function Servico() {
    const router = useRouter();

    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [formData, setFormData] = useState<FormFields>({
        nome: "",
        telefone: "",
        origem: "",
        destino: "",
    });
    const [isCalculating, setIsCalculating] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [isMapModalVisible, setIsMapModalVisible] = useState(false);
    const [selectingField, setSelectingField] = useState<keyof FormFields | null>(null);
    const [userId, setUserId] = useState<string>("");

    const precoEstimado = "250 MT"; // Simulação

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                Wellfleet: require("../../../../assets/fonts/Wellfleet-Regular.ttf"),
            });
            setFontsLoaded(true);
        };
        loadFonts();
    }, []);

    useEffect(() => {
        const fetchUserId = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (data?.user) {
                setUserId(data.user.id);
            } else {
                console.error("Erro ao buscar usuário:", error);
            }
        };
        fetchUserId();
    }, []);

    const handleInputChange = (field: keyof FormFields, value: string) => {
        const newValue = field === "telefone" ? value.replace(/[^0-9]/g, "") : value;
        setFormData((prev) => ({ ...prev, [field]: newValue }));
    };

    const handleSubmit = () => {
        const { nome, telefone, origem, destino } = formData;
        if (!nome || !telefone || !origem || !destino) return;

        setIsCalculating(true);
        setTimeout(() => {
            setIsCalculating(false);
            setShowPopup(true);
        }, 2000);
    };

    const renderInput = (
        label: string,
        placeholder: string,
        field: keyof FormFields,
        icon = false,
        editable = true
    ) => (
        <Animated.View entering={FadeInDown.delay(200)} style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <View style={icon ? styles.inputWithIcon : null}>
                {icon && <MaterialCommunityIcons name="map-marker" size={20} color="#666" />}
                <TextInput
                    style={icon ? styles.locationTextInput : styles.input}
                    placeholder={placeholder}
                    value={formData[field]}
                    onChangeText={(text) => handleInputChange(field, text)}
                    keyboardType={field === "telefone" ? "phone-pad" : "default"}
                    editable={editable}
                />
                {icon && (
                    <TouchableOpacity
                        onPress={() => {
                            setSelectingField(field);
                            setIsMapModalVisible(true);
                        }}
                    >
                        <FontAwesome5 name="map-marked-alt" size={24} color="black" />
                    </TouchableOpacity>
                )}
            </View>
        </Animated.View>
    );

    if (!fontsLoaded) return <Text>Carregando fontes...</Text>;

    const isFormValid = formData.nome && formData.telefone && formData.origem && formData.destino;

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <Animated.View entering={FadeIn} style={styles.overlay}>
                <View style={styles.formContainer}>
                    <Animated.Text entering={FadeInDown.delay(100)} style={styles.title}>
                        Solicite sua Corrida
                    </Animated.Text>

                    {renderInput("Nome", "Digite seu nome", "nome")}
                    {renderInput("Telefone", "Digite seu telefone", "telefone")}
                    {renderInput("Local de Partida", "Selecione o local", "origem", true, false)}
                    {renderInput("Destino", "Selecione o destino", "destino", true, false)}

                    <Animated.View entering={FadeInDown.delay(600)} style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.submitButton,
                                (!isFormValid || isCalculating) && styles.submitButtonDisabled,
                            ]}
                            disabled={!isFormValid || isCalculating}
                            onPress={handleSubmit}
                        >
                            {isCalculating ? (
                                <View style={styles.calculatingContainer}>
                                    <ActivityIndicator size="small" color="#fff" />
                                    <Text style={styles.calculatingText}>Calculando...</Text>
                                </View>
                            ) : (
                                <Text style={styles.submitButtonText}>Calcular Preço</Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Animated.View>

            {/* Modal com Preço Estimado */}
            <Modal
                visible={showPopup}
                transparent
                animationType="fade"
                onRequestClose={() => setShowPopup(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Preço estimado</Text>
                        <Text style={styles.modalPrice}>{precoEstimado}</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={() => setShowPopup(false)}
                                style={styles.modalCancel}
                            >
                                <Text style={styles.modalText}>Fechar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    alert("Seu pedido foi realizado com sucesso!");
                                    setShowPopup(false);
                                    router.replace("/(panel)/inicio");
                                }}
                                style={styles.modalConfirm}
                            >
                                <Text style={styles.modalText}>Confirmar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Novo Modal de Localização */}
            {userId && (
                <LocalModal
                    visible={isMapModalVisible}
                    onClose={() => {
                        setIsMapModalVisible(false);
                        setSelectingField(null);
                    }}
                    onSelect={(enderecoSelecionado: string) => {
                        if (selectingField) {
                            setFormData((prev) => ({
                                ...prev,
                                [selectingField]: enderecoSelecionado,
                            }));
                        }
                        setIsMapModalVisible(false);
                        setSelectingField(null);
                    }}
                    userId={userId}
                />
            )}
        </View>
    );
}
