import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SvgXml } from 'react-native-svg'; 
import { COLORS, getSlotColor } from './LotDetail';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import Toast from 'react-native-toast-message';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ParkingMapInteractive = ({ svgUrl, slots, selectedSlot, onSlotSelect }) => {
    const [svgData, setSvgData] = useState({ xml: null, rects: [], viewBox: [0, 0, 500, 500] });
    const [loading, setLoading] = useState(true);
    const [mapLayout, setMapLayout] = useState({ width: 0, height: 0 });

    useEffect(() => {
        fetch(svgUrl)
            .then(res => res.text())
            .then(xml => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xml, 'text/xml');
                const svgTag = xmlDoc.getElementsByTagName('svg')[0];
                const rectTags = xmlDoc.getElementsByTagName('rect');

                // Lấy viewBox để tính tỷ lệ scale
                const vb = svgTag.getAttribute('viewBox')?.split(/\s+|,/) || [0, 0, 500, 500];
                
                // Trích xuất tọa độ gốc của các ô rect từ file SVG
                const rectsInfo = [];
                for (let i = 0; i < rectTags.length; i++) {
                    const r = rectTags[i];
                    rectsInfo.push({
                        idAttr: r.getAttribute('id'),
                        x: parseFloat(r.getAttribute('x') || 0),
                        y: parseFloat(r.getAttribute('y') || 0),
                        w: parseFloat(r.getAttribute('width') || 0),
                        h: parseFloat(r.getAttribute('height') || 0),
                    });
                }

                setSvgData({ xml, rects: rectsInfo, viewBox: vb });
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                Toast.show({ type: 'error', text1: 'Lỗi tải sơ đồ bãi xe' });
                setLoading(false);
            });
    }, [svgUrl]);

    // Hàm tạo XML để hiển thị (vẽ màu + hiện số slot)
    const renderSvgDisplay = () => {
        if (!svgData.xml) return null;
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(svgData.xml, 'text/xml');
        const svgElement = xmlDoc.getElementsByTagName('svg')[0];

        svgData.rects.forEach(info => {
            const slot = slots.find(s => `slot-${s.slot_number}-${s.vehicle_type}-${s.is_vip}` === info.idAttr);
            if (slot) {
                const rectNode = xmlDoc.getElementById(info.idAttr);
                if (rectNode) {
                    const isSelected = selectedSlot?.id === slot.id;
                    rectNode.setAttribute('fill', getSlotColor(slot, isSelected));
                    if (slot.is_vip) rectNode.setAttribute('opacity', '0.6');

                    // Thêm Text số tầng vào giữa rect
                    const textNode = xmlDoc.createElement('text');
                    textNode.setAttribute('x', (info.x + info.w / 2).toString());
                    textNode.setAttribute('y', (info.y + info.h / 2).toString());
                    textNode.setAttribute('text-anchor', 'middle');
                    textNode.setAttribute('dominant-baseline', 'central');
                    textNode.setAttribute('font-size', '20');
                    textNode.setAttribute('font-weight', 'bold');
                    textNode.setAttribute('fill', isSelected ? '#FFFFFF' : '#2D3436');
                    textNode.appendChild(xmlDoc.createTextNode(slot.slot_number));
                    svgElement.appendChild(textNode);
                }
            }
        });
        return new XMLSerializer().serializeToString(xmlDoc);
    };

    if (loading) return <ActivityIndicator color="#6A5AE0" style={{ margin: 50 }} />;

    return (
        <View 
            style={styles.mapWrapper} 
            onLayout={(e) => setMapLayout(e.nativeEvent.layout)}
        >
            {/* LỚP 1: HIỂN THỊ SVG */}
            <SvgXml xml={renderSvgDisplay()} width="100%" height="100%" />

            {/* LỚP 2: CÁC VÙNG BẤM TÀNG HÌNH (Dùng Touchable chuẩn React Native) */}
            <View style={StyleSheet.absoluteFill}>
                {mapLayout.width > 0 && svgData.rects.map((info, index) => {
                    const slot = slots.find(s => `slot-${s.slot_number}-${s.vehicle_type}-${s.is_vip}` === info.idAttr);
                    if (!slot) return null;

                    // Tính toán tỷ lệ scale giữa tọa độ SVG gốc và kích thước thực tế trên màn hình
                    const scaleX = mapLayout.width / parseFloat(svgData.viewBox[2]);
                    const scaleY = mapLayout.height / parseFloat(svgData.viewBox[3]);

                    return (
                        <TouchableOpacity
                            key={`btn-${index}`}
                            activeOpacity={0.7}
                            style={{
                                position: 'absolute',
                                left: info.x * scaleX,
                                top: info.y * scaleY,
                                width: info.w * scaleX,
                                height: info.h * scaleY,
                                backgroundColor: 'transparent', 
                            }}
                            onPress={() => onSlotSelect(slot)}
                        />
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mapWrapper: {
        height: 300,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative', // Quan trọng để các nút con căn theo khung này
    }
});

export default ParkingMapInteractive;