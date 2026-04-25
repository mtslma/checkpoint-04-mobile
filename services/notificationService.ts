import * as Notifications from "expo-notifications";

export async function solicitarPermissaoNotificacao() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    return finalStatus === "granted";
}

export async function dispararNotificacaoLocal(title: string, body: string) {
    console.log("Tentando disparar notificação...");
    await Notifications.scheduleNotificationAsync({
        content: {
            title: title,
            body: body,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: null,
    });
}
