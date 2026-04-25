import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { useTranslation } from "react-i18next"; // Importe o hook

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { t, i18n } = useTranslation(); // Inicialize o hook

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("/Home");
        } catch (error: any) {
            Alert.alert(t("login_error"), error.message);
        }
    };

    const toggleLanguage = () => {
        const newLang = i18n.language === "pt" ? "en" : "pt";
        i18n.changeLanguage(newLang);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{t("welcome")}</Text>

            <TextInput style={styles.input} placeholder={t("email_placeholder")} value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder={t("password_placeholder")} secureTextEntry value={password} onChangeText={setPassword} />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>{t("login_button")}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/CadastrarScreen")}>
                <Text style={styles.linkText}>{t("go_to_register")}</Text>
            </TouchableOpacity>

            {/* Botão de mudar idioma */}
            <TouchableOpacity style={styles.langButton} onPress={toggleLanguage}>
                <Text style={styles.langButtonText}>{i18n.language === "pt" ? "Switch to English 🇺🇸" : "Mudar para Português 🇧🇷"}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 5 },
    button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 5, alignItems: "center" },
    buttonText: { color: "#fff", fontWeight: "bold" },
    linkText: { color: "#007AFF", marginTop: 15, textAlign: "center" },
    langButton: { marginTop: 30, padding: 10, borderWidth: 1, borderColor: "#007AFF", borderRadius: 5 },
    langButtonText: { color: "#007AFF", textAlign: "center" },
});
