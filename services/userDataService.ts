import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

type UsuarioBase = {
    uid: string;
    email: string | null;
};

// Cria o perfil do usuário
export async function criarPerfilUsuario(params: UsuarioBase & { nome?: string }) {
    const { uid, email, nome } = params;
    const data = {
        uid,
        email,
        nome: nome || "",
        atualizadoEm: serverTimestamp(),
        criadoEm: serverTimestamp(),
    };
    await setDoc(doc(db, "usuarios", uid), data, { merge: true });
}

export async function registrarUltimoLogin(uid: string, email: string | null) {
    await setDoc(
        doc(db, "usuarios", uid),
        {
            ultimoLoginEm: serverTimestamp(),
            atualizadoEm: serverTimestamp(),
        },
        { merge: true },
    );
}

// Salva a nota
export async function salvarNotaUsuario(uid: string, titulo: string, descricao: string, localizacao: { latitude: number; longitude: number } | null) {
    await addDoc(collection(db, "usuarios", uid, "notas"), {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        localizacao: localizacao,
        criadoEm: serverTimestamp(),
    });
}
