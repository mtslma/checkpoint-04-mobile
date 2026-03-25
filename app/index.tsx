import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { auth } from "../services/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registrarUltimoLogin } from "../services/userDataService";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Se já tiver usuário salvo, nem mostra login — manda direto pra Home
        const verificarLogin = async () => {
            const userJSON = await AsyncStorage.getItem("@user");
            if (userJSON) router.replace("/Home");
        };

        verificarLogin();
    }, []);

    const handleLogin = async () => {
        // Evita tentar login com campos vazios
        if (!email.trim() || !senha.trim()) {
            Alert.alert("Atenção", "Informe e-mail e senha.");
            return;
        }

        setLoading(true);

        try {
            // Autentica no Firebase
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), senha);
            const user = userCredential.user;

            // Salva info útil (tipo último login)
            await registrarUltimoLogin(user.uid, user.email);

            // Guarda o usuário localmente pra não precisar logar sempre
            await AsyncStorage.setItem("@user", JSON.stringify(user));

            setLoading(false);
            router.replace("/Home");
        } catch (error) {
            setLoading(false);
            Alert.alert("Erro", "E-mail ou senha incorretos.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>App de Notas</Text>

            <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#999" value={email} onChangeText={setEmail} autoCapitalize="none" />

            <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#999" secureTextEntry value={senha} onChangeText={setSenha} />

            <TouchableOpacity style={styles.botao} onPress={handleLogin} disabled={loading}>
                {/* Mostra loader enquanto faz login (feedback pro usuário) */}
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.textoBotao}>Entrar</Text>}
            </TouchableOpacity>

            <Link href="/CadastrarScreen" style={styles.link}>
                Criar nova conta
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F7FF",
        padding: 25,
    },
    titulo: {
        fontSize: 28,
        fontWeight: "700",
        color: "#6A5ACD",
        marginBottom: 40,
        textAlign: "center",
    },
    input: {
        backgroundColor: "#FFFFFF",
        color: "#333",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E0D6FF",
    },
    botao: {
        backgroundColor: "#7B61FF",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        height: 56,
        justifyContent: "center",
        marginTop: 10,
    },
    textoBotao: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
    },
    link: {
        color: "#7B61FF",
        textAlign: "center",
        marginTop: 25,
        fontSize: 15,
        fontWeight: "500",
    },
});
