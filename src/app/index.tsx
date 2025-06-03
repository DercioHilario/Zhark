import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Modal, ActivityIndicator } from "react-native";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import { supabase } from '../../constants/supabaseClient';
import { CustomAlert } from '../../constants/CustomAlert';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [name, setName] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');
    const [alertOnConfirm, setAlertOnConfirm] = useState<(() => void) | undefined>(undefined);
    const [alertShowCancel, setAlertShowCancel] = useState(false);
    const [alertaMostrado, setAlertaMostrado] = useState(false);

    useEffect(() => {
        const loadFonts = async () => {
            try {
                await Font.loadAsync({
                    "Wellfleet": require("../../assets/fonts/Wellfleet-Regular.ttf"),
                });
                setFontsLoaded(true);
            } catch (error) {
                console.error("Erro ao carregar fontes:", error);
            }
        };
        loadFonts();
    }, []);

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };


    const showCustomAlert = (title: string, message: string, onConfirm?: () => void, showCancel = false) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertOnConfirm(() => onConfirm);
        setAlertShowCancel(showCancel);
        setAlertVisible(true);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            showCustomAlert("Erro", "Preencha todos os campos.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setLoading(false); // Garante que o botão volte ao normal
                showCustomAlert("Erro", "Erro ao entrar na conta! Verifique se o seu e-mail ou senha estão corretos.");
                return;
            }

            router.replace("/(panel)/inicio");
        } catch (error) {
            showCustomAlert("Erro", "Ocorreu um erro inesperado.");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAccount = async () => {
        if (!userEmail || !userPassword || !name) {
            showCustomAlert("Erro", "Preencha todos os campos");
            return;
        }
        if (!isValidEmail(userEmail)) {
            showCustomAlert("Erro", "Insira um e-mail válido");
            return;
        }
        if (userPassword.length < 6) {
            showCustomAlert("Erro", "A senha deve ter no mínimo 6 caracteres.");
            return;
        }

        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email: userEmail,
            password: userPassword,
            options: {
                data: {
                    name: name
                }
            }
        });

        if (error) {
            setLoading(false);
            showCustomAlert("Erro", error.message || "Erro ao criar conta");
            return;
        }

        showCustomAlert("Sucesso", "Conta criada com sucesso!");

        setLoading(false);
        setModalVisible(false);
        setUserEmail("");
        setUserPassword("");
        setName("");
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.logoContainer}>
                <Image source={require("../../assets/img/logo.png")} style={styles.logo} />
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.title}>Entrar</Text>
                <Text style={styles.subtitle}>Email:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Teu e-mail"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <Text style={styles.subtitle}>Senha:</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Tua senha"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text style={styles.buttonText}>Entrar</Text>
                    )
                    }
                </TouchableOpacity>

                <Text style={styles.ou}>------------ ou ------------</Text>

                <TouchableOpacity style={styles.createButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.createButtonText}>Criar Conta</Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Criar conta</Text>

                        <Text style={styles.subtitle}>Nome Completo:</Text>
                        <TextInput
                            style={[styles.input, fontsLoaded && { fontFamily: "Wellfleet" }]}
                            placeholder="Teu Nome Completo"
                            value={name}
                            onChangeText={setName}
                        />

                        <Text style={styles.subtitle}>Email:</Text>
                        <TextInput
                            style={[styles.input, fontsLoaded && { fontFamily: "Wellfleet" }]}
                            placeholder="Teu e-mail"
                            keyboardType="email-address"
                            value={userEmail}
                            onChangeText={setUserEmail}
                        />

                        <Text style={styles.subtitle}>Escolha sua senha:</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Tua senha"
                                secureTextEntry={!showPassword}
                                value={userPassword}
                                onChangeText={setUserPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                                <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleCreateAccount} disabled={loading}>
                            <Text style={styles.buttonText}>{loading ? "Carregando..." : "Criar"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.backButton}>
                            <Text style={styles.backButtonText}>Voltar</Text>
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
        </View>
    );
}

