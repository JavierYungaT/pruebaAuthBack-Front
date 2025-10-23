import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'http://192.168.18.76:7086/api/users';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                if (!token) {
                    Alert.alert('Error', 'No hay sesión iniciada');
                    router.push('/signin');
                    return;
                }

                const response = await axios.get(`${API_URL}/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data);
            } catch (error: any) {
                console.error('Error al obtener datos del usuario:', error);
                Alert.alert('Error', 'No se pudo obtener la información del usuario');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        router.push('/signin');
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A5FD9" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header */}
            <LinearGradient colors={['#4A5FD9', '#6B7FE8']} style={styles.header}>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>Dashboard</Text>
                    <TouchableOpacity onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Bienvenido</Text>
                    <Text style={styles.cardText}>
                        {user?.username || user?.email || 'Usuario'}
                    </Text>

                </View>

                {/* Ejemplo de cards adicionales */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Información</Text>
                    <Text style={styles.cardText}>Email: {user?.email}</Text>
                    <Text style={styles.cardText}>Rol: {user?.role || 'No definido'}</Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        height: 150,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        justifyContent: 'flex-end',
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
    scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 12 },
    cardText: { fontSize: 16, color: '#374151', marginBottom: 4 },
});
