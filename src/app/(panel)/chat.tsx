import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import ChatHeader from '@/components/chat/ChatHeader';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';
import { Message } from '../../../types/chat';
import { supabase } from '../../../constants/supabaseClient';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Obter ID do usuário autenticado
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Erro ao obter usuário:', error.message);
      } else {
        setUserId(data.user?.id || null);
      }
    };

    getUser();
  }, []);

  // Buscar mensagens existentes
  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao buscar mensagens:', error.message);
      } else {
        const parsedMessages: Message[] = data.map((msg: any) => ({
          id: msg.id.toString(),
          text: msg.text,
          sender: msg.sender,
          createdAt: new Date(msg.created_at),
          imageUri: msg.image_url || undefined,
          status: msg.status || 'sent',
        }));
        setMessages(parsedMessages);
      }
    };

    fetchMessages();
  }, [userId]);

  // Função para adicionar mensagem
  const addMessage = async (message: Omit<Message, 'id' | 'createdAt' | 'status'>) => {
    if (!userId) return;

    // Criar mensagem temporária local
    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: tempId,
      text: message.text,
      sender: message.sender,
      createdAt: new Date(),
      imageUri: message.imageUri || undefined,
      status: 'sending',
    };

    // Mostrar imediatamente na tela
    setMessages(prev => [...prev, tempMessage]);

    // Enviar para Supabase
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          text: message.text,
          sender: message.sender,
          user_id: userId,
          image_url: message.imageUri || null,
          status: 'sent',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao enviar mensagem:', error.message);

      // Atualiza status para 'failed'
      setMessages(prev =>
        prev.map(msg => (msg.id === tempId ? { ...msg, status: 'failed' } : msg))
      );
      return;
    }

    // Substituir mensagem temporária pela real
    const realMessage: Message = {
      id: data.id.toString(),
      text: data.text,
      sender: data.sender,
      createdAt: new Date(data.created_at),
      imageUri: data.image_url || undefined,
      status: 'sent',
    };

    setMessages(prev =>
      prev.map(msg => (msg.id === tempId ? realMessage : msg))
    );

    // Simular resposta do bot
    if (message.sender === 'user') {
      setTimeout(async () => {
        const responses = [
          'Entendi! Vou verificar isso para você.',
          'Como posso ajudar com mais alguma coisa?',
          'Agradeço sua paciência. Estamos trabalhando no seu caso.',
          'Poderia fornecer mais detalhes sobre isso?',
          'Vou encaminhar seu caso para um especialista.',
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        const { data: botData, error: botError } = await supabase
          .from('messages')
          .insert([
            {
              text: randomResponse,
              sender: 'bot',
              user_id: userId,
              image_url: null,
              status: 'delivered',
            },
          ])
          .select()
          .single();

        if (botError) {
          console.error('Erro ao enviar resposta do bot:', botError.message);
          return;
        }

        const botMessage: Message = {
          id: botData.id.toString(),
          text: botData.text,
          sender: botData.sender,
          createdAt: new Date(botData.created_at),
          imageUri: undefined,
          status: 'delivered',
        };

        setMessages(prev => [...prev, botMessage]);
      }, 1000);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ChatHeader />
      <View style={styles.content}>
        <MessageList messages={messages} setMessages={setMessages} userId={userId || ''} />
        <ChatInput onSendMessage={addMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
});
