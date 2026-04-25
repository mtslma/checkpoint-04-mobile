import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform, StatusBar } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export default function HomeHeader() {
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
                <TouchableOpacity style={styles.touchArea} onPress={toggleLanguage} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                    <Text style={styles.langHeaderTxt}>{i18n.language.startsWith("pt") ? "🇺🇸" : "🇧🇷"}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.touchArea} onPress={handleLogout} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
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
        alignItems: "center",
        // Adiciona espaçamento extra no topo para não grudar na barra de status (Tutorial pág. 10)
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        zIndex: 9999,
        elevation: 5,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    touchArea: {
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    langHeaderTxt: {
        fontSize: 24,
    },
    txtSair: {
        color: "#FF4444",
        fontWeight: "bold",
        fontSize: 16,
    },
});
