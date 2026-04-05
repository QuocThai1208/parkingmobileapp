import { View, TouchableOpacity, Image, ScrollView } from "react-native";
import { Text, TextInput } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import Styles from "./Styles";


const VehicleForm = ({loading, vehicle, setVehicle, info, onSubmit, onCancel, onPickImage }) => {
    const setState = (value, field) => {
        setVehicle({ ...vehicle, [field]: value })
    }

    return (
        <ScrollView 
        style={{ flex: 1 }} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}>
        <View
            style={{
                backgroundColor: 'white',
                marginHorizontal: 20,
                borderRadius: 10,
                padding: 10,
                marginTop: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.2,
                shadowRadius: 4
            }}
        >
            <View style={{}}>
                {info.map(i =>
                    <View key={`createvehicle${i.field}`}>
                        {i.field === 'name' ?
                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 500 }}>{i.label}</Text>
                            </View>
                            <TextInput
                                placeholder={i.label}
                                value={vehicle[i.field]}
                                onChangeText={t => setState(t, i.field)}
                                style={[Styles.textInput]}
                        />
                        </> :
                        ['image_front', 'image_plate', 'image'].includes(i.field) ?
                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 500 }}>{i.label}</Text>
                            </View>
                            <View>
                                <TouchableOpacity
                                    onPress={() => onPickImage(i.field)}
                                    style={{ backgroundColor: 'rgba(155, 48, 255, 0.2)', padding: 10, borderRadius: 10, width: '30%', alignItems: 'center', marginVertical: 10 }}>
                                    <Text style={{ color: '#9B30FF', fontWeight: 'bold' }}>Chọn ảnh</Text>
                                </TouchableOpacity>
                                <Image style={{ width: '100%', height: 250, borderRadius: 10 }} source={{ uri: vehicle[i.field]?.uri || vehicle[i.field] }} />
                            </View>
                        </>
                        :
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                            <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 500 }}>{i.label}</Text>
                            {i.field === 'color' ? 
                            <View style={{
                                        width: 20,
                                        height: 20,
                                        borderRadius: 15,
                                        backgroundColor: vehicle[i.field] || '#eee',
                                        marginLeft: 10,
                                        borderWidth: 1,
                                        borderColor: '#ccc'
                                    }} /> 
                            :  
                            <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 600, color: i.field === 'is_approved' ? (vehicle[i.field] ? '#00CD66' : '#EE0000') : 'black' }}>{
                                i.field === 'is_approved'
                                ? (vehicle[i.field] ? 'Đã phê duyệt' : 'Chờ duyệt') : vehicle[i.field]
                            }</Text>
                                }
                        </View> 
                        }
                        
                    </View>
                )}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <TouchableOpacity
                    onPress={onSubmit}
                    style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(152, 70, 250, 0.8)',
                        paddingVertical: 10,
                        borderRadius: 15,
                        width: '49%',
                    }}
                >
                    <Ionicons name="save-outline" size={24} color='white' />
                    <Text style={{ color: 'white', fontWeight: 600, marginLeft: 10 }}>{loading ? 'Đang xử lý...' : 'Lưu'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onCancel}
                    style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        paddingVertical: 10,
                        borderRadius: 15,
                        width: '49%',
                        borderColor: '#ccc',
                        borderWidth: 1
                    }}
                >
                    <Ionicons name="close-outline" size={24} />
                    <Text style={{ fontWeight: 600, marginLeft: 10 }}>Hủy</Text>
                </TouchableOpacity>
            </View>
        </View>
        </ScrollView>
    )
}

export default VehicleForm;