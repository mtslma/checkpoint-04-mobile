import { StyleSheet, View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ItemNotaProps {
    titulo: string;
    descricao: string;
    onDeletePress: () => void;
    onEditPress: () => void;
}

export default function ItemNota({ titulo, descricao, onDeletePress, onEditPress }: ItemNotaProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{titulo}</Text>
                <Text style={styles.description} numberOfLines={1}>
                    {descricao}
                </Text>
            </View>
            <View style={styles.actions}>
                <Pressable onPress={onEditPress} style={styles.iconButton}>
                    <MaterialIcons name="edit" color="#7B61FF" size={22} />
                </Pressable>
                <Pressable onPress={onDeletePress} style={styles.iconButton}>
                    <MaterialIcons name="delete" size={22} color="#FF4444" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#E0D6FF",
        marginBottom: 10,
        alignItems: "center",
    },
    content: { flex: 1 },
    title: { fontSize: 16, fontWeight: "600", color: "#333" },
    description: { fontSize: 13, color: "#777", marginTop: 2 },
    actions: { flexDirection: "row", gap: 12 },
    iconButton: { padding: 4 },
});
