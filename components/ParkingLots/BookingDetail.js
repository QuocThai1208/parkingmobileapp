import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import Toast from "react-native-toast-message";
import API, { endpoints } from "../../configs/Apis";
import { ActivityIndicator, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

const BookingDetail = ({ route, navigation }) => {
  const { lotId, lotName } = route.params;
  const [vehicles, setVehicles] = useState([]);
  const [reviewData, setReviewData] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(
    new Date(new Date().getTime() + 60 * 60 * 1000),
  ); // Mặc định +1h
  const [showPicker, setShowPicker] = useState({ field: null, show: false });
  const nav = useNavigation();

  const loadVehicles = async () => {
    try {
      const res = await API.get(endpoints["vehicles"]);
      setVehicles(res.data);
    } catch (e) {
      console.log("error loadvehicles: ", e);
    }
  };

  const fetchBookingReview = async () => {
    if (!selectedVehicle || !startTime || !endTime) return;

    setLoadingReview(true);
    try {
      const response = await API.post(endpoints["bookingReview"], {
        vehicle: selectedVehicle.id,
        lot: lotId,
        start_time: dayjs(startTime).format("YYYY-MM-DD HH:mm:ss"),
        end_time: dayjs(endTime).format("YYYY-MM-DD HH:mm:ss"),
      });
      setReviewData(response.data);
    } catch (error) {
      console.error("Lỗi review booking:", error);
      setReviewData(null);
    } finally {
      setLoadingReview(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    fetchBookingReview();
  }, [selectedVehicle, startTime, endTime]);

  const onChangeTime = (event, selectedDate) => {
    setShowPicker({ ...showPicker, show: false });
    if (!selectedDate) return;

    if (showPicker.field === "start") {
      const now = dayjs();
      const maxAllowedTime = now.add(10, "minute"); // Thời gian hiện tại + 10 phút

      // Nếu thời gian chọn > thời gian hiện tại + 10 phút
      if (dayjs(selectedDate).isAfter(maxAllowedTime)) {
        Toast.show({
          type: "error",
          text1: "Thời gian không hợp lệ",
          text2: "Bạn chỉ được đặt chỗ trễ tối đa 10 phút so với hiện tại.",
        });

        // Set về thời gian tối đa cho phép
        setStartTime(maxAllowedTime.toDate());
      } else if (dayjs(selectedDate).isBefore(now)) {
        // Chặn  trường hợp chọn thời gian trong quá khứ
        setStartTime(now.toDate());
      } else {
        setStartTime(selectedDate);
      }
      // Tự động đẩy EndTime lên nếu EndTime < StartTime + 1h
      const minEnd = new Date(selectedDate.getTime() + 60 * 60 * 1000);
      if (endTime < minEnd) setEndTime(minEnd);
    } else {
      setEndTime(selectedDate);
      const minEnd = new Date(startTime.getTime() + 60 * 60 * 1000);
      if (selectedDate < minEnd) setEndTime(minEnd);
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedVehicle) {
      Toast.show({
        type: "error",
        text1: "Thông báo",
        text2: "Vui lòng chọn phương tiện của bạn.",
      });
      return;
    }

    const duration = dayjs(endTime).diff(dayjs(startTime), "minute");
    if (duration < 60) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Thời gian thuê tối thiểu là 1 giờ.",
      });
      return;
    }

    const bookingData = {
      vehicle: selectedVehicle.id,
      lot: lotId,
      lotName: lotName,
      start_time: dayjs(startTime).format("YYYY-MM-DD HH:mm:ss"),
      end_time: dayjs(endTime).format("YYYY-MM-DD HH:mm:ss"),
    };

    const vehicleData = {
      name: selectedVehicle.name,
      licensePlate: selectedVehicle.license_plate,
    };

    nav.navigate("PaymentConfirmation", {
      bookingData,
      reviewData,
      vehicleData,
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#6A5AE0", "#8781FF"]} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons color="white" name="arrow-back-outline" size={26} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận thông tin</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={{
          padding: 10,
          paddingBottom: 140,
        }}
      >
        {/* 2. Chọn phương tiện */}
        <Text style={styles.sectionTitle}>Chọn phương tiện của bạn</Text>
        {vehicles.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.vehicleCard,
              selectedVehicle?.id === item.id && styles.selectedCard,
            ]}
            onPress={() => setSelectedVehicle(item)}
          >
            <Image source={{ uri: item.image }} style={styles.vehicleImg} />
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.vehicleName}>
                {item.name} - {item.brand}
              </Text>
              <Text style={styles.licensePlate}>{item.license_plate}</Text>
            </View>
            {selectedVehicle?.id === item.id && (
              <Ionicons name="checkmark-circle" size={24} color="#6A5AE0" />
            )}
          </TouchableOpacity>
        ))}

        {/* 3. Chọn thời gian */}
        <Text style={styles.sectionTitle}>Thời gian đỗ xe</Text>
        <Text
          style={{
            fontSize: 11,
            color: "#636E72",
            marginBottom: 10,
            fontStyle: "italic",
          }}
        >
          * Lưu ý: Thời gian bắt đầu không quá 10 phút so với hiện tại.
        </Text>
        <View style={styles.timeContainer}>
          <TouchableOpacity
            style={styles.timeBox}
            onPress={() => setShowPicker({ field: "start", show: true })}
          >
            <Text style={styles.timeLabel}>Bắt đầu</Text>
            <Text style={styles.timeValue}>
              {dayjs(startTime).format("HH:mm, DD/MM")}
            </Text>
          </TouchableOpacity>

          <Ionicons name="arrow-forward" size={20} color="#B2BEC3" />

          <TouchableOpacity
            style={styles.timeBox}
            onPress={() => setShowPicker({ field: "end", show: true })}
          >
            <Text style={styles.timeLabel}>Kết thúc</Text>
            <Text style={styles.timeValue}>
              {dayjs(endTime).format("HH:mm, DD/MM")}
            </Text>
          </TouchableOpacity>
        </View>

        {showPicker.show && (
          <DateTimePicker
            value={showPicker.field === "start" ? startTime : endTime}
            mode="datetime"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onChangeTime}
            minimumDate={showPicker.field === "start" ? new Date() : startTime}
          />
        )}

        <View style={{ marginTop: 10 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "800",
              color: "#2D3436",
              marginBottom: 12,
            }}
          >
            Tạm tính chi phí
          </Text>

          {loadingReview ? (
            <ActivityIndicator color="#6A5AE0" style={{ marginVertical: 20 }} />
          ) : reviewData ? (
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 20,
                padding: 16,
                borderWidth: 1,
                borderColor: "#F1F3F5",
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
              }}
            >
              {/* Lặp qua từng phân đoạn ngày trong fee_detail */}
              {reviewData.fee_detail.map((item, index) => (
                <View key={index} style={{ marginBottom: 18 }}>
                  {/* Header Ngày và Khoảng thời gian */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#F8F9FE",
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 8,
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Ionicons name="calendar" size={14} color="#6A5AE0" />
                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "700",
                          color: "#6A5AE0",
                          marginLeft: 5,
                        }}
                      >
                        {item.date}
                      </Text>
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Ionicons name="time-outline" size={14} color="#636E72" />
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#636E72",
                          marginLeft: 4,
                        }}
                      >
                        {item.period}
                      </Text>
                    </View>
                  </View>

                  {/* Chi tiết tính toán trong ngày */}
                  <View style={{ paddingHorizontal: 4 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 6,
                      }}
                    >
                      <Text style={{ color: "#636E72", fontSize: 14 }}>
                        Đơn giá x Thời gian
                      </Text>
                      <Text style={{ fontWeight: "600", color: "#2D3436" }}>
                        {item.unit_price.toLocaleString()}đ x {item.hours}h
                      </Text>
                    </View>

                    {item.surcharge > 0 && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: 6,
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: "#FF7675", fontSize: 14 }}>
                            Phụ phí ({item.note})
                          </Text>
                        </View>
                        <Text style={{ color: "#FF7675", fontWeight: "600" }}>
                          +{item.surcharge.toLocaleString()}đ/h
                        </Text>
                      </View>
                    )}

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 4,
                      }}
                    >
                      <Text
                        style={{
                          color: "#2D3436",
                          fontWeight: "700",
                          fontSize: 14,
                        }}
                      >
                        Thành tiền ngày
                      </Text>
                      <Text
                        style={{
                          fontWeight: "800",
                          color: "#2D3436",
                          fontSize: 14,
                        }}
                      >
                        {item.sub_total.toLocaleString()}đ
                      </Text>
                    </View>
                  </View>

                  {index < reviewData.fee_detail.length - 1 && (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: "#F1F3F5",
                        marginTop: 15,
                        borderStyle: "dashed",
                        borderRadius: 1,
                        borderWidth: 0.5,
                        borderColor: "#DCDDE1",
                      }}
                    />
                  )}
                </View>
              ))}

              {/* Tổng kết cuối cùng */}
              <View
                style={{
                  marginTop: 5,
                  paddingTop: 15,
                  borderTopWidth: 2,
                  borderTopColor: "#F1F3F5",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "800",
                      color: "#2D3436",
                    }}
                  >
                    Tổng cộng
                  </Text>
                  <Text style={{ fontSize: 11, color: "#B2BEC3" }}>
                    {" "}
                    Đã bao gồm các loại phí
                  </Text>
                </View>
                <Text
                  style={{ fontSize: 24, fontWeight: "900", color: "#6A5AE0" }}
                >
                  {reviewData.final_fee.toLocaleString()}đ
                </Text>
              </View>
            </View>
          ) : (
            <View
              style={{
                padding: 20,
                alignItems: "center",
                backgroundColor: "#F8F9FA",
                borderRadius: 15,
              }}
            >
              <Ionicons name="calculator-outline" size={40} color="#DCDDE1" />
              <Text
                style={{ color: "#B2BEC3", textAlign: "center", marginTop: 10 }}
              >
                Vui lòng chọn xe và thời gian để tính toán chi phí
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      {/* Bottom Panel */}
      <View style={styles.bottomPanel}>
        {/* Thông báo quy định thời gian - Thêm mới */}
        <View
          style={{
            position: "absolute",
            top: -40, // Đẩy lên trên panel một chút
            left: 8,
            right: 8,
            backgroundColor: "#FFF9DB", // Màu nền vàng nhạt cảnh báo
            padding: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#FFE066",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="information-circle"
            size={16}
            color="#F59F00"
            style={{ marginRight: 6 }}
          />
          <Text
            style={{ fontSize: 11, color: "#856404", flex: 1, lineHeight: 16 }}
          >
            Lịch này sẽ được áp dụng nếu bạn vào bãi từ
            <Text style={{ fontWeight: "700" }}>
              {" "}
              {dayjs(startTime).subtract(10, "minute").format("HH:mm")}
            </Text>{" "}
            đến
            <Text style={{ fontWeight: "700" }}>
              {" "}
              {dayjs(startTime).add(10, "minute").format("HH:mm")}
            </Text>
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <View>
            <Text style={styles.totalLabel}>Tổng thời gian</Text>
            <Text style={styles.totalValue}>
              {(() => {
                const totalMinutes = dayjs(endTime).diff(
                  dayjs(startTime),
                  "minute",
                );
                const hours = Math.floor(totalMinutes / 60);
                const mins = totalMinutes % 60;
                return `${hours > 0 ? `${hours} Giờ ` : ""}${mins} Phút`;
              })()}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.btnConfirm}
            onPress={handleConfirmBooking}
          >
            <Text style={styles.btnText}>Đặt chỗ ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    paddingBottom: 25,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: { position: "absolute", left: 20, top: 50 },
  headerTitle: { color: "white", fontSize: 20, fontWeight: "800" },
  scrollContent: { padding: 10 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2D3436",
    marginTop: 10,
    marginBottom: 5,
  },
  sectionCard: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  infoRow: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    backgroundColor: "#EEEDFF",
    padding: 12,
    borderRadius: 12,
    marginRight: 15,
  },
  label: { color: "#B2BEC3", fontSize: 13, marginBottom: 2 },
  value: { fontSize: 16, fontWeight: "700", color: "#2D3436" },
  vehicleCard: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 18,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  selectedCard: { borderColor: "#6A5AE0", backgroundColor: "#F9F8FF" },
  vehicleImg: { width: 60, height: 60, borderRadius: 12 },
  vehicleName: { fontSize: 16, fontWeight: "700", color: "#2D3436" },
  licensePlate: { color: "#636E72", marginTop: 4 },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timeBox: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 18,
    width: "44%",
    alignItems: "center",
    elevation: 2,
  },
  timeLabel: { color: "#B2BEC3", fontSize: 12, marginBottom: 5 },
  timeValue: { fontSize: 14, fontWeight: "700", color: "#6A5AE0" },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    padding: 25,
    paddingBottom: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    hadowColor: "#000",
    shadowOffset: { width: 0, height: -10 }, // Đổ bóng ngược lên trên
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 20,
  },
  totalLabel: { color: "#B2BEC3", fontSize: 13, fontWeight: "600" },
  totalValue: { fontSize: 22, fontWeight: "800", color: "#2D3436" },
  btnConfirm: {
    backgroundColor: "#6A5AE0",
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 18,
  },
  btnText: { color: "white", fontSize: 16, fontWeight: "700" },
});

export default BookingDetail;
