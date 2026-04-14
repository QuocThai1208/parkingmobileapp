import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import { Text, Divider, ActivityIndicator } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import API, { endpoints } from "../../configs/Apis";

const PaymentConfirmation = ({ route, navigation }) => {
  const { bookingData, reviewData, vehicleData } = route.params;

  const handlePayment = async () => {
    try {
      const res = await API.post(endpoints.bookings, {
        vehicle: bookingData.vehicle,
        lot: bookingData.lot,
        start_time: bookingData.start_time,
        end_time: bookingData.end_time,
      });

      if (res.status === 201) {
        navigation.navigate("tab-profile", {
          screen: "BookingHistory", 
        });
      }
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Thanh toán thất bại",
        text2: e.message || "Đã có lỗi xảy ra, vui lòng thử lại sau.",
      });
      console.log("Payment error:", e);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#6A5AE0", "#8781FF"]} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons color="white" name="arrow-back-outline" size={26} />
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>Xác nhận thanh toán</Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Card Tổng tiền */}
        <LinearGradient
          colors={["#6A5AE0", "#8781FF"]}
          style={styles.amountCard}
        >
          <Text style={styles.amountLabel}>Tổng số tiền thanh toán</Text>
          <Text style={styles.amountValue}>
            {reviewData.final_fee.toLocaleString()}đ
          </Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Chờ thanh toán</Text>
            <ActivityIndicator
              size="small"
              color="#FFC107"
              style={styles.statusLoader}
            />
          </View>
        </LinearGradient>

        {/* Thông tin đặt chỗ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin đặt chỗ</Text>
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="location" size={18} color="#6A5AE0" />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.infoLabel}>Vị trí đỗ</Text>
                <Text style={styles.infoMainText}>{bookingData.lotName}</Text>
              </View>
            </View>

            <Divider style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="time" size={18} color="#6A5AE0" />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.infoLabel}>Thời gian dự kiến</Text>
                <Text style={styles.infoMainText}>
                  {dayjs(bookingData.start_time).isSame(dayjs(bookingData.end_time), "day",)
                    ? `${dayjs(bookingData.start_time).format("HH:mm")} - ${dayjs(bookingData.end_time).format("HH:mm, DD/MM")}`
                    : `${dayjs(bookingData.start_time).format("HH:mm, DD/MM")} - ${dayjs(bookingData.end_time).format("HH:mm, DD/MM")}`}
                </Text>
              </View>
            </View>

            <Divider style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="time" size={18} color="#6A5AE0" />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.infoLabel}>Thời gian hết hạn giữ chỗ</Text>
                <Text style={styles.infoMainText}>
                  {dayjs(bookingData.start_time).add(10, "minute").format("HH:mm, DD/MM")}
                </Text>
              </View>
            </View>

            <Divider style={styles.infoDivider} />

            <View style={styles.infoRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="car-sport" size={18} color="#6A5AE0" />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.infoLabel}>Phương tiện</Text>
                <Text style={styles.infoMainText}>
                  {vehicleData.name} • {vehicleData.licensePlate}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Chi tiết hóa đơn (Phần thay đổi chính theo reviewData mới) */}
        <View style={[styles.section]}>
          <Text style={styles.sectionTitle}>Chi tiết hóa đơn</Text>
          <View style={styles.receiptBox}>
            {reviewData.fee_detail.map((item, index) => (
              <View key={index} style={styles.receiptItem}>
                <View style={styles.receiptHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.receiptDate}>Ngày {item.date}</Text>
                    <Text style={styles.receiptPeriodText}>
                      {item.period} ({item.hours}h)
                    </Text>
                  </View>
                  <Text style={styles.receiptPrice}>
                    {item.sub_total.toLocaleString()}đ
                  </Text>
                </View>

                <View style={styles.receiptDetailRow}>
                  <Text style={styles.receiptSubText}>
                    Đơn giá: {item.unit_price.toLocaleString()}đ/h
                  </Text>
                  {item.surcharge > 0 && (
                    <Text style={styles.receiptSurcharge}>
                      Phụ phí: +{item.surcharge.toLocaleString()}đ ({item.note})
                    </Text>
                  )}
                </View>
                {index < reviewData.fee_detail.length - 1 && (
                  <View style={styles.innerDivider} />
                )}
              </View>
            ))}

            {/* Phí đặt chỗ*/}
            {reviewData.fee_booking > 0 && (
              <View style={styles.vipFeeBox}>
                <View style={styles.receiptHeader}>
                  <Text style={[styles.receiptDate, { color: "#E67E22" }]}>
                    Phí đặt trước
                  </Text>
                  <Text style={[styles.receiptPrice, { color: "#E67E22" }]}>
                    {reviewData.fee_booking.toLocaleString()}đ
                  </Text>
                </View>
                <Text style={styles.receiptSubText}>
                  Phí cố định giữ chỗ ưu tiên
                </Text>
              </View>
            )}

            <View style={styles.dashedLine} />

            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Thành tiền</Text>
              <Text style={styles.totalPrice}>
                {reviewData.final_fee.toLocaleString()}đ
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Thanh toán ngay</Text>
          <Ionicons
            name="shield-checkmark"
            size={20}
            color="white"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
        <Text style={styles.secureNote}>Giao dịch được bảo mật và mã hóa</Text>
      </View>
    </View>
  );
};

