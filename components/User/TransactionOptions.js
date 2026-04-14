import { Ionicons } from "@expo/vector-icons";
import { CommonActions, useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { Text, TextInput } from "react-native-paper";
import API, { endpoints } from "../../configs/Apis";
import { Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const ios = Platform.OS === "ios";

const TransactionOptions = ({ route }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("MOMO");
  const { top } = useSafeAreaInsets();

  const option = route.params?.option;
  const wallet = route.params?.wallet;
  const nav = useNavigation();

  const MOMO_CONFIG = {
    title: "Ví MoMo",
    icon: "https://img.mservice.io/momo-payment/icon/images/logo512.png",
    color: "#b0006d",
    scheme: "momodevelopment",
  };

  const handleConfirm = async () => {
    if (!amount || parseInt(amount) <= 0) {
      Alert.alert("Lỗi", "Vui lòng nhập số tiền hợp lệ");
      return;
    }

    if (option === "DEPOSIT") {
      const res = await API.post(endpoints["deposit"], {
        amount: parseInt(amount),
        description: description || "Nạp tiền vào ví",
      });

      if (res.data?.deeplink) {
        Linking.openURL(res.data.deeplink);
      }
    } else {
      const res = await API.post(endpoints["withdraw"], {
        amount: parseInt(amount),
        description: description || "Rút tiền từ ví",
      });
      if (res.status === 200) {
        Alert.alert("Thông báo", "Giao dịch thành công", [
          {
            text: "Đồng ý",
            onPress: () => {
              nav.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Wallet" }],
                }),
              );
            },
          },
        ]);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      const handleUrl = (url) => {
        if (!url) return;
        console.log("Received URL: ", url);
        if (url.includes("resultCode=0")) {
          Alert.alert("Thông báo", "Giao dịch thành công", [
          {
            text: "Đồng ý",
            onPress: () => {
              nav.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "Wallet" }],
                }),
              );
            },
          },
        ]);
        } else if (url.includes("resultCode=")) {
          Alert.alert("Thông báo", "Giao dịch thất bại hoặc đã bị hủy.", [
            {
              text: "Đồng ý",
              onPress: () => {
                nav.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Wallet" }],
                  }),
                );
              },
            },
          ]);
        }
      };

      const subscription = Linking.addEventListener("url", (event) => {
        handleUrl(event.url);
      });

      Linking.getInitialURL().then((url) => {
        if (url) handleUrl(url);
      });

      return () => {
        subscription.remove();
      };
    }, []),
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FBFBFF" }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={["#8781FF", "#BFBCFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          paddingTop: ios ? top : top + 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 15,
          paddingBottom: 15,
        }}
      >
        <TouchableOpacity onPress={() => nav.goBack()} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={{ fontSize: 17, fontWeight: "700", color: "white" }}>
          {option === "WITHDRAW" ? "Rút tiền" : "Nạp tiền"}
        </Text>
        <View style={{ width: 32 }} />
      </LinearGradient>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={ios ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, padding: 20 }}>
            <View
              style={{
                backgroundColor: "#6A5AE0",
                padding: 24,
                borderRadius: 24,
                marginBottom: 30,
                shadowColor: "#6A5AE0",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.3,
                shadowRadius: 15,
                elevation: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: 13,
                      fontWeight: "600",
                    }}
                  >
                    Số dư hiện tại
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "800",
                      fontSize: 30,
                      marginTop: 4,
                    }}
                  >
                    {parseInt(wallet.balance).toLocaleString()}{" "}
                    <Text
                      style={{
                        fontSize: 24,
                        color: "white",
                        fontWeight: "800",
                      }}
                    >
                      đ
                    </Text>
                  </Text>
                </View>
                <Ionicons name="card" color="rgba(255,255,255,0.4)" size={40} />
              </View>
            </View>

            {/* Input Area: Trắng tinh khôi trên nền xám nhạt */}
            <View
              style={{
                backgroundColor: "white",
                borderRadius: 20,
                padding: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#B2BEC3",
                  marginBottom: 15,
                  textTransform: "uppercase",
                }}
              >
                Số tiền muốn {option === "WITHDRAW" ? "rút" : "nạp"}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomWidth: 2,
                  borderBottomColor: "#F1F2F6",
                  paddingBottom: 10,
                }}
              >
                <TextInput
                  placeholder="0"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  placeholderTextColor="#E1E2E6"
                  style={{
                    flex: 1,
                    fontSize: 28,
                    fontWeight: "800",
                    color: "#6A5AE0",
                    backgroundColor: "transparent",
                  }}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                />
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: "#2D3436",
                    marginRight: 10,
                  }}
                >
                  đ
                </Text>
              </View>

              {/* Nút chọn nhanh: Bo tròn kiểu Soft UI */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                {["50000", "100000", "200000", "500000"].map((val) => (
                  <TouchableOpacity
                    key={val}
                    onPress={() => setAmount(val)}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 15,
                      borderRadius: 12,
                      backgroundColor: "#F8F9FE",
                      borderWidth: 1,
                      borderColor: "#6A5AE020",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#6A5AE0",
                        fontWeight: "700",
                      }}
                    >
                      +{parseInt(val) / 1000}k
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TextInput
              label="Lời nhắn"
              mode="outlined"
              value={description}
              onChangeText={setDescription}
              outlineColor="#F1F2F6"
              activeOutlineColor="#6A5AE0"
              style={{
                backgroundColor: "white",
                marginTop: 20,
                borderRadius: 15,
              }}
              outlineStyle={{ borderRadius: 15 }}
            />

            {/* PHẦN CHỌN PHƯƠNG THỨC THANH TOÁN */}
            <Text
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: "#B2BEC3",
                marginTop: 25,
                marginBottom: 10,
                textTransform: "uppercase",
              }}
            >
              Phương thức thanh toán
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setPaymentMethod("MOMO")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                padding: 16,
                borderRadius: 15,
                borderWidth: paymentMethod === "MOMO" ? 2 : 1,
                borderColor:
                  paymentMethod === "MOMO" ? MOMO_CONFIG.color : "#F1F2F6",
              }}
            >
              <Image
                source={{ uri: MOMO_CONFIG.icon }}
                style={{ width: 40, height: 40, borderRadius: 8 }}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "700", color: "#1A1A1A" }}
                >
                  {MOMO_CONFIG.title}
                </Text>
                <Text style={{ fontSize: 12, color: "#B2BEC3" }}>
                  Thanh toán qua ứng dụng MoMo
                </Text>
              </View>
              {paymentMethod === "MOMO" && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={MOMO_CONFIG.color}
                />
              )}
            </TouchableOpacity>

            <View style={{ flex: 1, justifyContent: "flex-end" }}>
              <TouchableOpacity
                onPress={() => handleConfirm()}
                activeOpacity={0.9}
                style={{
                  backgroundColor: "#6A5AE0",
                  height: 50,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 17,
                    fontWeight: "700",
                    marginRight: 8,
                  }}
                >
                  Xác nhận giao dịch
                </Text>
                <Ionicons name="checkmark-circle" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default TransactionOptions;
