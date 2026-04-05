import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { Text, } from "react-native-paper";
import API, { endpoints } from "../../configs/Apis";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import VehicleForm from "./VehicleForm";
import showToast from "../../utils/Toast";


const ios = Platform.OS === 'ios'
const VehicleCreate = () => {
    const { top } = useSafeAreaInsets();
    const nav = useNavigation();
    const info = [{
        label: "Tên phương tiện",
        field: "name",
    }, {
        label: "Ảnh chụp trước phương tiện",
        field: "image_front",
    }, {
        label: "Ảnh biển số",
        field: "image_plate",
    }]
    const [vehicle, setVehicle] = useState({})
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')

    const setState = (value, field) => {
        setVehicle({ ...vehicle, [field]: value })
    }

    const validate = () => {
        if (Object.values(vehicle).length === 0) {
            setMsg("Vui lòng nhập thông tin!");
            return false;
        }

        for (let i of info) {
            if (!(i.field in vehicle)) {
                setMsg(`Vui lòng điền ${i.label}`);
                return false;
            }
        }
        setMsg("");
        return true;
    }

    const postVehicle = async () => {
        setLoading(true)
        try {
            if (validate() === false) {
                showToast('info', 'Thông báo', msg)
                return
            }

            let form = new FormData()
            for (let key in vehicle) {
                if (key === 'image_front' || key === 'image_plate') {
                    form.append(key, {
                        uri: vehicle[key]?.uri,
                        name: vehicle[key]?.fileName,
                        type: vehicle[key]?.mimeType
                    })
                } else {
                    form.append(key, vehicle[key])
                }
            }

            const res = await API.post(endpoints['vehicles'], form)
            console.log("res: ", res.data)
            showToast('success', 'Thành công', 'Thêm phương tiện thành công')
        } catch (e) {
            console.log("error postVehicle: ", e)
            showToast('error', 'Thất bại', 'Thêm phương tiện thât bại')
        }finally {
            setLoading(false)
        }
    }

    const picker = async (field) => {
        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert("Permissions denied!");
            Linking.openSettings();
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();
            if (!result.canceled)
                setState(result.assets[0], field);
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={ios ? 'padding' : 'height'}>
                <View style={{ backgroundColor: 'white', flex: 1 }}>
                    <LinearGradient
                        colors={['#8781FF', '#BFBCFF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ paddingTop: ios ? top : top + 10, alignItems: 'center', paddingVertical: 15 }}
                    >
                        <Text style={{ fontSize: 26, color: 'white', fontWeight: 'bold' }}>Thêm phương tiện mới</Text>
                        <Text style={{ fontSize: 16, color: 'white', fontWeight: 600 }}>Điền thông tin phương tiện của bạn</Text>
                    </LinearGradient>
                    <VehicleForm
                        loading={loading}
                        vehicle={vehicle}
                        setVehicle={setVehicle}
                        info={info}
                        onSubmit={postVehicle}
                        onCancel={() => nav.goBack()}
                        onPickImage={picker}
                    />
                </View>
        </KeyboardAvoidingView>
    )
}

export default VehicleCreate;