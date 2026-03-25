import { Text, StyleSheet, View, Alert, TextInput, KeyboardAvoidingView, Platform, FlatList, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { auth, db } from "../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import ItemNota from "./components/ItemNota";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useMemo } from "react";
import { salvarNotaUsuario } from "../services/userDataService";
import { collection, onSnapshot, orderBy, query, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";

type Nota = {
    id: string;
    titulo: string;
    descricao: string;
};

type Ordem = "AZ" | "ZA";

export default function Home() {
    const [notas, setNotas] = useState<Nota[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ordem, setOrdem] = useState<Ordem>("AZ");
    const router = useRouter();

    // Estados dos modais (abrir/fechar e dados digitados)
    const [modalAddVisivel, setModalAddVisivel] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");

    const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
    const [notaSelecionadaId, setNotaSelecionadaId] = useState("");
    const [novoTitulo, setNovoTitulo] = useState("");
    const [novaDescricao, setNovaDescricao] = useState("");

    useEffect(() => {
        let unsubscribeNotas: (() => void) | undefined;

        // Observa se o usuário está logado ou não
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (!user) {
                setNotas([]);
                setLoading(false);
                return;
            }

            // Puxa as notas do usuário em tempo real (Firestore)
            const notasRef = collection(db, "usuarios", user.uid, "notas");
            const q = query(notasRef, orderBy("criadoEm", "desc"));

            unsubscribeNotas = onSnapshot(q, (snapshot) => {
                const dados = snapshot.docs.map(
                    (d) =>
                        ({
                            id: d.id,
                            titulo: d.data().titulo || "",
                            descricao: d.data().descricao || "",
                        }) as Nota,
                );

                setNotas(dados);
                setLoading(false);
            });
        });

        // Limpa os listeners quando o componente desmonta (evita bug chato)
        return () => {
            unsubscribeAuth();
            if (unsubscribeNotas) unsubscribeNotas();
        };
    }, []);

    // Aqui a mágica acontece: filtra pelo texto e ordena A-Z ou Z-A
    const notasFiltradasEOrdenadas = useMemo(() => {
        const filtradas = notas.filter((n) => n.titulo.toLowerCase().includes(busca.toLowerCase()));

        return filtradas.sort((a, b) => {
            if (ordem === "AZ") {
                return a.titulo.localeCompare(b.titulo);
            } else {
                return b.titulo.localeCompare(a.titulo);
            }
        });
    }, [busca, notas, ordem]);

    const handleSalvarNova = async () => {
        // Validação simples pra não salvar nota vazia
        if (!titulo.trim() || !descricao.trim()) {
            return Alert.alert("Aviso", "Preencha tudo.");
        }

        const user = auth.currentUser;
        if (!user) return;

        try {
            await salvarNotaUsuario(user.uid, titulo.trim(), descricao.trim());

            // Limpa os campos depois de salvar (UX melhorzinha)
            setTitulo("");
            setDescricao("");
            setModalAddVisivel(false);
        } catch (e) {
            Alert.alert("Erro", "Falha ao salvar.");
        }
    };

    const excluirNota = (nota: Nota) => {
        Alert.alert("Excluir", "Deseja apagar esta nota?", [
            { text: "Não" },
            {
                text: "Sim",
                onPress: async () => {
                    const user = auth.currentUser;
                    if (!user) return;

                    // Remove direto do Firestore
                    await deleteDoc(doc(db, "usuarios", user.uid, "notas", nota.id));
                },
            },
        ]);
    };

    const atualizarNota = async () => {
        const user = auth.currentUser;
        if (!user || !novoTitulo.trim()) return;

        try {
            await updateDoc(doc(db, "usuarios", user.uid, "notas", notaSelecionadaId), {
                titulo: novoTitulo.trim(),
                descricao: novaDescricao.trim(),
            });

            setModalEditarVisivel(false);
        } catch (e) {
            Alert.alert("Erro", "Falha ao editar.");
        }
    };

    return (
        <SafeAreaView style={styles.main}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Minhas Notas</Text>

                {/* Botão de logout */}
                <TouchableOpacity
                    onPress={async () => {
                        await AsyncStorage.removeItem("@user");
                        router.replace("/");
                    }}
                >
                    <Text style={styles.txtSair}>Sair</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.topArea}>
                <View style={styles.searchRow}>
                    <TextInput style={styles.searchInput} placeholder="Pesquisar..." placeholderTextColor="#999" value={busca} onChangeText={setBusca} />

                    {/* Alterna ordenação */}
                    <TouchableOpacity style={styles.btnSort} onPress={() => setOrdem(ordem === "AZ" ? "ZA" : "AZ")}>
                        <Text style={styles.txtSort}>{ordem === "AZ" ? "A-Z" : "Z-A"}</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.botaoNova} onPress={() => setModalAddVisivel(true)}>
                    <Text style={styles.textoBotaoNova}>+ Nova Nota</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                // Loader enquanto busca as notas
                <ActivityIndicator size="large" color="#7B61FF" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={notasFiltradasEOrdenadas}
                    contentContainerStyle={{ paddingHorizontal: 25, paddingBottom: 25 }}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ItemNota
                            titulo={item.titulo}
                            descricao={item.descricao}
                            onDeletePress={() => excluirNota(item)}
                            onEditPress={() => {
                                // Preenche os dados pra edição
                                setNotaSelecionadaId(item.id);
                                setNovoTitulo(item.titulo);
                                setNovaDescricao(item.descricao);
                                setModalEditarVisivel(true);
                            }}
                        />
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma nota encontrada.</Text>}
                />
            )}

            {/* MODAL DE CRIAÇÃO */}
            <Modal visible={modalAddVisivel} animationType="slide" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitulo}>Nova Nota</Text>

                        <TextInput style={styles.modalInput} placeholder="Título" placeholderTextColor="#999" value={titulo} onChangeText={setTitulo} />

                        <TextInput style={[styles.modalInput, { height: 100, textAlignVertical: "top" }]} placeholder="Conteúdo..." placeholderTextColor="#999" multiline value={descricao} onChangeText={setDescricao} />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.btnCancel} onPress={() => setModalAddVisivel(false)}>
                                <Text>Voltar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.btnSave} onPress={handleSalvarNova}>
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>Criar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* MODAL DE EDIÇÃO */}
            <Modal visible={modalEditarVisivel} animationType="fade" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitulo}>Editar Nota</Text>

                        <TextInput style={styles.modalInput} value={novoTitulo} onChangeText={setNovoTitulo} />

                        <TextInput style={[styles.modalInput, { height: 100, textAlignVertical: "top" }]} multiline value={novaDescricao} onChangeText={setNovaDescricao} />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.btnCancel} onPress={() => setModalEditarVisivel(false)}>
                                <Text>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.btnSave} onPress={atualizarNota}>
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#F8F7FF",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 25,
        alignItems: "center",
        backgroundColor: "#FFF",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#6A5ACD",
    },
    txtSair: {
        color: "#FF4444",
        fontWeight: "600",
    },
    topArea: {
        paddingHorizontal: 25,
        paddingBottom: 15,
        gap: 10,
    },
    searchRow: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    searchInput: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E0D6FF",
        color: "#333",
    },
    btnSort: {
        backgroundColor: "#FFF",
        paddingHorizontal: 12,
        height: 50,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E0D6FF",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 65,
    },
    txtSort: {
        fontSize: 14,
        color: "#7B61FF",
        fontWeight: "700",
    },
    botaoNova: {
        backgroundColor: "#7B61FF",
        padding: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    textoBotaoNova: {
        color: "#FFF",
        fontWeight: "700",
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        padding: 25,
    },
    modalContainer: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        gap: 15,
    },
    modalTitulo: {
        fontSize: 18,
        fontWeight: "700",
        color: "#6A5ACD",
        textAlign: "center",
    },
    modalInput: {
        backgroundColor: "#F8F7FF",
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#E0D6FF",
        color: "#333",
    },
    modalButtons: {
        flexDirection: "row",
        gap: 10,
    },
    btnCancel: {
        flex: 1,
        alignItems: "center",
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#F0F0F0",
    },
    btnSave: {
        flex: 1,
        alignItems: "center",
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#7B61FF",
    },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        color: "#999",
    },
});
