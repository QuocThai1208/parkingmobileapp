import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { Card, Divider, Text } from "react-native-paper";

const infoVehicle = {
  CAR: "Ô tô",
  MOTORBIKE: "Xe máy",
};

const nameIcon = {
  CAR: "car-sport-outline",
  MOTORBIKE: "bicycle-outline",
  CALENDAR: "calendar-outline",
  false: "close-circle-outline",
  true: "checkmark-circle-outline",
};

const FeeRoleItem = ({ item }) => {
    const hasSurcharge = item.surcharge > 0;
  return (
    <Card
      style={{
        backgroundColor: "white",
        marginBottom: 16,
        borderRadius: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }}
    >
      <View style={{ padding: 16 }}>
        {/* Header: Loại xe & Trạng thái */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                borderRadius: 12,
                padding: 10,
                backgroundColor:
                  item.fee_type === "CAR" ? "#E3F2FD" : "#F3E5F5",
                marginRight: 12,
              }}
            >
              <Ionicons
                name={nameIcon[item.fee_type]}
                size={28}
                color={item.fee_type === "CAR" ? "#1E88E5" : "#8E24AA"}
              />
            </View>
            <View>
              <Text
                style={{ fontSize: 18, fontWeight: "700", color: "#2D3436" }}
              >
                {infoVehicle[item.fee_type]}
              </Text>
            </View>
          </View>

          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: item.active ? "#E8F5E9" : "#FFEBEE",
            }}
          >
            <Text
              style={{
                color: item.active ? "#2E7D32" : "#C62828",
                fontSize: 11,
                fontWeight: "bold",
              }}
            >
              {item.active ? "HOẠT ĐỘNG" : "TẠM DỪNG"}
            </Text>
          </View>
        </View>

        {/* Phần giá tổng quát */}
        <View
          style={{
            marginTop: 15,
            padding: 10,
            backgroundColor: hasSurcharge ? "#FFF9C4" : "#F1F2F6",
            borderRadius: 12,
            borderStyle: hasSurcharge ? "dashed" : "solid",
            borderWidth: hasSurcharge ? 1 : 0,
            borderColor: "#FBC02D",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 14, color: "#2D3436", fontWeight: "500" }}>
              Gia niêm yết:
            </Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "800",
                color: hasSurcharge ? "#E65100" : "#2E7D32",
              }}
            >
              {item.amount?.toLocaleString()}đ
            </Text>
          </View>
        </View>

        {/* Footer: Hiệu lực */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 12,
            opacity: 0.6,
          }}
        >
          <Ionicons name="time-outline" size={14} color="#636E72" />
          <Text style={{ fontSize: 12, color: "#636E72", marginLeft: 4 }}>
            Hiệu lực từ: {item.effective_from} (Đang áp dụng)
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 12,
            opacity: 0.6,
          }}
        >
          <Ionicons name="time-outline" size={14} color="#636E72" />
          <Text style={{ fontSize: 12, color: "#636E72", marginLeft: 4 }}>
            Hết hiệu lực: {item.effective_to || "Chưa xác định"}
          </Text>
        </View>
      </View>
    </Card>
  );
};
export default FeeRoleItem;
