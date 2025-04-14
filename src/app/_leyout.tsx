import { Stack, useRouter } from "expo-router";
import { AuthProvider, userAuth } from "../contexts/ActhContext";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function RootLayout() {
    return (
        <AuthProvider>
            <MainLayout />
        </AuthProvider>
    );
}

function MainLayout() {
    const { user } = userAuth();
    const router = useRouter(); // Use useRouter() corretamente
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            console.log("Verificando autenticação...");

            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Erro ao obter sessão:", error);
                setLoading(false);
                return;
            }

            console.log("Sessão atual:", session);

            setLoading(false);

            if (session?.user) {
                console.log("Usuário autenticado. Redirecionando para /panel/inicio");
                router.replace('/(panel)/inicio');
            } else {
                console.log("Nenhum usuário autenticado. Redirecionando para /");
                router.replace('/');
            }
        };

        checkAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("Mudança no estado de autenticação:", session);

            if (session?.user) {
                console.log("Usuário autenticado após mudança. Redirecionando para /panel/inicio");
                router.replace('/(panel)/inicio');
            } else {
                console.log("Usuário deslogado. Redirecionando para /");
                router.replace('/');
            }
        });

        return () => {
            console.log("Limpando listener de autenticação...");
            authListener.subscription.unsubscribe();
        };
    }, [router]); // Adicione 'router' como dependência

    if (loading) return null;

    return (
        <Stack>
            <Stack.Screen name="(panel)/_layout" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
    );
}


