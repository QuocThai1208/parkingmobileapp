import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from '@react-navigation/native';
import { Icon, PaperProvider } from "react-native-paper";
import Home from './components/Home/Home';
import Login from "./components/User/Login";
import { useContext, useReducer } from "react";
import { MyDispatchContext, MyUserConText } from "./configs/Contexts";
import MyUserReducer from "./reducers/MyUserReducer";
import Register from "./components/User/Register";
import VehicleList from "./components/Vehicles/VehicleList";
import Profile from "./components/User/Profile";
import Wallet from "./components/User/Wallet";
import TransactionOptions from "./components/User/TransactionOptions";
import FeeRole from "./components/FeeRole/FeeRole";
import ProfileUpdate from "./components/User/ProfileUpdate";
import VehicleCreate from "./components/Vehicles/VehicleCreate";
import Toast from "react-native-toast-message";
import VehicleDetail from "./components/Vehicles/VehicleDetail";
import ParkingLotPicker from "./components/FeeRole/ParkingLotPicker";
import ParkingLots from "./components/ParkingLots/ParkingLots";
import LotDetail from "./components/ParkingLots/LotDetail";
import BookingDetail from "./components/ParkingLots/BookingDetail";
import PaymentConfirmation from "./components/ParkingLots/PaymentConfirmation";
import BookingHistory from "./components/User/BookingHistory";


const Stack = createNativeStackNavigator();

const HomeStachNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{ title: "Trang chủ", headerShown: false }} />
    </Stack.Navigator>
  )
}

const LoginStachNavigator = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

const VehicleStachNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="VehicleList" component={VehicleList} options={{ headerShown: false }} />
      <Stack.Screen name="FeeRole" component={FeeRole} options={{ headerShown: false }} />
      <Stack.Screen name="VehicleCreate" component={VehicleCreate} options={{ headerShown: false }} />
      <Stack.Screen name="VehicleDetail" component={VehicleDetail} options={{ headerShown: false }} />
      <Stack.Screen name="ParkingLotPicker" component={ParkingLotPicker} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

const ParkingLotNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ParkingLots" component={ParkingLots} options={{ headerShown: false }} />
      <Stack.Screen name="LotDetail" component={LotDetail} options={{ headerShown: false }} />
      <Stack.Screen name="BookingDetail" component={BookingDetail} options={{ headerShown: false }} />
      <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmation} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

const ProfileStachNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileUpdate" component={ProfileUpdate} options={{ headerShown: false }} />
      <Stack.Screen name="BookingHistory" component={BookingHistory} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}

const WalletStachNavigator = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Wallet" component={Wallet} options={{ headerShown: false }} />
      <Stack.Screen name="TransactionOptions" component={TransactionOptions} />
    </Stack.Navigator>
  )
}



const Tab = createBottomTabNavigator()
const TabNavigator = () => {
  const user = useContext(MyUserConText)
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      {(user == null || user._j == null) ? <>
        <Tab.Screen name="tab-login" component={LoginStachNavigator} options={{ tabBarStyle: { display: 'none' } }} />
      </> : <>
        <Tab.Screen name="tab-home" component={HomeStachNavigator} options={{ title: "Trang chủ", tabBarIcon: () => <Icon size={24} source="home" /> }} />
        <Tab.Screen name="tab-vehicle" component={VehicleStachNavigator} options={{ title: "Phương tiện", tabBarIcon: () => <Icon size={24} source="car" /> }} />
        <Tab.Screen name="tab-parking-lots" component={ParkingLotNavigator} options={{ title: "Bãi đỗ", tabBarIcon: () => <Icon size={24} source="map-marker" /> }} />
        <Tab.Screen name="tab-wallet" component={WalletStachNavigator} options={{ title: "Ví", tabBarIcon: () => <Icon size={24} source="wallet" /> }} />
        <Tab.Screen name="tab-profile" component={ProfileStachNavigator} options={{ title: "Profile", tabBarIcon: () => <Icon size={24} source="account" /> }} />
      </>
      }
    </Tab.Navigator>
  )
}

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);
  return (
    <PaperProvider>
      <MyUserConText.Provider value={user}>
        <MyDispatchContext.Provider value={dispatch}>
          <NavigationContainer>
            <TabNavigator />
          </NavigationContainer>
          <Toast />
        </MyDispatchContext.Provider>
      </MyUserConText.Provider>
    </PaperProvider>
  );
}

export default App;
