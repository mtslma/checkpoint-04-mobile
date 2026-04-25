import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export function HomeHeader() {
    const { t, i18n } = useTranslation();
    const router = useRouter();

    const toggleLanguage = () => {
        const newLang = i18n.language.startsWith("pt") ? "en" : "pt";
        i18n.changeLanguage(newLang);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            await AsyncStorage.removeItem("@user");
            router.replace("/");
        } catch (error) {
            Alert.alert(t("alert_error"), "Erro ao sair");
        }
    };

    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>{t("home_title")}</Text>
            <View style={styles.headerActions}>
                <TouchableOpacity style={styles.langHeaderBtn} onPress={toggleLanguage}>
                    <Text style={styles.langHeaderTxt}>{i18n.language.startsWith("pt") ? "🇺🇸" : "🇧🇷"}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.txtSair}>{t("logout")}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 20,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    headerTitle: { fontSize: 20, fontWeight: "bold" },
    headerActions: { flexDirection: "row", alignItems: "center", gap: 15 },
    langHeaderBtn: { padding: 5 },
    langHeaderTxt: { fontSize: 22 },
    txtSair: { color: "#FF4444", fontWeight: "bold" },
});
