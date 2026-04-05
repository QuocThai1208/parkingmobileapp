import { useContext, useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { HelperText, Text, TextInput } from "react-native-paper";
import  {endpoints } from "../../configs/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyDispatchContext } from "../../configs/Contexts";
import Styles from "./Styles";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import API from "../../configs/Apis";


const ios = Platform.OS === 'ios'
const Login = () => {
    const info = [{
        field: 'username',
        label: 'Tên đăng nhập',
        secureTextEntry: false
    }, {
        field: 'password',
        label: 'Mật khẩu',
        secureTextEntry: true
    }]
    const { top } = useSafeAreaInsets();
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState();
    const nav = useNavigation();
    const dispatch = useContext(MyDispatchContext);

    const setState = (value, field) => {
        setUser({ ...user, [field]: value })
    }

    const validate = () => {
        if (Object.values(user).length === 0) {
            setMsg("Vui lòng nhập thông tin!");
            return false;
        }

        for (let i of info) {
            if (!(i.field in user)) {
                setMsg(`Vui lòng nhập ${i.label}`);
                return false;
            }

            if (user[i.field].trim() === '') {
                setMsg(`Vui lòng nhập ${i.label}`);
                return false;
            }
        }

        setMsg("");
        return true;
    }

    const login = async () => {
        if (validate() === false) return
        try {
            setLoading(true)
            const res = await API.post(endpoints['login'], user)

            await AsyncStorage.setItem('token', res.data.access);

            const resCurrentUser = await API.get(endpoints['me']);
            dispatch({
                "type": "login",
                "payload": resCurrentUser.data
            })

        }
        catch (err) {
            console.log("Login: ", err)
            Alert.alert("Thông báo", "Tài khoản hoặc mật khẩu không đúng")
        } finally {
            setLoading(false)
        }
    }

    return (
        <KeyboardAvoidingView style={[Styles.container, { backgroundColor: 'rgba(30, 144, 255, 0.1)' }]}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ paddingTop: ios ? top : top + 10, flex: 1 }}>
                    <View style={[Styles.container, {justifyContent: 'center'}]}>
                        <View style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 6 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 8,
                            alignSelf: 'center',
                            marginBottom: 20
                        }}>
                            <LinearGradient
                                colors={['#8781FF', '#BFBCFF']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={Styles.iconContainer}
                            >
                                <Ionicons name="car-sport-outline" color='white' size={40} />
                            </LinearGradient>
                        </View>
                        <View>
                            <Text style={Styles.welcomeText}>Chào mừng trở lại!</Text>
                            <Text style={Styles.subtitleText}>Đăng nhập để tiếp tục sử dụng dịch vụ</Text>
                        </View>
                        <View style={Styles.inputWrapper}>
                            <HelperText type="erroe" visible={msg}>{msg}</HelperText>

                            {info.map(i =>
                                <TextInput placeholder={i.label}
                                    key={`Login${i.field}`}
                                    placeholderColor="#c4c3cb"
                                    style={Styles.loginFormTextInput}
                                    value={user[i.field]}
                                    secureTextEntry={i.secureTextEntry}
                                    onChangeText={t => setState(t, i.field)}
                                />)}

                            <Text style={Styles.forgotPasswordText}>Quên mật khẩu?</Text>

                            <LinearGradient
                                colors={['#8781FF', '#BFBCFF']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{ borderRadius: 8 }}
                            >
                                <TouchableOpacity disabled={loading} loading={loading} onPress={login}
                                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}
                                >
                                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 10 }}>{loading ? "Đang xử lý..." : "Đăng nhập"}</Text>
                                    <Ionicons name="arrow-forward-outline" color="white" size={24} />
                                </TouchableOpacity>
                            </LinearGradient>
                        </View>

                        <View style={Styles.footerContainer}>
                            <Text style={Styles.footerText}>Chưa có tài khoản?</Text>
                            <TouchableOpacity onPress={() => nav.navigate("Register")}>
                                <Text style={Styles.footerLink}>Đăng ký ngay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ marginBottom: 80 }}>
                        <Text style={Styles.bottomText}>Bằng việc đăng nhập bạn đồng ý với</Text>
                        <Text style={Styles.bottomText}>Điều khoản sử dụng  .  Chính sách bảo mật</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default Login;