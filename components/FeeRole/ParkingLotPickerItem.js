import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Card } from "react-native-paper";

const SlotItem = ({ icon, label, count, color }) => (
        <View style={{ alignItems: 'center', flex: 1 }}>
            <Ionicons name={icon} size={22} color={count > 0 ? color : '#C7C7CD'} />
            <Text style={{ fontSize: 12, color: '#8E8E93', marginTop: 4 }}>{label}</Text>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: count > 0 ? '#000' : '#C7C7CD' }}>
                {count}
            </Text>
        </View>
    );

const ParkingLotPickerItem = ({ parkingLot }) => {
    const nav = useNavigation();
    return (
        <TouchableOpacity onPress={() => nav.navigate("FeeRole", { lotId: parkingLot.id })}>
            <Card style={{ backgroundColor: 'white', marginBottom: 10, padding: 20, borderRadius: 15, elevation: 3 }}>
            {/* 1. Header: Tên bãi và Chủ sở hữu */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' }}>{parkingLot.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Ionicons name="person-circle-outline" size={14} color="#666" />
                        <Text style={{ fontSize: 13, color: '#666', marginLeft: 4 }}>Chủ bãi: {parkingLot.owner_name}</Text>
                    </View>
                </View>
                <View style={{ backgroundColor: '#E0F2FE', padding: 6, borderRadius: 8 }}>
                    <Text style={{ color: '#0369A1', fontSize: 12, fontWeight: 'bold' }}>ID: #{parkingLot.id}</Text>
                </View>
            </View>

            {/* 2. Địa chỉ */}
            <View style={{ flexDirection: 'row', marginTop: 12, alignItems: 'center' }}>
                <Ionicons name="location-sharp" size={16} color="#EF4444" />
                <Text style={{ fontSize: 14, color: '#4B5563', marginLeft: 6, flex: 1 }} numberOfLines={1}>
                    {parkingLot.address}
                </Text>
            </View>

            {/* Đường kẻ ngang nhẹ */}
            <View style={{ height: 1, backgroundColor: '#F3F4F6', marginVertical: 15 }} />

            {/* 3. Chi tiết các Slot xe */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <SlotItem icon="bicycle" label="Moto" count={parkingLot.moto_slots} color="#8B5CF6" />
                <SlotItem icon="car" label="Car" count={parkingLot.car_slots} color="#3B82F6" />
                <SlotItem icon="bus" label="Bus" count={parkingLot.bus_slots} color="#10B981" />
                <SlotItem icon="subway" label="Truck" count={parkingLot.truck_slots} color="#F59E0B" />
            </View>

            {/* 4. Footer: Threshold (Ngưỡng giải phóng) */}
            <View style={{ 
                marginTop: 15, 
                backgroundColor: '#F9FAFB', 
                padding: 10, 
                borderRadius: 10, 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="speedometer-outline" size={16} color="#6B7280" />
                    <Text style={{ fontSize: 13, color: '#6B7280', marginLeft: 6 }}>Ngưỡng lấp đầy bãi:</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#111827' }}>
                    {(parkingLot.threshold_release * 100)}%
                </Text>
            </View>
        </Card>    
        </TouchableOpacity>
    );
}

export default ParkingLotPickerItem;