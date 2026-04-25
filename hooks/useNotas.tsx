import { useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import { auth, db } from "../services/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query, doc, deleteDoc, updateDoc } from "firebase/firestore";
import * as Location from "expo-location";
import { salvarNotaUsuario } from "../services/userDataService";
import { useTranslation } from "react-i18next";
import { dispararNotificacaoLocal } from "../services/notificationService";

export type Nota = {
    id: string;
    titulo: string;
    descricao: string;
    localizacao?: { latitude: number; longitude: number } | null;
    endereco?: string;
};

export function useNotas() {
    const { t } = useTranslation();
    const [notas, setNotas] = useState<Nota[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");
    const [ordem, setOrdem] = useState("AZ");

    const [modalAddVisivel, setModalAddVisivel] = useState(false);
    const [modalEditarVisivel, setModalEditarVisivel] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [notaSelecionadaId, setNotaSelecionadaId] = useState("");
    const [localizacaoSelecionada, setLocalizacaoSelecionada] = useState<{ latitude: number; longitude: number } | null>(null);

    const obterEndereco = async (latitude: number, longitude: number) => {
        try {
            let resposta = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (resposta.length > 0) {
                let item = resposta[0];
                return `${item.street || "Rua desconhecida"}, ${item.streetNumber || "S/N"} - ${item.subregion || item.city}`;
            }
            return "Endereço não encontrado";
        } catch (error) {
            return "Erro ao obter endereço";
        }
    };

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

            unsubscribeNotas = onSnapshot(q, async (snapshot) => {
                const dadosBrutos = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Nota[];

                const dadosComEndereco = await Promise.all(
                    dadosBrutos.map(async (nota) => {
                        if (nota.localizacao) {
                            const endereco = await obterEndereco(nota.localizacao.latitude, nota.localizacao.longitude);
                            return { ...nota, endereco };
                        }
                        return nota;
                    }),
                );

                setNotas(dadosComEndereco);
                setLoading(false);
            });
        });
        return () => {
            unsubscribeAuth();
            if (unsubscribeNotas) unsubscribeNotas();
        };
    }, []);

    const handleSalvarNova = async () => {
        if (!titulo.trim() || !descricao.trim()) return Alert.alert(t("alert_warning"), t("alert_fill_fields"));

        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            let coords = null;
            if (status === "granted") {
                let location = await Location.getCurrentPositionAsync({});
                coords = { latitude: location.coords.latitude, longitude: location.coords.longitude };
            }

            const user = auth.currentUser;
            if (user) {
                await salvarNotaUsuario(user.uid, titulo.trim(), descricao.trim(), coords);

                // AÇÃO REQUERIDA: Notificação de confirmação (Tutorial pág. 7)
                await dispararNotificacaoLocal("Nota Criada!", `Sua nota "${titulo}" foi salva com sucesso.`);

                setTitulo("");
                setDescricao("");
                setModalAddVisivel(false);
            }
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

    const excluirNota = async (id: string) => {
        const user = auth.currentUser;
        if (user) await deleteDoc(doc(db, "usuarios", user.uid, "notas", id));
    };

    const notasFiltradasEOrdenadas = useMemo(() => {
        const filtradas = notas.filter((n) => n.titulo.toLowerCase().includes(busca.toLowerCase()));
        return filtradas.sort((a, b) => (ordem === "AZ" ? a.titulo.localeCompare(b.titulo) : b.titulo.localeCompare(a.titulo)));
    }, [busca, notas, ordem]);

    return {
        notas: notasFiltradasEOrdenadas,
        loading,
        busca,
        setBusca,
        ordem,
        setOrdem,
        modalAddVisivel,
        setModalAddVisivel,
        modalEditarVisivel,
        setModalEditarVisivel,
        titulo,
        setTitulo,
        descricao,
        setDescricao,
        localizacaoSelecionada,
        setLocalizacaoSelecionada,
        setNotaSelecionadaId,
        handleSalvarNova,
        handleAtualizarNota,
        excluirNota,
        t,
    };
}
