import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Modal, Alert } from "react-native";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import { supabase } from '../lib/supabase';

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

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }
        if (!isValidEmail(email)) {
            Alert.alert("Erro", "Insira um e-mail válido");
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert("Erro", "Erro ao entrar na conta! Verifique se o seu e-mail ou senha estão corretos.");
            return;
        }

        setLoading(false); // Certifique-se de sempre redefinir o estado de carregamento

        router.replace('/(panel)/inicio');
    };

    const handleCreateAccount = async () => {
        if (!userEmail || !userPassword || !name) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }
        if (!isValidEmail(userEmail)) {
            Alert.alert("Erro", "Insira um e-mail válido");
            return;
        }
        if (userPassword.length < 6) {
            Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
            return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email: userEmail,
            password: userPassword,
            options: {
                data: { name },
            },
        });

        setLoading(false);

        if (error) {
            Alert.alert("Erro", "Erro ao criar conta");
            return;
        }

        Alert.alert("Sucesso", "Conta criada com sucesso!");
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
                    <Text style={styles.buttonText}>{loading ? "Carregando..." : "Entrar"}</Text>
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
        </View>
    );
}

