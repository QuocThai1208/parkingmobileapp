import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import API, { endpoints } from "../../configs/Apis";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ios = Platform.OS == "ios";

const BookingHistory = () => {
  const nav = useNavigation();
  const { top } = useSafeAreaInsets();
  const [history, setHistory] = useState([]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return { color: "#D68910", bg: "#FEF9E7", text: "Chờ nhận xe" };
      case "ACTIVE":
        return { color: "#2E86C1", bg: "#EBF5FB", text: "Đã xác nhận" };
      case "PARKING":
        return { color: "#8E44AD", bg: "#F5EEF8", text: "Đang đỗ" };
      case "COMPLETED":
        return { color: "#239B56", bg: "#EAFAF1", text: "Đã sử dụng" };
      case "EXPIRED":
        return { color: "#CB4335", bg: "#FDEDEC", text: "Đã quá hạn" };
      default:
        return {
          color: "#7F8C8D",
          bg: "#F8F9F9",
          text: status || "Không xác định",
        };
    }
  };

  const fetchBookingHistory = async () => {
    try {
      const res = await API.get(endpoints.bookings);
      setHistory(res.data);
    } catch (e) {
      console.log("error fetchBookingHistory: ", e);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  const renderItem = ({ item }) => {
    const statusStyle = getStatusStyle(item.status);

    return (
      <TouchableOpacity style={styles.card}>
        {/* Header của Card: Tên bãi xe và Trạng thái */}
        <View style={styles.cardHeader}>
          <View style={styles.lotInfo}>
            <Ionicons name="business" size={20} color="#6A5AE0" />
            <Text style={styles.lotName} numberOfLines={1}>
              {item.lot_name}
            </Text>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}
          >
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {statusStyle.text}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Body của Card: Thông tin xe và vị trí */}
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <View style={styles.mainInfo}>
              <Text style={styles.label}>Vị trí đỗ</Text>
              <Text style={styles.value}>{item.slot_number}</Text>
            </View>
            <View style={styles.mainInfo}>
              <Text style={styles.label}>Phương tiện</Text>
              <Text style={styles.value}>{item.vehicle_name}</Text>
            </View>
            <View style={styles.mainInfo}>
              <Text style={styles.label}>Tiền cọc</Text>
              <Text style={[styles.value, { color: "#E67E22" }]}>
                {item.deposit_amount.toLocaleString()}đ
              </Text>
            </View>
          </View>

          {/* Thời gian */}
          <View style={styles.timeSection}>
            <View style={styles.timeLine}>
              <Ionicons name="time-outline" size={16} color="#B2BEC3" />
              <Text style={styles.timeText}>
                {item.start_time.split(" ")[1] == item.end_time.split(" ")[1]
                  ? `${item.start_time.split(" ")[1]} - ${item.end_time}`
                  : `${item.start_time} - ${item.end_time}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer: Mã đặt chỗ */}
        <View style={styles.cardFooter}>
          <Text style={styles.bookingId}>Mã đặt chỗ: #{item.id}</Text>
          <Ionicons name="chevron-forward" size={18} color="#B2BEC3" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#8781FF", "#BFBCFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingTop: ios ? top : top + 10,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 15,
          paddingBottom: 15,
          justifyContent: "center",
          position: "relative",
        }}
      >
        <TouchableOpacity
          onPress={() => nav.goBack()}
          style={{
            marginRight: 10,
            position: "absolute",
            left: 20,
            bottom: 10,
          }}
        >
          <Ionicons color="white" name="arrow-back-outline" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lịch sử đặt chỗ</Text>
      </LinearGradient>

      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={80} color="#DCDDE1" />
            <Text style={styles.emptyText}>
              Bạn chưa có lịch sử đặt chỗ nào.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default BookingHistory;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    paddingTop: 60,
    paddingBottom: 25,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "800" },
  listContent: { padding: 12 },

  // Card Styles
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  lotInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  lotName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D3436",
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { fontSize: 11, fontWeight: "800" },
  divider: { height: 1, backgroundColor: "#F1F3F5", marginBottom: 12 },

  cardBody: { marginBottom: 12 },
  infoRow: { flexDirection: "row", justifyContent: "space-between" },
  mainInfo: { flex: 1 },
  label: { fontSize: 11, color: "#B2BEC3", marginBottom: 4 },
  value: { fontSize: 14, fontWeight: "700", color: "#2D3436" },

  timeSection: {
    marginTop: 12,
    backgroundColor: "#F8F9FA",
    padding: 8,
    borderRadius: 10,
  },
  timeLine: { flexDirection: "row", alignItems: "center" },
  timeText: {
    fontSize: 12,
    color: "#636E72",
    marginLeft: 6,
    fontWeight: "500",
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  bookingId: { fontSize: 12, color: "#B2BEC3", fontStyle: "italic" },

  emptyContainer: { alignItems: "center", marginTop: 100 },
  emptyText: { color: "#B2BEC3", marginTop: 16, fontSize: 16 },
});
