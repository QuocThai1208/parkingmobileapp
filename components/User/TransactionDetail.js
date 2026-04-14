import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TransactionDetail = ({ route, navigation }) => {
  const { item } = route.params;

  const InfoRow = ({ label, value, color = '#2D3436', isBold = false }) => (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#F1F2F6'
    }}>
      <Text style={{ fontSize: 14, color: '#636E72' }}>{label}</Text>
      <Text style={{ 
        fontSize: 14, 
        color: color, 
        fontWeight: isBold ? '700' : '500',
        flex: 1,
        textAlign: 'right',
        marginLeft: 20
      }}>
        {value}
      </Text>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Header đơn giản */}
      <View style={{ alignItems: 'center', marginTop: 20, paddingVertical: 40, borderBottomWidth: 8, borderBottomColor: '#F8F9FA' }}>
        <View style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: item.transaction_type === 'WITHDRAW' ? '#FFF5F5' : '#F0FFF4',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16
        }}>
          <Ionicons 
            name={item.transaction_type === 'WITHDRAW' ? "arrow-up" : "arrow-down"} 
            size={30} 
            color={item.transaction_type === 'WITHDRAW' ? '#FF4D4F' : '#52C41A'} 
          />
        </View>
        
        <Text style={{ fontSize: 14, color: '#636E72', marginBottom: 8 }}>
          Số tiền giao dịch
        </Text>
        <Text style={{ 
          fontSize: 32, 
          fontWeight: '800', 
          color: item.transaction_type === 'WITHDRAW' ? '#2D3436' : '#52C41A' 
        }}>
          {item.transaction_type === 'WITHDRAW' ? '-' : '+'}{item.amount.toLocaleString()}đ
        </Text>
        
        <View style={{
          marginTop: 12,
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 20,
          backgroundColor: '#F0FFF4',
          borderWidth: 1,
          borderColor: '#B7EB8F'
        }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#389E0D' }}>Thành công</Text>
        </View>
      </View>

      {/* Chi tiết nội dung */}
      <View style={{ paddingHorizontal: 20 }}>
        <InfoRow label="Loại giao dịch" value={item.transaction_type === 'WITHDRAW' ? 'Rút tiền' : 'Nạp tiền'} />
        <InfoRow label="Thời gian" value={item.created_date} />
        <InfoRow label="Mã giao dịch" value={item.id} />
        <InfoRow label="Nội dung" value={item.description} isBold={true} />
        <InfoRow label="Nguồn tiền" value="Ví Smart Parking" />
      </View>

      {/* Nút hỗ trợ/Quay lại */}
      <View style={{ padding: 20, marginTop: 20 }}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: '#6A5AE0',
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>Quay về trang chủ</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={{ alignItems: 'center', marginTop: 20 }}>
          <Text style={{ color: '#6A5AE0', fontWeight: '600' }}>Báo cáo vấn đề</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default TransactionDetail;