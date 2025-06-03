import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Image, Text } from 'react-native';
import { Message } from '../../types/chat';
import * as Font from 'expo-font';
import { supabase } from '../../constants/supabaseClient';
import { Check, CheckCheck } from 'lucide-react-native';

type MessageListProps = {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    userId: string;
};

export default function MessageList({ messages, setMessages, userId }: MessageListProps) {
    const flatListRef = useRef<FlatList>(null);
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

    useEffect(() => {
        if (messages.length > 0) {
            flatListRef.current?.scrollToOffset({ offset: 999999, animated: true });
        }
    }, [messages]);

    useEffect(() => {
        const channel = supabase
            .channel('messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                (payload) => {
                    const newMessage = payload.new as any;

                    if (newMessage?.user_id === userId) {
                        setMessages((prev) => [
                            ...prev,
                            {
                                id: newMessage.id,
                                text: newMessage.text,
                                sender: newMessage.sender,
                                createdAt: new Date(newMessage.created_at),
                                imageUri: newMessage.image_url,
                                status: newMessage.status,
                            },
                        ]);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    const formatTime = (date: Date) => {
        try {
            return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch {
            return '';
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';

        return (
            <View
                style={[
                    styles.messageContainer,
                    isUser ? styles.userMessageContainer : styles.botMessageContainer,
                ]}
            >
                <View style={[styles.messageContent, isUser ? styles.userMessage : styles.botMessage]}>
                    {item.imageUri ? (
                        <Image source={{ uri: item.imageUri }} style={styles.messageImage} />
                    ) : (
                        <Text style={[styles.messageText, { color: isUser ? 'white' : '#1c1c1e' }]}>
                            {item.text}
                        </Text>
                    )}
                    <Text
                        style={[
                            styles.messageTime,
                            { color: isUser ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)' },
                        ]}
                    >
                        {formatTime(item.createdAt)}
                    </Text>
                </View>

                {isUser && (
                    <View style={styles.statusContainer}>
                        {item.status === 'sending' && (
                            <Text style={{ color: 'gray', fontSize: 10 }}>Enviando...</Text>
                        )}
                        {item.status === 'failed' && (
                            <Text style={{ color: 'red', fontSize: 10 }}>Falhou</Text>
                        )}
                        {item.status === 'sent' && (
                            <Check size={16} color="rgba(255,255,255,0.7)" />
                        )}
                        {item.status === 'delivered' && (
                            <CheckCheck size={16} color="rgba(255,255,255,0.7)" />
                        )}
                        {item.status === 'read' && (
                            <CheckCheck size={16} color="#4FC3F7" />
                        )}
                        {item.status === 'seen' && (
                            <CheckCheck size={16} color="#4FC3F7" />
                        )}
                    </View>
                )}
            </View>
        );
    };

    if (!fontsLoaded) return null;

    return (
        <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToOffset({ offset: 999999, animated: true })}
        />
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingHorizontal: 5,
        paddingVertical: 1,
    },
    messageContainer: {
        marginBottom: 16,
        maxWidth: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        flexShrink: 1,
    },
    userMessageContainer: {
        alignSelf: 'flex-end',
    },
    botMessageContainer: {
        alignSelf: 'flex-start',
    },
    messageContent: {
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        minWidth: 80,
        maxWidth: '85%',
        flexShrink: 1,
    },
    userMessage: {
        backgroundColor: '#1c1c1e',
        borderBottomRightRadius: 4,
    },
    botMessage: {
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 15,
        fontFamily: 'Wellfleet',
        flexWrap: 'wrap',
        flexShrink: 1,
    },
    messageImage: {
        width: 200,
        height: 150,
        borderRadius: 8,
        marginBottom: 4,
    },
    messageTime: {
        fontSize: 10,
        fontFamily: 'Wellfleet',
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    statusContainer: {
        marginLeft: 4,
    },
});
