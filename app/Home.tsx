import { Text, StyleSheet, View, Alert, TextInput, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView } from "react-native";
import { auth, db } from "../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import ItemNota from "./components/ItemNota";
import { HomeHeader } from "./components/HomeHeader";
import { NotaModal } from "./components/NotaModal";
import { useState, useEffect, useMemo } from "react";
import { salvarNotaUsuario } from "../services/userDataService";
import { collection, onSnapshot, orderBy, query, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

type Nota = { id: string; titulo: string; descricao: string };
type Ordem = "AZ" | "ZA";

export default function Home() {
    const { t } = useTranslation();
    const [notas, setNotas] = useState<Nota[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ordem, setOrdem] = useState<Ordem>("AZ");

    // Estados dos Modais e Inputs
    const [modalAddVisivel, setModalAddVisivel] = useState(false);
    const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [notaSelecionadaId, setNotaSelecionadaId] = useState("");

    useEffect(() => {
        let unsubscribeNotas: (() => void) | undefined;
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setNotas([]);
                setLoading(false);
                return;
            }

            const notasRef = collection(db, "usuarios", user.uid, "notas");
            const q = query(notasRef, orderBy("criadoEm", "desc"));

            unsubscribeNotas = onSnapshot(q, (snapshot) => {
                const dados = snapshot.docs.map((d) => ({
                    id: d.id,
                    titulo: d.data().titulo || "",
                    descricao: d.data().descricao || "",
                })) as Nota[];
                setNotas(dados);
                setLoading(false);
            });
        });
        return () => {
            unsubscribeAuth();
            if (unsubscribeNotas) unsubscribeNotas();
        };
    }, []);

    const notasFiltradasEOrdenadas = useMemo(() => {
        const filtradas = notas.filter((n) => n.titulo.toLowerCase().includes(busca.toLowerCase()));
        return filtradas.sort((a, b) => (ordem === "AZ" ? a.titulo.localeCompare(b.titulo) : b.titulo.localeCompare(a.titulo)));
    }, [busca, notas, ordem]);

    const handleSalvarNova = async () => {
        if (!titulo.trim() || !descricao.trim()) return Alert.alert(t("alert_warning"), t("alert_fill_fields"));
        const user = auth.currentUser;
        if (!user) return;
        try {
            await salvarNotaUsuario(user.uid, titulo.trim(), descricao.trim());
            setTitulo("");
            setDescricao("");
            setModalAddVisivel(false);
        } catch (e) {
            Alert.alert(t("alert_error"), t("alert_save_fail"));
        }
    };

    const handleAtualizarNota = async () => {
        const user = auth.currentUser;
        if (!user || !titulo.trim()) return;
        try {
            await updateDoc(doc(db, "usuarios", user.uid, "notas", notaSelecionadaId), {
                titulo: titulo.trim(),
                descricao: descricao.trim(),
            });
            setModalEditarVisivel(false);
        } catch (e) {
            Alert.alert(t("alert_error"), t("alert_edit_fail"));
        }
    };

    const excluirNota = (nota: Nota) => {
        Alert.alert(t("alert_delete_title"), t("alert_delete_confirm"), [
            { text: t("alert_no") },
            {
                text: t("alert_yes"),
                onPress: async () => {
                    const user = auth.currentUser;
                    if (user) await deleteDoc(doc(db, "usuarios", user.uid, "notas", nota.id));
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.main}>
            <HomeHeader />

            <View style={styles.topArea}>
                <View style={styles.searchRow}>
                    <TextInput style={styles.searchInput} placeholder={t("search_placeholder")} placeholderTextColor="#ccc" value={busca} onChangeText={setBusca} />
                    <TouchableOpacity style={styles.btnSort} onPress={() => setOrdem(ordem === "AZ" ? "ZA" : "AZ")}>
                        <Text style={styles.txtSort}>{ordem === "AZ" ? "A-Z" : "Z-A"}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.botaoNova}
                    onPress={() => {
                        setTitulo("");
                        setDescricao("");
                        setModalAddVisivel(true);
                    }}
                >
                    <Text style={styles.textoBotaoNova}>{t("new_note_button")}</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={notasFiltradasEOrdenadas}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 25 }}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ItemNota
                            titulo={item.titulo}
                            descricao={item.descricao}
                            onDeletePress={() => excluirNota(item)}
                            onEditPress={() => {
                                setNotaSelecionadaId(item.id);
                                setTitulo(item.titulo);
                                setDescricao(item.descricao);
                                setModalEditarVisivel(true);
                            }}
                        />
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>{t("empty_notes")}</Text>}
                />
            )}

            {/* Modais */}
            <NotaModal visivel={modalAddVisivel} tituloModal={t("modal_new_title")} tituloValue={titulo} descricaoValue={descricao} onSetTitulo={setTitulo} onSetDescricao={setDescricao} onFechar={() => setModalAddVisivel(false)} onSalvar={handleSalvarNova} textoBotaoSalvar={t("btn_create")} />

            <NotaModal visivel={modalEditarVisivel} tituloModal={t("modal_edit_title")} tituloValue={titulo} descricaoValue={descricao} onSetTitulo={setTitulo} onSetDescricao={setDescricao} onFechar={() => setModalEditarVisivel(false)} onSalvar={handleAtualizarNota} textoBotaoSalvar={t("btn_save")} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: { flex: 1, backgroundColor: "#fff" },
    topArea: { padding: 20, gap: 10 },
    searchRow: { flexDirection: "row", gap: 10, alignItems: "center" },
    searchInput: { flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5 },
    btnSort: { borderWidth: 1, borderColor: "#007AFF", padding: 10, borderRadius: 5, minWidth: 60, alignItems: "center" },
    txtSort: { color: "#007AFF", fontWeight: "bold" },
    botaoNova: { backgroundColor: "#007AFF", padding: 15, borderRadius: 5, alignItems: "center" },
    textoBotaoNova: { color: "#fff", fontWeight: "bold" },
    emptyText: { textAlign: "center", marginTop: 40, color: "#ccc" },
});