export default PaymentConfirmation;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    paddingBottom: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitleText: { color: "white", fontSize: 18, fontWeight: "800" },
  backBtn: {
    position: "absolute",
    left: 20,
    top: Platform.OS === "ios" ? 60 : 40,
  },
  scrollContent: { padding: 16, paddingBottom: 140 },

  // Card tiền
  amountCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#6A5AE0",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  amountLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginBottom: 8,
  },
  amountValue: { color: "white", fontSize: 34, fontWeight: "900" },
  statusBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: { color: "#FFC107", fontSize: 12, fontWeight: "700" },
  statusLoader: { marginLeft: 6, transform: [{ scale: 0.6 }] },

  // Info Section
  section: { marginBottom: 10 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2D3436",
    marginBottom: 12,
  },
  infoBox: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
    elevation: 1,
  },
  infoRow: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F0FF",
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 11,
    color: "#B2BEC3",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoMainText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D3436",
    marginTop: 2,
  },
  infoDivider: { marginVertical: 12, backgroundColor: "#F8F9FA" },

  // Receipt Section (Updated)
  receiptBox: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#E67E22",
    borderStyle: "dashed",
  },
  receiptItem: { marginBottom: 12 },
  receiptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  receiptDate: { fontSize: 13, fontWeight: "700", color: "#2D3436" },
  receiptPeriodText: {
    fontSize: 12,
    color: "#6A5AE0",
    fontWeight: "600",
    marginTop: 2,
  },
  receiptPrice: { fontSize: 15, fontWeight: "800", color: "#2D3436" },
  receiptDetailRow: { marginTop: 4 },
  receiptSubText: { fontSize: 12, color: "#636E72" },
  receiptSurcharge: {
    fontSize: 11,
    color: "#FF7675",
    fontStyle: "italic",
    marginTop: 2,
  },
  innerDivider: { height: 1, backgroundColor: "#F8F9FA", marginTop: 12 },
  vipFeeBox: { marginTop: 4, paddingVertical: 8 },
  dashedLine: {
    height: 1,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    borderStyle: "dashed",
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: { fontSize: 16, fontWeight: "800", color: "#2D3436" },
  totalPrice: { fontSize: 22, fontWeight: "900", color: "#6A5AE0" },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 15 : 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  payButton: {
    backgroundColor: "#6A5AE0",
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  payButtonText: { color: "white", fontSize: 18, fontWeight: "800" },
  secureNote: {
    textAlign: "center",
    color: "#B2BEC3",
    fontSize: 11,
    marginTop: 12,
  },
});
