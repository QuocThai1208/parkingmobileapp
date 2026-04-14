import {
  FlatList,
  Platform,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Linking,
  RefreshControl,
} from "react-native";
import API, { endpoints } from "../../configs/Apis";
import { useCallback, useContext, useEffect, useState } from "react";
import { Avatar, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MyUserConText } from "../../configs/Contexts";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import WalletTransaction from "./WalletTransaction";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const ios = Platform.OS === "ios";
const Wallet = () => {
  const user = useContext(MyUserConText);
  const [wallet, setWallet] = useState();
  const [showBalance, setShowBalance] = useState(false);
  const [walletTransaction, setWalletTransaction] = useState([]);
  const { top, bottom } = useSafeAreaInsets();
  const [pageTransaction, setPageTransaction] = useState(1);
  const [loadingTransaction, setLoadingTransaction] = useState(false);
  const nav = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const renderFooter = () => {
    if (!loadingTransaction) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color="#6A5AE0" />
      </View>
    );
  };

  const LoadWalletTransactions = async () => {
    if (pageTransaction === 0) return;
    try {
      setLoadingTransaction(true);
      const url = `${endpoints["walletTransaction"]}?page=${pageTransaction}`;
      const res = await API.get(url);
      if (res.status === 200) {
        if (pageTransaction === 1) {
          setWalletTransaction(res.data?.results);
        } else {
          setWalletTransaction((prev) => [...prev, ...res.data?.results]);
        }
      }
      if(res?.data?.next === null) {
        setPageTransaction(0);
      }
    } catch (e) {
      console.log("error loadwalletTransactions: ", e);
    } finally {
      setLoadingTransaction(false);
    }
  };

  const LoadWallet = async () => {
    try {
      const res = await API.get(endpoints["wallet"]);
      if (res.status === 200) {
        setWallet(res.data);
      }
    } catch (e) {
      console.log("error loaswallet: ", e);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await LoadWallet();
      setPageTransaction(1);
    } catch (e) {
      console.log("error refresh: ", e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    LoadWallet();
  }, []);

  useEffect(() => {
    LoadWalletTransactions();
  }, [pageTransaction]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <Avatar.Image
          size={80}
          source={{
            uri: `${user?._j.avatar ? user._j.avatar : "https://res.cloudinary.com/dpknk0a1h/image/upload/istockphoto-1337144146-612x612_tqyzh8.jpg"}`,
          }}
        />
        <View style={{ justifyContent: "center", marginLeft: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 18 }}>
            {user._j.full_name}
          </Text>
        </View>
      </View>
      <LinearGradient
        colors={["#8781FF", "#BFBCFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          padding: 20,
          borderRadius: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
              marginBottom: 5,
            }}
          >
            Tổng số dư
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 26,
                marginRight: 10,
              }}
            >
              {showBalance
                ? `${parseInt(wallet?.balance ?? 0).toLocaleString()} đ`
                : "*********"}
            </Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              <Ionicons
                name={showBalance ? "eye-off-outline" : "eye-outline"}
                size={28}
                color="white"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Ionicons name="wallet-outline" color="white" size={34} />
        </View>
      </LinearGradient>

      <View style={{ flexDirection: "row", marginVertical: 20 }}>
        {/* Nút Nạp tiền */}
        <TouchableOpacity
          onPress={() =>
            nav.navigate("TransactionOptions", {
              option: "DEPOSIT",
              wallet: wallet,
            })
          }
          style={{
            backgroundColor: "#F0F9FF",
            borderRadius: 20,
            width: 80,
            height: 80,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <View
            style={{
              backgroundColor: "#0EA5E9",
              padding: 12,
              borderRadius: 15,
              marginBottom: 8,
            }}
          >
            <Ionicons name="arrow-down-outline" size={10} color="white" />
          </View>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#0369A1" }}>
            Nạp tiền
          </Text>
        </TouchableOpacity>

        {/* Nút Rút tiền */}
        <TouchableOpacity
          onPress={() =>
            nav.navigate("TransactionOptions", {
              option: "WITHDRAW",
              wallet: wallet,
            })
          }
          style={{
            backgroundColor: "#FFF7ED",
            borderRadius: 20,
            width: 80,
            height: 80,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <View
            style={{
              backgroundColor: "#F97316",
              padding: 12,
              borderRadius: 15,
              marginBottom: 8,
            }}
          >
            <Ionicons name="arrow-up-outline" size={10} color="white" />
          </View>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#9A3412" }}>
            Rút tiền
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ backgroundColor: "white" }}>
        <Text style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
          Giao dịch gần đây
        </Text>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#8781FF"]}
              tintColor="#8781FF"
            />
          }
          data={walletTransaction}
          keyExtractor={(item) => `walletTransaction${item.id}`}
          renderItem={({ item }) => <WalletTransaction item={item} />}
          contentContainerStyle={{ paddingBottom: bottom + 280 }}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5} // Tải trước khi chạm đáy 50%
          ListFooterComponent={renderFooter}
          onEndReached={() => {
            if (!loadingTransaction && pageTransaction > 0)
              setPageTransaction((prev) => prev + 1);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Wallet;
