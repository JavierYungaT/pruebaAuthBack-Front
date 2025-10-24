# 🧠 Explicación de la arquitectura y decisiones técnicas adoptadas

## 🏗️ Backend

Tecnologías:

Java Spring Boot (por experiencia y robustez)

PostgreSQL

Spring Security

Spring Boot y Spring Security ofrecen una arquitectura sólida, con un ecosistema maduro para la implementación de JWT/OAuth2, fácil separación de capas y aplicación de buenas prácticas de desarrollo, junto con una base de datos confiable y escalable como PostgreSQL.

## 🔐 Autenticación

Mecanismos principales

Usuario + contraseña — las contraseñas se almacenan hasheadas con bcrypt (BCryptPasswordEncoder), aplicando políticas de validación de longitud y complejidad.

Passkeys / WebAuthn + OTP para recuperación y acceso alternativo.

WebAuthn / Passkeys (FIDO2) permiten autenticación sin contraseña mediante autenticadores biométricos (Face ID, Touch ID) o de hardware.
Esto proporciona un nivel de seguridad elevado, basado en criptografía de clave pública/privada.

OTP (One-Time Password) se utiliza como método de respaldo para recuperación o verificación adicional.
El sistema emite JWT para las sesiones y Refresh Tokens (almacenados y revocables para mayor seguridad).

## 🧾 Auditoría y estructura del backend

Cada acción genera un registro de auditoría.
El backend sigue un patrón en capas bien definido:

Controller → Service → Repository


Además, se implementan:

DTOs para transferencia de datos.

Validaciones con anotaciones de Bean Validation.

Pruebas unitarias básicas.

Logs estructurados para monitoreo y debugging.

## 🧱 Arquitectura general

El sistema está compuesto por los siguientes módulos:

Cliente Web: React

Cliente Móvil: React Native (Expo)

Backend API REST: Spring Boot

Base de datos: PostgreSQL

Correo electrónico (SMTP): envío de notificaciones y OTP

Componentes backend principales

AuthController: registro, login, logout, endpoints de WebAuthn y OTP

UserService, AuthService, WebAuthnService, AuditService, TokenService

Repositories (JPA): users, credentials, webauthn, tokens, audit_logs

## 🌐 Endpoints principales (REST)
Auth / User

POST /api/auth/register → {email, username, password}

POST /api/auth/login → {email, password} → returns { accessToken, refreshToken, expiresIn }

POST /api/auth/refresh → { refreshToken } → devuelve nuevo accessToken

POST /api/auth/logout → invalida refresh token (body o header Authorization)

POST /api/auth/forgot-password → { email } → envía OTP o enlace de recuperación

POST /api/auth/reset-password → { token/code, newPassword }

WebAuthn (Passkeys)

POST /api/auth/webauthn/register/options → inicia registro (challenge)

POST /api/auth/webauthn/register/verify → verifica y guarda credencial

POST /api/auth/webauthn/authenticate/options → inicia autenticación

POST /api/auth/webauthn/authenticate/verify → valida firma y emite JWT + refresh token

Administración / Usuarios

PUT /api/users/{id}/block → bloquea/desbloquea usuario

PUT /api/users/{id}/credentials → cambio de credenciales

GET /api/users/me → devuelve datos del usuario autenticado

GET /api/audit?userId=&action=&from=&to= → lista registros de auditoría (solo admin)

## 📱💻 Razón técnica del uso combinado de React y React Native

El proyecto implementa React para la aplicación web y React Native (con Expo) para la aplicación móvil.
Esta decisión busca mantener coherencia tecnológica, eficiencia de desarrollo y consistencia en la experiencia de usuario como por ejemplo:

- Ambas plataformas utilizan JavaScript/TypeScript y la arquitectura basada en componentes, lo que permite compartir lógica, validaciones y servicios comunes para consumir el backend REST de Spring Boot.

- La estructura modular facilita la escalabilidad, mantenibilidad y reduce la duplicación de código entre plataformas.

- Se logra una identidad visual y funcional coherente en web y móvil, garantizando continuidad en la interacción del usuario.

- React Native permite generar aplicaciones Android e iOS desde una única base de código, lo que acelera el desarrollo y reduce costos.

- React Native facilita el uso de autenticadores biométricos nativos (Face ID, Touch ID), alineándose con la estrategia de seguridad moderna definida en el backend.

# ⚙️ Ejecución del proyecto

## 🔹 1. Backend (Spring Boot con Gradle)
### 🧩 Requisitos previos

- Java 17 o superior

- Gradle

- PostgreSQL ejecutándose localmente

- Archivo application.properties configurado con tus credenciales de BD

### ▶️ Comandos

- cd backend
  
- ./gradlew build
  
- ./gradlew bootRun

## 🔹 2. Frontend Web (React + Vite)
### 🧩 Requisitos previos

- Node.js v18 o superior
  
- npm instalado

### ▶️ Comandos

- cd frontend-web
  
- npm install
  
- npm run dev

## 🔹 3. Aplicación móvil (React Native + Expo)
### 🧩 Requisitos previos

- Node.js
  
- Expo CLI (npm install -g expo-cli)
  
- Aplicación Expo Go instalada en tu dispositivo móvil

### ▶️ Comandos

- cd frontend-app-reactNative
  
- npm install
  
- npm start
  
- Escanea el código QR con la app Expo Go en tu teléfono para probar la app móvil.

# Funcionamiento.


## 💻 Pantallas Web.

Iniciar sesión

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2001.23.03.jpeg)

Registrarse

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2001.26.51%20(1).jpeg)

Iniciar sesión exitoso, me envia a un dashboard

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2001.23.41.jpeg)

Olvidaste tu contraseña

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2001.24.10.jpeg)

Me llega al correo el codigo para recuperar

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2001.25.32.jpeg)

Cambiar contraseña

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2001.26.07.jpeg)


## 📱 Pantallas App.

Pantalla inicial

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2014.10.48.jpeg)

Iniciar sesión

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2014.10.50.jpeg)

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2014.11.09%20(4).jpeg)

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2014.11.00.jpeg)

Ingreso al dashboard

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2014.10.52.jpeg)

Iniciar sesión con biométrico, el sistema reconcoce que el telefono no soporta.

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2014.11.07%20(3).jpeg)

Registrase

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2014.11.07%20(4).jpeg)

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2014.11.07.jpeg)

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2014.11.07%20(1).jpeg)

Recuperar contraseña

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2014.11.08%20(1).jpeg)

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2014.11.08%20(2).jpeg)

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2014.11.09%20(1).jpeg)

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2014.11.08%20(4).jpeg)

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2014.11.09%20(2).jpeg)

## Base de datos.

Eidencia que re registra en la DB

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2001.17.59.jpeg)

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2001.18.58.jpeg)

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2001.19.19.jpeg)

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2001.20.15.jpeg)

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2001.20.56.jpeg)

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2001.22.05.jpeg)

![](https://github.com/JavierYungaT/pruebaAuthBack-Front/blob/main/ImagenesFuncionamiento/ImagenesFuncionamiento/WhatsApp%20Image%202025-10-23%20at%2001.22.30.jpeg)

