import { StyleSheet, View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ItemNotaProps {
    titulo: string;
    descricao: string;
    endereco?: string;
    onDeletePress: () => void;
    onEditPress: () => void;
}

export default function ItemNota({ titulo, descricao, endereco, onDeletePress, onEditPress }: ItemNotaProps) {
    return (
        <View style={styles.container}>
            <View style={styles.accentBar} />

            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.title} numberOfLines={1}>
                        {titulo}
                    </Text>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                    {descricao}
                </Text>

                {/* Seção de Endereço com mais espaço e destaque */}
                {endereco ? (
                    <View style={styles.locationWrapper}>
                        <View style={styles.locationBadge}>
                            <MaterialIcons name="location-on" size={16} color="#007AFF" />
                            <Text style={styles.enderecoText} numberOfLines={2}>
                                {endereco}
                            </Text>
                        </View>
                    </View>
                ) : (
                    <View style={styles.noLocationWrapper}>
                        <MaterialIcons name="location-off" size={14} color="#bbb" />
                        <Text style={styles.noLocationText}>Sem localização salva</Text>
                    </View>
                )}
            </View>

            <View style={styles.actions}>
                <Pressable onPress={onEditPress} style={({ pressed }) => [styles.iconButton, { backgroundColor: pressed ? "#f0f4ff" : "transparent" }]}>
                    <MaterialIcons name="edit" color="#007AFF" size={22} />
                </Pressable>

                <Pressable onPress={onDeletePress} style={({ pressed }) => [styles.iconButton, { backgroundColor: pressed ? "#fff0f0" : "transparent" }]}>
                    <MaterialIcons name="delete-outline" size={22} color="#FF4444" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        marginBottom: 12,
        alignItems: "stretch",
        borderWidth: 1,
        borderColor: "#f0f0f0",

        // Sombra mais suave e detalhada
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 3,
    },
    accentBar: {
        width: 5,
        backgroundColor: "#007AFF",
        borderTopLeftRadius: 14,
        borderBottomLeftRadius: 14,
    },
    content: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    headerRow: {
        marginBottom: 6,
    },
    title: {
        fontSize: 17,
        fontWeight: "700",
        color: "#1a1a1a",
    },
    description: {
        fontSize: 14,
        color: "#666",
        lineHeight: 20,
        marginBottom: 12, // Espaço extra antes do endereço
    },
    locationWrapper: {
        marginTop: 4,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#f9f9f9", // Divisória sutil interna
    },
    locationBadge: {
        flexDirection: "row",
        alignItems: "flex-start", // Alinha ao topo se o endereço quebrar linha
        backgroundColor: "rgba(0, 122, 255, 0.08)", // Fundo azul translúcido
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 8,
        gap: 6,
    },
    noLocationWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        gap: 4,
        opacity: 0.6,
    },
    enderecoText: {
        fontSize: 12,
        color: "#0056b3",
        fontWeight: "500",
        flex: 1,
        lineHeight: 16,
    },
    noLocationText: {
        fontSize: 12,
        color: "#888",
    },
    actions: {
        flexDirection: "column",
        justifyContent: "center",
        paddingRight: 8,
        gap: 8,
        borderLeftWidth: 1,
        borderLeftColor: "#f5f5f5",
    },
    iconButton: {
        padding: 10,
        borderRadius: 10,
    },
});
