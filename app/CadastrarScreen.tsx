import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { criarPerfilUsuario } from "../services/userDataService";

export default function CadastroScreen() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCadastro = async () => {
        // Validação básica pra evitar dados vazios
        if (!nome.trim() || !email.trim() || !senha.trim()) {
            Alert.alert("Erro", "Preencha todos os campos!");
            return;
        }

        setLoading(true);

        try {
            console.log("Iniciando criação no Auth...");

            // Cria o usuário no Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), senha);
            const user = userCredential.user;

            console.log("Usuário criado. Salvando no Firestore...");

            // Cria o perfil do usuário no banco (Firestore)
            await criarPerfilUsuario({
                uid: user.uid,
                email: user.email,
                nome: nome.trim(),
            });

            // Salva localmente pra manter login
            await AsyncStorage.setItem("@user", JSON.stringify(user));

            console.log("Sucesso! Redirecionando...");

            setLoading(false);
            router.replace("/Home");
        } catch (error: any) {
            setLoading(false);

            console.error("Erro no cadastro:", error.code);
            Alert.alert("Erro", "Falha ao criar conta: " + error.message);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.titulo}>Criar Conta</Text>

                <TextInput style={styles.input} placeholder="Nome" placeholderTextColor="#999" value={nome} onChangeText={setNome} />

                <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#999" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

                <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#999" secureTextEntry value={senha} onChangeText={setSenha} />

                <TouchableOpacity style={styles.botao} onPress={handleCadastro} disabled={loading}>
                    {/* Feedback visual enquanto cria a conta */}
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.textoBotao}>Finalizar Cadastro</Text>}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F7FF",
    },
    inner: {
        flex: 1,
        justifyContent: "center",
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
});
