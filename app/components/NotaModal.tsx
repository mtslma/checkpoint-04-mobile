import { Modal, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

interface NotaModalProps {
    visivel: boolean;
    tituloModal: string;
    tituloValue: string;
    descricaoValue: string;
    onSetTitulo: (t: string) => void;
    onSetDescricao: (d: string) => void;
    onFechar: () => void;
    onSalvar: () => void;
    textoBotaoSalvar: string;
}

export function NotaModal({ visivel, tituloModal, tituloValue, descricaoValue, onSetTitulo, onSetDescricao, onFechar, onSalvar, textoBotaoSalvar }: NotaModalProps) {
    const { t } = useTranslation();

    return (
        <Modal visible={visivel} animationType="fade" transparent>
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalContainer}>
                    <Text style={styles.modalTitulo}>{tituloModal}</Text>

                    <TextInput style={styles.input} placeholder={t("input_title")} placeholderTextColor="#ccc" value={tituloValue} onChangeText={onSetTitulo} />

                    <TextInput style={[styles.input, { height: 100, textAlignVertical: "top" }]} placeholder={t("input_content")} placeholderTextColor="#ccc" multiline value={descricaoValue} onChangeText={onSetDescricao} />

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
    modalContainer: { backgroundColor: "#fff", borderRadius: 10, padding: 20, gap: 15 },
    modalTitulo: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
    input: { borderWidth: 1, borderColor: "#929292", padding: 10, borderRadius: 5, color: "#333" },
    modalButtons: { flexDirection: "row", gap: 10, marginTop: 10 },
    button: { backgroundColor: "#007AFF", padding: 15, borderRadius: 5, alignItems: "center" },
    buttonText: { color: "#fff", fontWeight: "bold" },
});
