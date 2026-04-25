import { Stack } from "expo-router";
import { View } from "react-native";
import i18n from "../services/i18n";
import { I18nextProvider } from "react-i18next";

export default function Layout() {
    return (
        <View style={{ flex: 1 }}>
            <I18nextProvider i18n={i18n}>
                <Stack screenOptions={{ headerShown: false }} />
            </I18nextProvider>
        </View>
    );
}
