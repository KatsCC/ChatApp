import { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { Friend, getFriendRequest } from "@/api/friends";
import ReceiveFriendItem from "../items/ReceiveFriendItem";

const ReceiveModal = () => {
  const [results, setResults] = useState<Friend[]>([]);

  const handleList = async () => {
    const response = await getFriendRequest();
    setResults(response.data);
  };
  useEffect(() => {
    handleList();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>받은 친구요청</Text>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ReceiveFriendItem
            id={item.requestId}
            username={item.senderUsername}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#282b30",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "#36393e",
    color: "white",
    fontSize: 16,
    borderRadius: 30,
    padding: 12,
    marginBottom: 15,
  },
  listContainer: {
    paddingBottom: 60,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#5A55FB",
    borderRadius: 30,
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ReceiveModal;
