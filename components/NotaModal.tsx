import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useTranslation } from "react-i18next";

interface NotaModalProps {
    visivel: boolean;
    tituloModal: string;
    tituloValue: string;
    descricaoValue: string;
    location?: { latitude: number; longitude: number } | null;
    onSetTitulo: (t: string) => void;
    onSetDescricao: (d: string) => void;
    onFechar: () => void;
    onSalvar: () => void;
    textoBotaoSalvar: string;
}

export default function NotaModal({ visivel, tituloModal, tituloValue, descricaoValue, location, onSetTitulo, onSetDescricao, onFechar, onSalvar, textoBotaoSalvar }: NotaModalProps) {
    const { t } = useTranslation();

    return (
        <Modal visible={visivel} animationType="fade" transparent>
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
                    <Text style={styles.modalTitulo}>{tituloModal}</Text>
                    <TextInput style={styles.input} placeholder={t("input_title")} value={tituloValue} onChangeText={onSetTitulo} />
                    <TextInput style={[styles.input, { height: 60, textAlignVertical: "top" }]} placeholder={t("input_content")} multiline value={descricaoValue} onChangeText={onSetDescricao} />

                    {location && (
                        <View style={styles.mapSection}>
                            <Text style={styles.coordsText}>
                                Lat: {location.latitude.toFixed(4)} | Long: {location.longitude.toFixed(4)}
                            </Text>
                            <View style={styles.mapContainer}>
                                <MapView
                                    style={styles.map}
                                    initialRegion={{
                                        latitude: location.latitude,
                                        longitude: location.longitude,
                                        latitudeDelta: 0.005,
                                        longitudeDelta: 0.005,
                                    }}
                                >
                                    <Marker coordinate={location} title={tituloValue} pinColor="hotpink" />
                                </MapView>
                            </View>
                        </View>
                    )}

                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: "#ccc", flex: 1 }]} onPress={onFechar}>
                            <Text style={styles.buttonText}>{t("btn_cancel")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { flex: 1 }]} onPress={onSalvar}>
                            <Text style={styles.buttonText}>{textoBotaoSalvar}</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 },
    modalContainer: { backgroundColor: "#fff", borderRadius: 10, padding: 20, gap: 10 },
    modalTitulo: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, color: "#333" },
    mapSection: { marginVertical: 5 },
    coordsText: { fontSize: 12, color: "#666", marginBottom: 5, textAlign: "center", fontWeight: "bold" },
    mapContainer: { height: 180, width: "100%", borderRadius: 10, overflow: "hidden", borderWidth: 1, borderColor: "#ddd" },
    map: { width: "100%", height: "100%" },
    modalButtons: { flexDirection: "row", gap: 10, marginTop: 5 },
    button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 5, alignItems: "center" },
    buttonText: { color: "#fff", fontWeight: "bold" },
});
