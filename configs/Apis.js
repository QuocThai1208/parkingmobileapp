import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const BASE_URL = "https://2003-123-20-137-172.ngrok-free.app/api/";

export const endpoints = {
  login: "auth/login",

  allParkingLot: "parking-lots",
  parkingLotDetail: (id) => `parking-lots/${id}`,

  parkingLogs: "parking-logs/",
  countToday: "parking-logs/count-today/",
  
  slotCheckPrice: (id) => `parking-slots/${id}/check-fee`,

  countParking: "stats/parking-logs/compare",
  totalTimeParking: "stats/parking-logs/total-time/",

  users: "users/",
  register: "users/register",
  me: "users/me",

  wallet: "wallet",
  walletTransaction: "transactions",

  deposit: "wallet/deposit",
  withdraw: "wallet/withdraw",

  vehicles: "vehicles",
  vehiclesDeltail: (id) => `vehicles/${id}/`,
  vehicleStats: "vehicles/stats",

  totalPayment: "stats/revenue",

  feeRole: "fee-roles",
  feeRoleDetail: (id) => `fee-role/${id}/`,

  totalCustomer: "stats/total-customer/",
  revenue: "stats/revenue/",
  revenueByUser: "stats/revenue/by-user/",
  occupancy: "parking-logs/occupancy/",
  compareMonthly: "stats/revenue/compare-monthly/",

  bookingReview: "bookings/review",
  bookings: "bookings",
};

const API = axios.create({
  baseURL: BASE_URL,
});


// tự chèn token nếu có
API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// xử lý lỗi 401
API.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response && error.response.status === 401) {
            console.log("Token hết hạn hoặc không hợp lệ, đang đăng xuất...");
            // Xóa token khỏi AsyncStorage
            await AsyncStorage.removeItem("token");
            dispatch({
                "type": "logout",
                "payload": null
            });
            useNavigation().navigate('mainLogin')
        }
        return Promise.reject(error);
    }
);

export default API


