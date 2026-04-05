import { useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native"
import {LinearGradient} from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import API, { endpoints } from "../../configs/Apis";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native-paper";
import ParkingLotItem from "./ParkingLotItem";

const ios = Platform.OS == 'ios'

const ParkingLots = () => {
    const [parkingLots, setParkingLots] = useState([]);
    const { top } = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const isRoot = nav.getState().index === 0;

    const fetchParkingLots = async () => {
        setLoading(true);
        try {
            const response = await API.get(endpoints['allParkingLot']);
            setParkingLots(response.data);
        } catch (error) {
            console.error("Error fetching parking lots:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchParkingLots();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#8781FF" />
            </View>
        );
    }

    if (parkingLots.length === 0) {
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
            <LinearGradient
                colors={['#8781FF', '#BFBCFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ 
                    paddingTop: ios ? top : top + 10, 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    paddingHorizontal: 15,
                    paddingBottom: 15 
                }}
            >
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white", flex: 1 }}>
                     Danh sách bãi đỗ
                </Text>
            </LinearGradient>

            {/* Giao diện khi không có bãi xe */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
                <View style={{ 
                    backgroundColor: '#F5F3FF', 
                    padding: 30, 
                    borderRadius: 100, 
                    marginBottom: 20 
                }}>
                    <Ionicons name="search-outline" size={80} color="#8781FF" />
                </View>
                
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937', textAlign: 'center' }}>
                    Không tìm thấy bãi xe nào
                </Text>
                
                <Text style={{ fontSize: 15, color: '#6B7280', textAlign: 'center', marginTop: 10, lineHeight: 22 }}>
                    Hiện tại chưa có bãi xe nào trong danh sách. Vui lòng quay lại sau hoặc kiểm tra kết nối mạng.
                </Text>

                <TouchableOpacity 
                    onPress={() => nav.goBack()}
                    style={{ 
                        marginTop: 30, 
                        backgroundColor: '#8781FF', 
                        paddingVertical: 12, 
                        paddingHorizontal: 30, 
                        borderRadius: 25,
                        elevation: 3,
                        shadowColor: '#8781FF',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8
                    }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    }

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <LinearGradient
                colors={['#8781FF', '#BFBCFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingTop: ios ? top : top + 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 }}
            >
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: "white", marginBottom: 10 }}>Danh sách bãi đỗ</Text>
            </LinearGradient>
            <FlatList
                data={parkingLots}
                keyExtractor={item => `parkingLot${item.id}`}
                style={{ paddingHorizontal: 10, marginTop: 10 }}
                renderItem={({ item }) => <ParkingLotItem parkingLot={item} />}
            />
        </View>
    )
}

export default ParkingLots;