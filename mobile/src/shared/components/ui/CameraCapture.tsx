// mobile/src/shared/components/ui/CameraCapture.tsx
// Full-screen camera for capturing photos (product scans, evidence).
// Uses expo-camera CameraView.

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useTranslation } from '@i18n/hooks/useTranslation';

export interface CapturedPhoto {
  uri: string;
}

export interface CameraCaptureProps {
  visible: boolean;
  onClose: () => void;
  onCapture: (photo: CapturedPhoto) => void;
}

export function CameraCapture({
  visible,
  onClose,
  onCapture,
}: CameraCaptureProps): React.ReactElement {
  const { t } = useTranslation('common');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [taking, setTaking] = useState(false);

  const handleCapture = async () => {
    if (!cameraRef.current || taking) return;
    setTaking(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      if (photo) {
        onCapture({ uri: photo.uri });
        onClose();
      }
    } finally {
      setTaking(false);
    }
  };

  if (!permission) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.center}>
          <Text style={styles.msg}>Requesting camera permission…</Text>
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.center}>
          <Text style={styles.msg}>Camera permission required</Text>
          <TouchableOpacity onPress={requestPermission} style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Allow camera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.ghostBtn}>
            <Text style={styles.ghostBtnText}>{t('actions.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityRole="button">
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
            style={styles.swapBtn}
            accessibilityRole="button"
          >
            <Text style={styles.swapText}>⟳</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.shutter}
            onPress={handleCapture}
            disabled={taking}
            accessibilityRole="button"
          >
            <View style={styles.shutterInner} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    padding: spacing.lg,
    gap: spacing.md,
  },
  msg: { color: '#fff', fontSize: typography.md, marginBottom: spacing.md, textAlign: 'center' },
  primaryBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  ghostBtn: { paddingVertical: spacing.sm },
  ghostBtnText: { color: '#fff' },
  topBar: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: '#fff', fontSize: 18 },
  swapBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapText: { color: '#fff', fontSize: 20 },
  bottomBar: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
  },
});