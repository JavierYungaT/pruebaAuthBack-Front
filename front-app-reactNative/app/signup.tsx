import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// const API_URL = 'http://localhost:7086/api/auth';
const API_URL = 'http://192.168.18.76:7086/api/auth';

export default function SignUp() {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    const passwordScore = (pw: string) => {
        if (!pw) return 0;
        let score = 0;
        if (pw.length >= 8) score += 1;
        if (/[A-Z]/.test(pw)) score += 1;
        if (/[0-9]/.test(pw)) score += 1;
        if (/[^A-Za-z0-9]/.test(pw)) score += 1;
        return score;
    };

    const getPasswordStrength = () => {
        const score = passwordScore(password);
        if (score <= 1) return { text: 'Débil', color: '#EF4444', width: 0.25 };
        if (score === 2) return { text: 'Media', color: '#F59E0B', width: 0.5 };
        if (score === 3) return { text: 'Buena', color: '#3B82F6', width: 0.75 };
        return { text: 'Excelente', color: '#10B981', width: 1 };
    };

    const handleSignUp = async () => {
        console.log('Botón Registrarme presionado');

        if (!fullName || !email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        // if (!agreeToTerms) {
        //     Alert.alert('Error', 'Debes aceptar los términos y condiciones');
        //     return;
        // }

        if (passwordScore(password) < 2) {
            Alert.alert('Error', 'La contraseña es muy débil. Usa al menos 8 caracteres con mayúsculas y números.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/register`, {
                username: fullName,
                email,
                password,
            });

            Alert.alert('Éxito', 'Cuenta creada exitosamente', [
                { text: 'OK', onPress: () => router.push('/signin' as any) }
            ]);
        } catch (error: any) {
            console.error(error);
            Alert.alert(
                'Error',
                error.response?.data?.message || 'Error al crear la cuenta'
            );
        } finally {
            setLoading(false);
        }
    };

    const strength = getPasswordStrength();

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar style="light" />

            {/* Background decorativo */}
            <LinearGradient
                colors={['#4A5FD9', '#6B7FE8']}
                style={styles.headerBackground}
            >
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
            </LinearGradient>

            {/* Botón Back */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Ionicons name="arrow-back" size={24} color="#fff" />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Card blanca */}
                <View style={styles.card}>
                    <Text style={styles.title}>Empezar</Text>

                    {/* Full Name Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Nombres completos</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Escriba los nombres completos"
                            placeholderTextColor="#9CA3AF"
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                        />
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Email"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Enter Password"
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
                                <Ionicons
                                    name={showPassword ? 'eye-off' : 'eye'}
                                    size={22}
                                    color="#9CA3AF"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* Password Strength Indicator */}
                        {password.length > 0 && (
                            <View style={styles.strengthContainer}>
                                <View style={styles.strengthBar}>
                                    <View
                                        style={[
                                            styles.strengthFill,
                                            { width: strength.width, backgroundColor: strength.color }
                                        ]}
                                    />
                                </View>
                                <View style={styles.strengthTextRow}>
                                    <Text style={[styles.strengthText, { color: strength.color }]}>
                                        Fortaleza: {strength.text}
                                    </Text>
                                    <Text style={styles.strengthScore}>
                                        {passwordScore(password)}/4
                                    </Text>
                                </View>
                                <Text style={styles.strengthHint}>
                                    Usa mayúsculas, números y símbolos especiales
                                </Text>
                            </View>
                        )}
                    </View>

                  
                    <TouchableOpacity
                        style={[styles.signUpButton, loading && styles.buttonDisabled]}
                        onPress={handleSignUp}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.signUpButtonText}>Registrarme</Text>
                        )}
                    </TouchableOpacity>

                

                    {/* Sign In Link */}
                    <View style={styles.signInRow}>
                        <Text style={styles.signInText}>¿Ya tienes una cuenta?  </Text>
                        <TouchableOpacity onPress={() => router.push('/signin' as any)}>
                            <Text style={styles.signInLink}>Inicia sesión</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    circle: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    circle1: {
        width: 150,
        height: 150,
        top: -50,
        left: -30,
    },
    circle2: {
        width: 120,
        height: 120,
        top: 50,
        right: -20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 60,
        paddingLeft: 20,
        paddingBottom: 20,
        gap: 8,
    },
    backText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1F2937',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    passwordInput: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#1F2937',
    },
    eyeIcon: {
        padding: 12,
    },
    strengthContainer: {
        marginTop: 12,
    },
    strengthBar: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        overflow: 'hidden',
    },
    strengthFill: {
        height: '100%',
        borderRadius: 3,
    },
    strengthTextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 6,
    },
    strengthText: {
        fontSize: 12,
        fontWeight: '600',
    },
    strengthScore: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    strengthHint: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 4,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 24,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#4A5FD9',
        borderColor: '#4A5FD9',
    },
    checkboxText: {
        fontSize: 13,
        color: '#6B7280',
        flex: 1,
    },
    linkText: {
        color: '#4A5FD9',
        fontWeight: '500',
    },
    signUpButton: {
        backgroundColor: '#4A5FD9',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#4A5FD9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    signUpButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    dividerText: {
        marginHorizontal: 12,
        fontSize: 14,
        color: '#9CA3AF',
    },
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 24,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signInRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signInText: {
        fontSize: 14,
        color: '#6B7280',
    },
    signInLink: {
        fontSize: 14,
        color: '#4A5FD9',
        fontWeight: '600',
    },
});