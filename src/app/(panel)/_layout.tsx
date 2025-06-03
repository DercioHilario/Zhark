import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useCartStore } from '../../stores/cartStore';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { useFonts } from 'expo-font';


function CartIcon({ color, size }: { color: string; size: number }) {
    const items = useCartStore((state) => state.items);
    const totalItems = items.length;

    return (
        <View>
            <Feather name="shopping-cart" color={color} size={size} />
            {totalItems > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{totalItems}</Text>
                </View>
            )}
        </View>
    );
}

export default function PanelLayout() {
    const [fontsLoaded] = useFonts({
        'Wellfleet-Regular': require('../../../assets/fonts/Wellfleet-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: "#121212" },
                tabBarActiveTintColor: "#1de8ff",
                tabBarInactiveTintColor: "#888",
                tabBarLabelStyle: {
                    fontFamily: 'Wellfleet-Regular',
                },
            }}
        >
            <Tabs.Screen
                name="inicio"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="paper-plane-outline" color={color} size={size} />
                    ),
                    tabBarLabel: 'Inicio',
                }}
            />
            <Tabs.Screen
                name="chat"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbox-ellipses-outline" color={color} size={size} />
                    ),
                    tabBarLabel: 'Chat',
                }}
            />
            <Tabs.Screen
                name="checkout"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <CartIcon color={color} size={size} />
                    ),
                    tabBarLabel: 'Checkout',
                }}
            />
            <Tabs.Screen
                name="perfil"
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="user" color={color} size={size} />
                    ),
                    tabBarLabel: 'Perfil',
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    badge: {
        position: 'absolute',
        right: -6,
        top: -6,
        backgroundColor: '#FF4444',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
        fontFamily: 'Wellfleet-Regular',
    },
});
