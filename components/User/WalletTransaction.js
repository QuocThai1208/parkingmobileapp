import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, View } from "react-native";
import { Divider, Text } from "react-native-paper";

const WalletTransaction = ({ item }) => {
    const nav = useNavigation();
  return (
    <View>
      <TouchableOpacity
        onPress={() => nav.navigate('TransactionDetail', { item: item })}
        style={{
          borderRadius: 15,
          paddingVertical: 16,
          paddingHorizontal: 10,
          marginBottom: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <View
            style={{
              width: 45,
              height: 45,
              borderRadius: 12,
              backgroundColor:
                item.transaction_type === "WITHDRAW" ? "#FFF5F5" : "#F0FFF4",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Ionicons
              name={
                item.transaction_type === "WITHDRAW"
                  ? "arrow-up-outline"
                  : "arrow-down-outline"
              }
              size={22}
              color={
                item.transaction_type === "WITHDRAW" ? "#FF4D4F" : "#52C41A"
              }
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: "#2D3436",
                marginBottom: 4,
              }}
              numberOfLines={1}
            >
              {item.description}
            </Text>
            <Text style={{ fontSize: 12, color: "#B2BEC3" }}>
              {item.created_date}
            </Text>
          </View>
        </View>

        {/* Cột bên phải: Số tiền & Badge */}
        <View style={{ alignItems: "flex-end" }}>
          <Text
            style={{
              color:
                item.transaction_type === "WITHDRAW" ? "#FF4D4F" : "#52C41A",
              fontSize: 16,
              fontWeight: "800",
              marginBottom: 6,
            }}
          >
            {item.transaction_type === "WITHDRAW" ? "-" : "+"}
            {item.amount.toLocaleString()}đ
          </Text>

          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
              backgroundColor:
                item.transaction_type === "WITHDRAW" ? "#FFF1F0" : "#F6FFED",
              borderWidth: 1,
              borderColor:
                item.transaction_type === "WITHDRAW" ? "#FFA39E" : "#B7EB8F",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "600",
                color:
                  item.transaction_type === "WITHDRAW" ? "#CF1322" : "#389E0D",
                textTransform: "uppercase",
              }}
            >
              {item.transaction_type === "WITHDRAW" ? "Rút tiền" : "Nạp tiền"}
            </Text>
          </View>
          
        </View>
      </TouchableOpacity>
      <View
            style={{
              height: 1,
              backgroundColor: "#F1F2F6",
            }}
          />
    </View>
  );
};

export default WalletTransaction;
