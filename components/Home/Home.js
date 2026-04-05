import { LinearGradient } from "expo-linear-gradient";
import { useContext, useEffect, useState } from "react";
import { FlatList, Platform, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MyUserConText } from "../../configs/Contexts";
import { Avatar} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API, { endpoints } from "../../configs/Apis";
import ParkingLogItem from "./ParkingLogItem";
import { Ionicons } from "@expo/vector-icons";
import Filter from "../../utils/Filter";

const defaultAvatar = 'https://res.cloudinary.com/dpknk0a1h/image/upload/istockphoto-1337144146-612x612_tqyzh8.jpg'
const ios = Platform.OS === 'ios'

const Home = () => {
    const info_role = {
        CUSTOMER: "Khách hàng",
        ADMIN: "Quản lý",
        STAFF: "Nhân viên"
    }
    const user = useContext(MyUserConText);
    const { top, bottom } = useSafeAreaInsets();
    const [parkingLog, setParkingLog] = useState();
    const [totalPayment, setTotalPayment] = useState();
    const [countParkingLog, setCountParkingLog] = useState();
    const [visible, setVisible] = useState(false);
    const [valueFilter, setValueFilter] = useState('day');
    const [dateValue, setDateValue] = useState({ day: '', month: '', year: '' });
    const [reloadTrigger, setReloadTrigger] = useState(0);

    const showFilter = () => setVisible(true);
    const hideFilter = () => setVisible(false);

    const handleReload = () => {
        setReloadTrigger(prev => prev + 1)
        hideFilter();
    }


    const loadCountParkingLog = async () => {
        try {
            let url = `${endpoints['countParking']}?day=${dateValue.day}&month=${dateValue.month}&year=${dateValue.year}`
            const res = await API.get(url)
            if (res.status === 200) {
                setCountParkingLog(res.data?.result?.total)
            }
        } catch (e) {
            console.log("error loadCountParkingLog: ", e)
        }
    }

    const loadTotalPayment = async () => {
        try {
            let url = `${endpoints['totalPayment']}?day=${dateValue.day}&month=${dateValue.month}&year=${dateValue.year}`
            const res = await API.get(url)
            if (res.status === 200) {
                setTotalPayment(res.data?.result?.revenue)
            }
        } catch (e) {
            console.log("error loadtotalPayment: ", e)
        }
    }

    const loadParkingLog = async () => {
        try {
            let url = `${endpoints['parkingLogs']}?day=${dateValue.day}&month=${dateValue.month}&year=${dateValue.year}`
            const res = await API.get(url)
            if (res.status === 200) {
                setParkingLog(res.data)
            }
        } catch (e) {
            console.log("error loadparrkinglog: ", e)
        }
    }

    useEffect(() => {
        loadParkingLog();
        loadTotalPayment();
        loadCountParkingLog();
    }, [reloadTrigger])

    return (

        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <LinearGradient
                colors={['#8781FF', '#BFBCFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingTop: ios ? top : top + 10 }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginVertical: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Avatar.Image size={60} source={{ uri: user._j?.avatar || defaultAvatar }} />
                        <View style={{ justifyContent: 'space-evenly', marginLeft: 10 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}>{user._j.full_name}</Text>
                            </View>
                            <Text style={{ color: 'white' }}>{info_role[user._j.user_role]}</Text>
                        </View>
                    </View>
                    <View>
                        <Ionicons onPress={showFilter} name="filter-outline" size={26} color='white' />
                    </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-around', marginVertical: 10 }}>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', alignSelf: 'center', marginBottom: 5 }}>{countParkingLog}</Text>
                        <Text style={{ color: "white", alignSelf: 'center' }}>Lần gửi</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', alignSelf: 'center', marginBottom: 5 }}>{totalPayment} đ</Text>
                        <Text style={{ color: "white", alignSelf: 'center' }}>Tổng phí</Text>
                    </View>
                </View>
            </LinearGradient>

            <FlatList
                data={parkingLog}
                keyExtractor={item => `parkingLog${item.id}`}
                style={{ paddingHorizontal: 10, paddingBottom: 10 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <ParkingLogItem item={item} />}
                contentContainerStyle={{ paddingBottom: bottom + 180 }}
            />
            <Filter
                visible={visible}
                onDismiss={hideFilter}
                valueFilter={valueFilter}
                setValueFilter={setValueFilter}
                dateValue={dateValue}
                setDateValue={setDateValue}
                onApply={handleReload}
            />

        </View>
    )
}

export default Home;