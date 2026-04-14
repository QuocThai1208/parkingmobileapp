import { useContext, useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { Avatar, Divider, IconButton, Text } from "react-native-paper";
import { MyDispatchContext, MyUserConText } from "../../configs/Contexts";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Styles from "./Styles";
import { Modal, Pressable } from "react-native";

const defaultAvatar =
  "https://res.cloudinary.com/dpknk0a1h/image/upload/istockphoto-1337144146-612x612_tqyzh8.jpg";
const ios = Platform.OS === "ios";
const Profile = () => {
  const [visible, setVisible] = useState(false);
  const user = useContext(MyUserConText);
  const dispatch = useContext(MyDispatchContext);
  const { top } = useSafeAreaInsets();
  const nav = useNavigation();
  const nameIcon = {
    address: "location-outline",
    birth: "calendar-outline",
    age: "calendar-outline",
    logOut: "exit-outline",
    update: "pencil-outline",
  };
  const infoRole = {
    ADMIN: "Quản lý",
    STAFF: "Nhân viên",
    CUSTOMER: "Khách hàng",
  };

  const logOut = () => {
    dispatch({
      type: "logout",
    });
  };

  const InfoItem = ({ icon, label, value }) => (
  <View style={{ 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F8F9FA' 
  }}>
    <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
      <Ionicons name={icon} size={20} color="#2D3436" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 12, color: "#B2BEC3", marginBottom: 2 }}>{label}</Text>
      <Text style={{ fontSize: 16, color: "#2D3436", fontWeight: '500' }}>{value}</Text>
    </View>
  </View>
);

  return (
    <View style={[Styles.container, { backgroundColor: "white" }]}>
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={["rgba(152, 16, 250, 0.7)", "rgba(230, 0, 118, 0.7)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ paddingTop: ios ? top : top + 10, alignItems: "center" }}
        >
          <IconButton
            icon="dots-vertical"
            iconColor="white"
            size={28}
            onPress={() => setVisible(true)}
            style={{
              margin: 0,
              position: "absolute",
              right: 10,
              top: ios ? top : top + 10,
              zIndex: 999,
            }}
          />
          <Avatar.Image
            source={{ uri: user._j?.avatar || defaultAvatar }}
            size={100}
          />
          <Text style={Styles.fullNameText}>{user._j.full_name}</Text>
          <Text style={Styles.usernameText}>@{user._j.username}</Text>
          <View style={Styles.roleBadge}>
            <Ionicons
              name="person-outline"
              size={20}
              color={Styles.roleBadgeIcon.color}
            />
            <Text style={Styles.roleBadgeText}>
              {infoRole[user._j.user_role]}
            </Text>
          </View>
        </LinearGradient>

        <View style={Styles.infoSection}>
          <Text style={Styles.infoSectionTitle}>Thông tin cá nhân</Text>
          <Divider />

        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: "700", color: "#B2BEC3", marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
            Thông tin cá nhân
          </Text>
          
          {/* Render thông tin thủ công hoặc qua map để tùy chỉnh icon */}
          <InfoItem icon="mail-outline" label="Email" value={user._j.email} />
          <InfoItem icon="location-outline" label="Địa chỉ" value={user._j.address} />
          <InfoItem icon="calendar-outline" label="Năm sinh" value={user._j.birth} />
          <InfoItem icon="accessibility-outline" label="Tuổi" value={`${user._j.age} tuổi`} />
        </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
        <TouchableOpacity
          onPress={() => nav.navigate("ProfileUpdate")}
          style={Styles.buttonPrimary}
        >
          <Ionicons name={nameIcon.update} size={24} color="white" />
          <Text style={Styles.buttonPrimaryText}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
      </View>
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setVisible(false)}>
          <View
            style={{
              position: "absolute",
              top: ios ? top + 50 : top + 60,
              right: 15,
              backgroundColor: "white",
              borderRadius: 12,
              elevation: 5,
              minWidth: 220,
              paddingVertical: 8,
            }}
          >
            <TouchableOpacity
              style={{ padding: 15 }}
              onPress={() => {
                setVisible(false);
                nav.navigate("BookingHistory");
              }}
            >
              <Text>Lịch sử đặt chỗ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ padding: 15 }}
              onPress={() => setVisible(false)}
            >
              <Text>Đổi mật khẩu</Text>
            </TouchableOpacity>

            <Divider />

            <TouchableOpacity
              style={{ padding: 15 }}
              onPress={() => {
                setVisible(false);
                logOut();
              }}
            >
              <Text style={{ color: "red" }}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Profile;
