import { Stack, useRouter, usePathname } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, userAuth } from "../contexts/AuthContext";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
    return (
        <AuthProvider>
            <MainLayout />
        </AuthProvider>
    );
}

function MainLayout() {
    const { user, loading } = userAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) return;

        if (user && pathname !== "/(panel)/inicio") {
            console.log("Usuário autenticado. Redirecionando para /panel/inicio");
            router.push("/(panel)/inicio");
        } else if (!user && pathname !== "/") {
            console.log("Usuário não autenticado. Redirecionando para /");
            router.push("/");
        }
    }, [user, loading, pathname]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}
