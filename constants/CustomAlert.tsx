import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Font from "expo-font";

interface CustomAlertProps {
    visible: boolean;
    title?: string;
    message: string;
    onCancel: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
}

export function CustomAlert({
    visible,
    title,
    message,
    onCancel,
    onConfirm,
    confirmText = 'OK',
    cancelText = 'Agora Não',
    showCancel = false,
}: CustomAlertProps) {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        const loadFonts = async () => {
            try {
                await Font.loadAsync({
                    Wellfleet: require("../assets/fonts/Wellfleet-Regular.ttf"),
                });
                setFontsLoaded(true);
            } catch (error) {
                console.error("Erro ao carregar fontes:", error);
            }
        };
        loadFonts();
    }, []);

    if (!fontsLoaded) return null;

    const resolvedTitle = title ?? (!onConfirm && !showCancel
        ? "Parabéns"
        : "Aviso");

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {resolvedTitle && <Text style={styles.title}>{resolvedTitle}</Text>}
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttons}>
                        {showCancel && (
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={onCancel}
                            >
                                <Text style={styles.cancelText}>{cancelText}</Text>
                            </TouchableOpacity>
                        )}
                        {(onConfirm || !showCancel) && (
                            <TouchableOpacity
                                style={[styles.button, styles.confirmButton]}
                                onPress={() => {
                                    if (onConfirm) onConfirm();
                                    else onCancel();
                                }}
                            >
                                <Text style={styles.confirmText}>{confirmText}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    title: {
        fontFamily: "Wellfleet",
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        marginBottom: 20,
        color: '#333',
        fontFamily: "Wellfleet",
        textAlign: 'justify',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: '#ddd',
    },
    cancelText: {
        color: '#333',
        fontFamily: "Wellfleet",
    },
    confirmButton: {
        backgroundColor: '#1de8ff',
    },
    confirmText: {
        color: 'white',
        fontFamily: "Wellfleet",
    },
});
