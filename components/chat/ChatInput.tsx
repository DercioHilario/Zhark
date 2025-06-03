import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { Camera, Image, Paperclip, Send } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Message } from '../../types/chat';
import * as Font from 'expo-font';

type ChatInputProps = {
    onSendMessage: (message: Omit<Message, 'id' | 'createdAt' | 'status'>) => void;
};

export default function ChatInput({ onSendMessage }: ChatInputProps) {
    const [messageText, setMessageText] = useState('');
    const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        const loadFonts = async () => {
            try {
                await Font.loadAsync({
                    Wellfleet: require('../../assets/fonts/Wellfleet-Regular.ttf'),
                });
                setFontsLoaded(true);
            } catch (error) {
                console.error('Erro ao carregar fontes:', error);
            }
        };
        loadFonts();
    }, []);

    const handleSendMessage = () => {
        if (messageText.trim()) {
            onSendMessage({
                text: messageText.trim(),
                sender: 'user',
            });
            setMessageText('');
            setIsAttachmentMenuOpen(false);
        }
    };

    const handleImagePicker = async () => {
        setIsAttachmentMenuOpen(false);
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para enviar imagens.');
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.7,
                allowsEditing: true,
            });

            if (!result.canceled && result.assets.length > 0) {
                onSendMessage({
                    text: 'Imagem',
                    sender: 'user',
                    imageUri: result.assets[0].uri,
                });
            }
        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
        }
    };

    const handleOpenCamera = async () => {
        setIsAttachmentMenuOpen(false);
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar fotos.');
            return;
        }

        try {
            const result = await ImagePicker.launchCameraAsync({
                quality: 0.7,
                allowsEditing: true,
            });

            if (!result.canceled && result.assets.length > 0) {
                onSendMessage({
                    text: 'Imagem',
                    sender: 'user',
                    imageUri: result.assets[0].uri,
                });
            }
        } catch (error) {
            console.error('Erro ao usar a câmera:', error);
        }
    };

    if (!fontsLoaded) return null;

    return (
        <View style={styles.container}>
            {isAttachmentMenuOpen && (
                <View style={styles.attachmentMenu}>
                    <TouchableOpacity style={styles.attachmentOption} onPress={handleImagePicker}>
                        <View style={[styles.attachmentIcon, { backgroundColor: '#000000' }]}>
                            <Image size={20} color="#ffffff" />
                        </View>
                        <Text style={styles.attachmentText}>Galeria</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.attachmentOption} onPress={handleOpenCamera}>
                        <View style={[styles.attachmentIcon, { backgroundColor: '#000000' }]}>
                            <Camera size={20} color="#ffffff" />
                        </View>
                        <Text style={styles.attachmentText}>Câmera</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={styles.ContainerButton}>
                <TouchableOpacity
                    style={styles.attachButton}
                    onPress={() => setIsAttachmentMenuOpen(!isAttachmentMenuOpen)}
                >
                    <Paperclip size={24} color="#6e6e6e" />
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <TextInput
                        ref={inputRef}
                        style={styles.input}
                        placeholder="Digite uma mensagem..."
                        value={messageText}
                        onChangeText={setMessageText}
                        multiline
                        maxLength={450}
                    />

                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSendMessage}
                        activeOpacity={0.7}
                    >
                        <Send size={22} color="#6e6e6e" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        paddingBottom: 10,
        paddingTop: 8,
        backgroundColor: '#ffffff',
    },
    ContainerButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    attachButton: {
        backgroundColor: '#f5f5f5',
        marginRight: 5,
        borderRadius: 50,
        padding: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 24,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flex: 1,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Wellfleet',
        maxHeight: 100,
        color: '#1c1c1e',
    },
    sendButton: {
        backgroundColor: '#f5f5f5',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    attachmentMenu: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        backgroundColor: '#ffffff',
        borderRadius: 16,
        marginBottom: 8,
    },
    attachmentOption: {
        alignItems: 'center',
        marginRight: 16,
    },
    attachmentIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    attachmentText: {
        fontSize: 12,
        fontFamily: 'Wellfleet',
        color: '#1c1c1e',
    },
});
