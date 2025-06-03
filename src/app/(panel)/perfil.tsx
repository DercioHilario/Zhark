import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { ChevronRight, Wallet, Package, MapPin } from 'lucide-react-native';
import { supabase } from '@/constants/supabaseClient';
import { userAuth } from '@/src/contexts/AuthContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import * as Font from "expo-font";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
}

export default function ProfileScreen() {
    const router = useRouter();
    const { setUser } = userAuth();
    const [userData, setUserData] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [totalPedidos, setTotalPedidos] = useState(0); // novo state para contar pedidos

    useEffect(() => {
        const loadFonts = async () => {
            try {
                await Font.loadAsync({
                    "Wellfleet": require("../../../assets/fonts/Wellfleet-Regular.ttf"),
                });
                setFontsLoaded(true);
            } catch (error) {
                console.error("Erro ao carregar fontes:", error);
            }
        };
        loadFonts();
    }, []);

    useEffect(() => {
        async function fetchUser() {
            try {
                const { data: sessionData } = await supabase.auth.getSession();
                const currentUser = sessionData.session?.user;

                if (!currentUser) {
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('users')
                    .select('id, name, email, avatar_url')
                    .eq('id', currentUser.id)
                    .single();

                if (error) {
                    console.log('Erro ao buscar dados do usuário:', error.message);
                    setUserData(null);
                } else {
                    setUserData(data);

                    // Buscar quantidade de pedidos do usuário
                    fetchPedidos(data.id);
                }
            } catch (error) {
                console.log('Erro inesperado:', error);
            } finally {
                setLoading(false);
            }
        }

        async function fetchPedidos(userId: string) {
            const { count, error } = await supabase
                .from("pedidos")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId);

            if (!error && typeof count === 'number') {
                setTotalPedidos(count);
            } else {
                console.log("Erro ao contar pedidos:", error?.message);
            }
        }

        fetchUser();
    }, []);

    async function handleSignout() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            Alert.alert('Erro', 'Erro ao sair da conta, tente mais tarde.');
            return;
        }

        setUser(null);
        router.replace('/');
    }

    async function handleSelectImage() {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64: true,
        });

        if (!result.canceled && result.assets.length > 0) {
            const image = result.assets[0];
            const fileName = `${userData?.id}-${Date.now()}.jpg`;
            const filePath = `public/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, decode(image.base64!), {
                    contentType: "image/jpeg",
                    upsert: true,
                });

            if (uploadError) {
                Alert.alert("Erro", "Erro ao enviar imagem: " + uploadError.message);
                return;
            }

            const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
            const publicUrl = data.publicUrl;

            const { error: updateError } = await supabase
                .from("users")
                .update({ avatar_url: publicUrl })
                .eq("id", userData?.id);

            if (updateError) {
                Alert.alert("Erro", "Erro ao salvar imagem no perfil.");
            } else {
                setUserData({ ...userData!, avatar_url: publicUrl });
                Alert.alert("Sucesso", "Foto de perfil atualizada!");
            }
        }
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleSelectImage}>
                    <Image
                        source={{
                            uri: userData?.avatar_url || 'https://wdjflerlamrwdkzkzyjy.supabase.co/storage/v1/object/public/imagem//perfil.png',
                        }}
                        style={styles.avatar}
                    />
                </TouchableOpacity>
                <Text style={styles.tip}>Toque na imagem para alterar</Text>
                <Text style={styles.name}>{userData?.name || 'Nome não disponível'}</Text>
                <Text style={styles.email}>{userData?.email || 'Email não disponível'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Meu Perfil</Text>

                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(categorias)/(Perfil)/RecargaPontos')}>
                    <Wallet size={20} color="#000000" />
                    <Text style={styles.menuText}>Recarregar Z-coins</Text>
                    <ChevronRight size={20} color="#666666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(categorias)/(Perfil)/MeusPedidos')}>
                    <Package size={20} color="#000000" />

                    <View style={styles.menuWithBadge}>
                        <Text style={styles.menuText}>Meus Pedidos</Text>
                        {totalPedidos > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{totalPedidos}</Text>
                            </View>
                        )}
                    </View>

                    <ChevronRight size={20} color="#666666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(categorias)/(Perfil)/Localizacao')}>
                    <MapPin size={20} color="#000000" />
                    <Text style={styles.menuText}>Localizacão</Text>
                    <ChevronRight size={20} color="#666666" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleSignout}>
                <Text style={styles.logoutButtonText}>Sair</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    name: {
        fontSize: 22,
        marginTop: 10,
        fontFamily: 'Wellfleet',
    },
    email: {
        fontSize: 15,
        color: '#777',
        fontFamily: 'Wellfleet',
    },
    tip: {
        fontSize: 10,
        color: '#888',
        marginTop: 4,
        fontFamily: 'Wellfleet',
    },
    section: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 16,
        marginBottom: 10,
        fontFamily: 'Wellfleet',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        gap: 10,
    },
    menuWithBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Wellfleet',
    },
    badge: {
        backgroundColor: '#f44336',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        paddingHorizontal: 6,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Wellfleet',
    },
    logoutButton: {
        backgroundColor: '#f44336',
        margin: 20,
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Wellfleet',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontFamily: 'Wellfleet',
        fontSize: 16,
        color: '#555',
    },
});
