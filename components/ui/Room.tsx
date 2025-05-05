import { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Dimensions,
  BackHandler,
} from "react-native";
import ChatHeader from "./ChatHeader";
import { useSharedValue, withTiming, Easing } from "react-native-reanimated";
import ChatInput from "./ChatInput";
import Sidebar from "./Sidebar";
import { useStompSockJS } from "@/hooks/useStompSockJS";
import ChatMessages from "./ChatMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  loadChatRoomDetail,
  prevMessage,
  recentMessage,
} from "@/api/chatRooms";

const { width } = Dimensions.get("window");

interface RoomProps {
  id: number | string;
  handleClose: () => void;
}

export interface Message {
  id: number;
  chatRoomId: number;
  senderId: string;
  senderName: string;
  memberImage: string;
  content: string;
  timestamp: string;
}

const Room: React.FC<RoomProps> = ({ id, handleClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [inputHeight, setInputHeight] = useState<number>(40);
  const [roomDetails, setRoomDetails] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const sidebarWidth = width * 0.5;
  const sidebarAnim = useSharedValue(sidebarWidth);
  const flatListRef = useRef<any>(null);

  const {
    sendMessage: stompSendMessage,
    subscribe,
    isConnected,
  } = useStompSockJS(`${process.env.EXPO_PUBLIC_API_URL}/ws`);

  // 로컬로 저장된 메시지 불러오기(AsyncStorage)
  useEffect(() => {
    const loadLocalMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem(
          `room_${id}_messages`
        );
        if (storedMessages !== null) {
          let parsedMessages: Message[] = JSON.parse(storedMessages);

          if (parsedMessages.length > 30) {
            parsedMessages = parsedMessages.slice(-30);
          }

          setMessages(parsedMessages);
          flatListRef.current?.scrollToEnd({ animated: true });
        }
      } catch (error) {
        console.error("로컬 메시지 불러오기 오류:", error);
      }
    };

    loadLocalMessages();
  }, [id]);

  // 서버 API를 통해 최신 메시지 불러오기 및 AsyncStorage 업데이트
  useEffect(() => {
    const fetchRecentMessages = async () => {
      try {
        console.log(messages[0]?.id, "1232");

        const response = await recentMessage(id);
        if (response.status === 200 && response.data) {
          let serverMessages: Message[] = response.data;
          if (serverMessages.length > 30) {
            serverMessages = serverMessages.slice(-30);
          }
          serverMessages.reverse();
          setMessages(serverMessages);
          flatListRef.current?.scrollToEnd({ animated: true });
          await AsyncStorage.setItem(
            `room_${id}_messages`,
            JSON.stringify(serverMessages)
          );
        }
      } catch (error) {
        console.error("서버 최신 메시지 불러오기 오류:", error);
      }
    };

    fetchRecentMessages();
  }, [id]);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const response = await loadChatRoomDetail(id);
        console.log(response.data, "date");
        setRoomDetails(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRoomDetail();
  }, [id]);

  // 스크롤이 위쪽 끝에 도달하면 이전 메시지 불러오기
  const fetchMoreMessages = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const firstMessageId = messages[0]?.id;
      if (!firstMessageId) {
        setLoadingMore(false);
        return;
      }

      const response = await prevMessage(id, firstMessageId);
      if (response.status === 200 && response.data) {
        let prevMessages: Message[] = response.data;
        if (prevMessages.length < 30) {
          setHasMore(false);
        }
        prevMessages.reverse();
        setMessages((prev) => [...prevMessages, ...prev]);
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error("이전 메시지 로드 오류:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleScroll = (event: any) => {
    if (event.nativeEvent.contentOffset.y < 0.1) {
      fetchMoreMessages();
    }
  };

  // STOMP 메시지 수신 구독
  useEffect(() => {
    if (isConnected) {
      const destination = `/topic/chat/rooms/${id}`;
      const subscription = subscribe(destination, (messageOutput) => {
        try {
          const receivedMessage: Message = JSON.parse(messageOutput.body);
          setMessages((prevMessages) => {
            const newMessages = [...prevMessages, receivedMessage];
            const limitedMessages =
              newMessages.length > 30 ? newMessages.slice(-30) : newMessages;
            AsyncStorage.setItem(
              `room_${id}_messages`,
              JSON.stringify(limitedMessages)
            );
            return limitedMessages;
          });
          flatListRef.current?.scrollToEnd({ animated: true });
        } catch (err) {
          console.error("메시지 파싱 오류:", err);
        }
      });
      return () => subscription?.unsubscribe();
    }
  }, [id, isConnected, subscribe]);

  // 키보드 이벤트 처리
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      if (sidebarOpen) {
        toggleSidebar();
        return true;
      }
      return false;
    };

    const backHandlerListener = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    return () => backHandlerListener.remove();
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    if (sidebarOpen) {
      sidebarAnim.value = withTiming(sidebarWidth, {
        duration: 150,
        easing: Easing.out(Easing.cubic),
      });
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
      sidebarAnim.value = withTiming(0, {
        duration: 150,
        easing: Easing.out(Easing.cubic),
      });
    }
  };

  const sendMessage = () => {
    if (inputText.trim() === "") return;
    stompSendMessage(String(id), inputText);
    setInputText("");
    setInputHeight(40);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <ChatHeader handleClose={handleClose} onMenuPress={toggleSidebar} />
        <ChatMessages
          messages={messages}
          flatListRef={flatListRef}
          onScroll={handleScroll}
        />
        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          inputHeight={inputHeight}
          setInputHeight={setInputHeight}
          sendMessage={sendMessage}
        />
        {sidebarOpen && (
          <Sidebar
            sidebarAnim={sidebarAnim}
            roomDetails={roomDetails}
            toggleSidebar={toggleSidebar}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#36393e",
  },
});

export default Room;
