import { Stack } from "expo-router";
import { LogBox } from "react-native";
import { I18nextProvider } from "react-i18next";
import i18n from "../services/i18n";
import * as Notifications from "expo-notifications";

LogBox.ignoreLogs(["expo-notifications: Android Push notifications"]);

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export default function Layout() {
    return (
        <I18nextProvider i18n={i18n}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="Home" />
                <Stack.Screen name="CadastrarScreen" />
            </Stack>
        </I18nextProvider>
    );
}
