import { StyleSheet, View, Alert, TextInput, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView, Text } from "react-native";
import ItemNota from "../components/ItemNota";
import HomeHeader from "../components/HomeHeader";
import NotaModal from "../components/NotaModal";
import { useNotas } from "../hooks/useNotas";

export default function Home() {
    const { notas, loading, busca, setBusca, ordem, setOrdem, modalAddVisivel, setModalAddVisivel, modalEditarVisivel, setModalEditarVisivel, titulo, setTitulo, descricao, setDescricao, localizacaoSelecionada, setLocalizacaoSelecionada, setNotaSelecionadaId, handleSalvarNova, handleAtualizarNota, excluirNota, t } = useNotas();

    return (
        <SafeAreaView style={styles.main}>
            <HomeHeader />

            <View style={styles.containerContent}>
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
                            setLocalizacaoSelecionada(null);
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
                        data={notas}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 25 }}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <ItemNota
                                titulo={item.titulo}
                                descricao={item.descricao}
                                endereco={item.endereco}
                                onDeletePress={() => {
                                    Alert.alert(t("alert_delete_title"), t("alert_delete_confirm"), [{ text: t("alert_no") }, { text: t("alert_yes"), onPress: () => excluirNota(item.id) }]);
                                }}
                                onEditPress={() => {
                                    setNotaSelecionadaId(item.id);
                                    setTitulo(item.titulo);
                                    setDescricao(item.descricao);
                                    setLocalizacaoSelecionada(item.localizacao || null);
                                    setModalEditarVisivel(true);
                                }}
                            />
                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>{t("empty_notes")}</Text>}
                    />
                )}
            </View>

            <NotaModal visivel={modalAddVisivel} tituloModal={t("modal_new_title")} tituloValue={titulo} descricaoValue={descricao} onSetTitulo={setTitulo} onSetDescricao={setDescricao} onFechar={() => setModalAddVisivel(false)} onSalvar={handleSalvarNova} textoBotaoSalvar={t("btn_create")} />

            <NotaModal visivel={modalEditarVisivel} tituloModal={t("modal_edit_title")} tituloValue={titulo} descricaoValue={descricao} location={localizacaoSelecionada} onSetTitulo={setTitulo} onSetDescricao={setDescricao} onFechar={() => setModalEditarVisivel(false)} onSalvar={handleAtualizarNota} textoBotaoSalvar={t("btn_save")} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: { flex: 1, backgroundColor: "#fff" },
    containerContent: { flex: 1 },
    topArea: { padding: 20, gap: 10 },
    searchRow: { flexDirection: "row", gap: 10, alignItems: "center" },
    searchInput: { flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5 },
    btnSort: { borderWidth: 1, borderColor: "#007AFF", padding: 10, borderRadius: 5, minWidth: 60, alignItems: "center" },
    txtSort: { color: "#007AFF", fontWeight: "bold" },
    botaoNova: { backgroundColor: "#007AFF", padding: 15, borderRadius: 5, alignItems: "center" },
    textoBotaoNova: { color: "#fff", fontWeight: "bold" },
    emptyText: { textAlign: "center", marginTop: 40, color: "#ccc" },
});
