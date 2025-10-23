import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, SearchParams } from 'expo-router';
import axios from 'axios';

const API_URL = 'http://192.168.18.76:7086/api/auth';

export default function ResetPasswordScreen({ params }: { params: SearchParams }) {
    const router = useRouter();

    const [otp, setOtp] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!otp || !password || !confirmPassword) { // aquí usa otp
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/reset-password`, {

                code: otp, // ✅ aquí lo usamos
                newPassword: password
            });

            Alert.alert('Éxito', 'Contraseña restablecida correctamente', [
                { text: 'OK', onPress: () => router.push('/signin') },
            ]);
        } catch (error: any) {
            console.error(error);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'No se pudo restablecer la contraseña'
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar style="light" />
            <LinearGradient colors={['#4A5FD9', '#6B7FE8']} style={styles.headerBackground}>
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
            </LinearGradient>

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.card}>
                    <Text style={styles.title}>Restablecer contraseña</Text>

                    {/* OTP */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Código de verificación</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="123456"
                            placeholderTextColor="#9CA3AF"
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType="numeric"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Nueva contraseña */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nueva contraseña</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="••••••••"
                                placeholderTextColor="#9CA3AF"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Confirmar contraseña */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirmar contraseña</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#9CA3AF"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleResetPassword}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Restablecer contraseña</Text>}
                    </TouchableOpacity>
                </View>
            </ScrollView>



        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    headerBackground: { position: 'absolute', top: 0, left: 0, right: 0, height: 200, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
    circle: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
    circle1: { width: 150, height: 150, top: -50, left: -30 },
    circle2: { width: 120, height: 120, top: 50, right: -20 },
    backButton: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingLeft: 20, paddingBottom: 20, gap: 8 },
    backText: { color: '#fff', fontSize: 16, fontWeight: '500' },
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
    card: { backgroundColor: '#fff', borderRadius: 24, padding: 24, marginTop: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 24 },
    inputContainer: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
    input: { backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#1F2937', borderWidth: 1, borderColor: '#E5E7EB' },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
    passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#1F2937' },
    eyeIcon: { padding: 12 },
    button: { backgroundColor: '#4A5FD9', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 12 },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
