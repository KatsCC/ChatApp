import { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, FlatList, Text } from "react-native";
import { useDebounce } from "@/hooks/useDebounce";
import { searchFriends, Friend } from "@/api/friends";
import PlusFriendItem from "../items/PlusFriendItem";

const AddFriendModal: React.FC = () => {
  const [searchText, setSearchText] = useState<string>("");
  const [results, setResults] = useState<Friend[]>([]);
  const debouncedSearchText = useDebounce(searchText, 400);

  useEffect(() => {
    if (debouncedSearchText.trim() === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await searchFriends(debouncedSearchText.trim());
        setResults(response.data);
        console.log(response.data[0].email);
      } catch (error) {
        console.error("Failed to search friends", error);
      }
    };

    fetchResults();
  }, [debouncedSearchText]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>친구 신청</Text>
      <TextInput
        style={styles.input}
        placeholder="이메일 입력"
        placeholderTextColor="#aaa"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlusFriendItem
            id={item.id}
            username={item.username}
            email={item.email}
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

export default AddFriendModal;
