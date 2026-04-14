import { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, Platform } from "react-native";
import {
  Text,
  Button,
  Card,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import API, { endpoints } from "../../configs/Apis";
import ParkingMapInteractive from "./ParkingMapInteractive";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const infoVehicle = {
  CAR: "Ô tô",
  MOTORBIKE: "Xe máy",
};

export const COLORS = {
  OCCUPIED: "#FF4D4D", // Đỏ - Có xe
  AVAILABLE: "#4CAF50", // Xanh - Trống
  SELECTED: "#6A5AE0", // Tím - Đang chọn
};

export const getSlotColor = (slot, isSelected) => {
  if (slot.is_occupied) return COLORS.OCCUPIED;
  return COLORS.AVAILABLE;
};

const ios = Platform.OS == "ios";
const LotDetail = () => {
  const router = useRoute();
  const { lotId } = router.params;
  const { top } = useSafeAreaInsets();
  const [lotData, setLotData] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const nav = useNavigation();

  const getStats = () => {
    if (!lotData || !lotData.slots) return { occupied: 0, available: 0 };
    const occupied = lotData.slots.filter(s => s.is_occupied).length;
    const available = lotData.slots.filter(s => !s.is_occupied).length;
    return { occupied, available };
  };

  const { occupied, available } = getStats();

  const handleSlotPress = (slot) => {
    if (!slot.is_vip) {
      Toast.show({
        type: "info",
        text1: "Thông báo",
        text2: "Vị trí này chỉ dành cho thành viên VIP.",
      });
      return;
    }
    if (selectedSlot && selectedSlot.id === slot.id) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
    }
  };

  const renderLegend = (label, color) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 6,
        width: "33%",
        paddingVertical: 4,
      }}
    >
      <View
        style={{
          width: 14,
          height: 14,
          backgroundColor: color,
          borderRadius: 4,
          marginRight: 10,
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.05)",
        }}
      />

      <View>
        <Text
          style={{
            fontSize: 13,
            color: "#2D3436",
            fontWeight: "600",
          }}
        >
          {label}
        </Text>
      </View>
    </View>
  );

  const fetchLotData = async () => {
    try {
      const response = await API.get(endpoints.parkingLotDetail(lotId));
      setLotData(response.data);
    } catch (error) {
      console.error("Error fetching lot data:", error);
    }
  };


  useEffect(() => {
    fetchLotData();
  }, [lotId]);


  if (!lotData) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F8F9FA",
        }}
      >
        <ActivityIndicator size="large" color="#6A5AE0" />
        <Text
          style={{
            marginTop: 15,
            color: "#6A5AE0",
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          Đang tải thông tin bãi xe...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f4f6f8" }}>
      <LinearGradient
        colors={["#6A5AE0", "#8781FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingTop: ios ? top : top + 15,
          paddingBottom: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          elevation: 10,
          shadowColor: "#6A5AE0",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          position: "relative",
        }}
      >
        <TouchableOpacity
          onPress={() => nav.goBack()}
          style={{
            position: "absolute",
            left: 20,
            top: ios ? top : top + 15,
            zIndex: 10,
            padding: 5,
          }}
        >
          <Ionicons color="white" name="arrow-back-outline" size={24} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "800",
            color: "white",
            letterSpacing: 0.5,
            textAlign: "center",
          }}
        >
          Chi tiết bãi đỗ
        </Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        <View
          style={{
            backgroundColor: "white",
            margin: 8,
            padding: 10,
            borderRadius: 20,
            elevation: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "#2D3436",
              marginBottom: 8,
            }}
          >
            {lotData.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="location-sharp"
              size={16}
              color="#6A5AE0"
              style={{ marginRight: 5 }}
            />
            <Text
              style={{
                fontSize: 12,
                color: "#636E72",
                flex: 1,
                lineHeight: 20,
              }}
            >
              {lotData.address}
            </Text>
          </View>
          <Divider style={{ marginVertical: 10 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: COLORS.OCCUPIED, fontWeight: '800', fontSize: 18 }}>{occupied}</Text>
              <Text style={{ fontSize: 12, color: '#636E72' }}>Đang có xe</Text>
            </View>
            <View style={{ width: 1, backgroundColor: '#F1F3F5', height: '100%' }} />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: COLORS.AVAILABLE, fontWeight: '800', fontSize: 18 }}>{available}</Text>
              <Text style={{ fontSize: 12, color: '#636E72' }}>Còn trống</Text>
            </View>
          </View>
        </View>

        <Card
          style={{
            margin: 8,
            marginTop: 0,
            padding: 15,
            borderRadius: 24,
            backgroundColor: "white",
            elevation: 5,
            shadowColor: "#6A5AE0",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(106, 90, 224, 0.1)",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#2D3436" }}>
              Sơ đồ vị trí ({lotData?.map_svgs[0]?.floor_display})
            </Text>
          </View>

          {/* Bản đồ SVG */}
          <View
            style={{
              minHeight: 300,
              borderRadius: 12,
              overflow: "hidden",
              backgroundColor: "#FDFDFD",
            }}
          >
            <ParkingMapInteractive
              svgUrl={lotData.map_svgs[0].map_svg}
              slots={lotData.slots}
              selectedSlot={selectedSlot}
              onSlotSelect={handleSlotPress}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: 5,
              paddingTop: 5,
              borderTopWidth: 1,
              borderTopColor: "#F1F3F5",
              justifyContent: "space-between",
            }}
          >
            {renderLegend("Trống", COLORS.AVAILABLE)}
            {renderLegend("Có xe", COLORS.OCCUPIED)}
          </View>
        </Card>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "white",
          paddingHorizontal: 25,
          paddingTop: 20,
          paddingBottom: ios ? 10 : 5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          elevation: 25,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: 15,
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={() =>
              nav.navigate("BookingDetail", {
                lotId: lotId,
                lotName: lotData.name,
              })
            }
            disabled={available === 0}
            style={{
              backgroundColor: !(available === 0) ? "#6A5AE0" : "#E4E7EB",
              paddingVertical: 14,
              paddingHorizontal: 25,
              borderRadius: 16,
              flexDirection: "row",
              alignItems: "center",
              elevation: !(available === 0) ? 8 : 0,
            }}
          >
            <Text
              style={{
                color: !(available === 0) ? "white" : "#A4A9AE",
                fontSize: 16,
                fontWeight: "700",
                marginRight: 5,
              }}
            >
              Đặt chỗ 
            </Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={!(available === 0) ? "white" : "#A4A9AE"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LotDetail;
