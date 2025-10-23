import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background con formas decorativas */}
      <LinearGradient
        colors={['#4A5FD9', '#6B7FE8', '#8B9FF7']}
        style={styles.background}
      >
        {/* Círculos decorativos */}
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
        <View style={[styles.circle, styles.circle4]} />
      </LinearGradient>

      {/* Contenido principal */}
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Bienvenido!</Text>
          <Text style={styles.subtitle}>
            Eres parte de algo grande. {'\n'} Únete a nuestra comunidad y comienza tu viaje con nosotros.
          </Text>
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.signInButton}
            // onPress={() => router.push('/(auth)/signin' as any)}
            onPress={() => router.push('/signin' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.signInButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signUpButton}
            // onPress={() => router.push('/(auth)/signup' as any)}
            onPress={() => router.push('/signup' as any)}
            activeOpacity={0.8}
          >
            <Text style={styles.signUpButtonText}>Regístrate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4A5FD9',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: '#fff',
    top: -50,
    left: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    backgroundColor: '#fff',
    top: 100,
    right: -30,
  },
  circle3: {
    width: 250,
    height: 250,
    backgroundColor: '#1E3A8A',
    bottom: -80,
    left: -80,
  },
  circle4: {
    width: 180,
    height: 180,
    backgroundColor: '#fff',
    bottom: 150,
    right: -60,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: height * 0.25,
    paddingBottom: 60,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
  },
  signInButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  signUpButtonText: {
    color: '#4A5FD9',
    fontSize: 18,
    fontWeight: '600',
  },
});