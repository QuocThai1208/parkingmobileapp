import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import API, { endpoints } from "../../configs/Apis";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const ios = Platform.OS === "ios";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { top } = useSafeAreaInsets();
  const nav = useNavigation();

  const fetchNotifications = async () => {
    setLoading(true);
    if (page === 0) return;
    try {
      const res = await API.get(endpoints["myNotification"]);
      if (res.status === 200) {
        setNotifications(res.data?.results);
      }
      if (res.data?.next === null) setPage(0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const isRead = async (id, is_read) => {
    if(is_read) return;
    try {
      const res = await API.patch(endpoints["isReadNotification"](id));
      if(res?.status === 200) {
        setNotifications((prev) =>
          prev.map((noti) =>
            noti.id === id ? { ...noti, is_read: true } : noti
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const loadMore = () => {
    if (!loading && page !== 0) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const getNotificationConfig = (type) => {
  switch (type) {
    case "FINANCE":
      return {
        name: "wallet-outline",
        color: "#2ecc71", // Xanh lá (Tiền)
        bgColor: "#e8f8f0", 
      };
    case "PARKING":
      return {
        name: "car-sport-outline", // Hoặc "map-outline"
        color: "#e67e22", // Cam (Cảnh báo đỗ xe)
        bgColor: "#fef5ed",
      };
    case "SYSTEM":
      return {
        name: "shield-checkmark-outline",
        color: "#3498db", // Xanh dương (Hệ thống/Bảo mật)
        bgColor: "#ebf5fb",
      };
    default:
      return {
        name: "notifications-outline",
        color: "#95a5a6",
        bgColor: "#f4f6f7",
      };
  }
};

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const renderItem = ({ item }) => {
    const config = getNotificationConfig(item.notification_type);

    return (
      <TouchableOpacity
        onPress={() => isRead(item.id, item.is_read)}
        style={[styles.notiItem, !item.is_read && styles.unreadBg]}
        activeOpacity={0.7}
      >
      <View style={[styles.iconWrapper, { backgroundColor: config.bgColor }]}>
        <Ionicons
          name={config.name}
          size={22}
          color={config.color}
        />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.notiTitle, !item.is_read && styles.boldText]}>
            {item.title}
          </Text>
          <Text style={styles.notiTime}>{item.created_date}</Text>
        </View>
        
        <Text style={styles.notiContent} numberOfLines={2}>
          {item.content}
        </Text>
        
        {/* Dấu chấm báo tin chưa đọc thiết kế phẳng */}
        {!item.is_read && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );
};

  // Đường kẻ phân cách giữa các item
  const renderSeparator = () => <View style={styles.separator} />;

  const headerComponent = () => (
    <LinearGradient
      colors={["#8781FF", "#BFBCFF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        paddingTop: ios ? top : top + 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "",
        paddingHorizontal: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => nav.goBack()}
        style={{ padding: 10, flex: 3 }}
      >
        <Ionicons color="white" name="arrow-back-outline" size={24} />
      </TouchableOpacity>
      <Text
        style={{ fontSize: 20, fontWeight: "bold", color: "white", flex: 7 }}
      >
        Thống báo
      </Text>
    </LinearGradient>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListHeaderComponent={headerComponent}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={{ paddingBottom: 20 }}
        endReached={loadMore}
        endReachedThreshold={0.5}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  
  // Header phẳng, không gradient màu mè
  flatHeader: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
  },
  headerText: { fontSize: 22, fontWeight: "700", color: "#2d3436" },
  readAllText: { color: "#6A5AE0", fontSize: 14 },

  // Item phẳng hoàn toàn
  notiItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "white",
    alignItems: "center",
  },
  unreadBg: {
    backgroundColor: "#F8F9FF", // Chỉ hơi đổi màu rất nhẹ khi chưa đọc
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f2f6",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    marginLeft: 15,
    position: 'relative'
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  notiTitle: { fontSize: 15, color: "#2d3436" },
  boldText: { fontWeight: "700" },
  notiContent: { fontSize: 14, color: "#636e72", lineHeight: 20 },
  notiTime: { fontSize: 12, color: "#95a5a6" },
  
  separator: {
    height: 0.5,
    backgroundColor: "#EDEDED",
    marginLeft: 75, // Kẻ từ phần text, để icon trống (kiểu iOS)
  },
  unreadDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6A5AE0",
  }
});
export default Notification;
