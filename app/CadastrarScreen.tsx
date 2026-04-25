import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { criarPerfilUsuario } from "../services/userDataService";
import { useTranslation } from "react-i18next";

export default function CadastroScreen() {
    const { t } = useTranslation();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCadastro = async () => {
        if (!nome.trim() || !email.trim() || !senha.trim()) {
            Alert.alert(t("register_error_title"), t("register_error_fields"));
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), senha);
            const user = userCredential.user;

            await criarPerfilUsuario({
                uid: user.uid,
                email: user.email,
                nome: nome.trim(),
            });

            await AsyncStorage.setItem("@user", JSON.stringify(user));

            setLoading(false);
            router.replace("/Home");
        } catch (error: any) {
            setLoading(false);
            Alert.alert(t("register_error_title"), t("register_error_fail") + error.message);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <View style={styles.inner}>
                <Text style={styles.titulo}>{t("register_title")}</Text>

                <TextInput style={styles.input} placeholder={t("name_placeholder")} placeholderTextColor="#ccc" value={nome} onChangeText={setNome} />

                <TextInput style={styles.input} placeholder={t("email_placeholder")} placeholderTextColor="#ccc" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

                <TextInput style={styles.input} placeholder={t("password_placeholder")} placeholderTextColor="#ccc" secureTextEntry value={senha} onChangeText={setSenha} />

                <TouchableOpacity style={styles.botao} onPress={handleCadastro} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.textoBotao}>{t("register_button")}</Text>}
                </TouchableOpacity>

                {/* Botão para voltar para a index.tsx */}
                <TouchableOpacity onPress={() => router.push("/")}>
                    <Text style={styles.linkText}>{t("btn_back")}</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff", // Fundo branco igual à index
    },
    inner: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    titulo: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
        color: "#333",
    },
    botao: {
        backgroundColor: "#007AFF", // Azul padrão da index
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    textoBotao: {
        color: "#fff",
        fontWeight: "bold",
    },
    linkText: {
        color: "#007AFF",
        marginTop: 15,
        textAlign: "center",
    },
});
