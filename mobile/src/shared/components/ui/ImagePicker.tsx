// mobile/src/shared/components/ui/ImagePicker.tsx
// Pick a single image from gallery or camera (expo-image-picker).
// SRS refs: FR-MARKET-003, §13.3.

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewStyle,
  Alert as RNAlert,
  Linking,
} from 'react-native';
import * as ImagePickerLib from 'expo-image-picker';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface PickedImage {
  uri: string;
  width?: number;
  height?: number;
  mimeType?: string;
  fileName?: string;
  fileSize?: number;
}

export interface ImagePickerProps {
  label?: string;
  value?: PickedImage | null;
  onChange: (image: PickedImage | null) => void;
  /** Aspect ratio for preview (default: square). */
  aspect?: [number, number];
  /** Max width/height — image will be resized. */
  maxDimension?: number;
  error?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
}

export function ImagePicker({
  label,
  value,
  onChange,
  aspect = [1, 1],
  maxDimension = 1600,
  error,
  required,
  containerStyle,
}: ImagePickerProps): React.ReactElement {
  const { language } = useLanguage();
  const { t } = useTranslation('common');
  const [localError, setLocalError] = useState<string | null>(null);

  const pickFromGallery = async () => {
    setLocalError(null);
    const perm = await ImagePickerLib.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      if (!perm.canAskAgain) {
        RNAlert.alert(
          'Permission required',
          'Please allow photo access in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
        );
      }
      return;
    }
    const result = await ImagePickerLib.launchImageLibraryAsync({
      mediaTypes: ImagePickerLib.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset) return;
    onChange({
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      mimeType: asset.mimeType,
      fileName: asset.fileName ?? undefined,
      fileSize: asset.fileSize,
    });
  };

  const pickFromCamera = async () => {
    setLocalError(null);
    const perm = await ImagePickerLib.requestCameraPermissionsAsync();
    if (!perm.granted) {
      if (!perm.canAskAgain) {
        RNAlert.alert(
          'Permission required',
          'Please allow camera access in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
        );
      }
      return;
    }
    const result = await ImagePickerLib.launchCameraAsync({
      mediaTypes: ImagePickerLib.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset) return;
    onChange({
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      mimeType: asset.mimeType,
      fileName: asset.fileName ?? undefined,
      fileSize: asset.fileSize,
    });
  };

  const openOptions = () => {
    RNAlert.alert(t('actions.upload'), '', [
      { text: 'Camera', onPress: pickFromCamera },
      { text: 'Gallery', onPress: pickFromGallery },
      { text: t('actions.cancel'), style: 'cancel' },
    ]);
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { fontFamily: pickFontFamily(language, 'bold') }]}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}

      {value ? (
        <View style={styles.previewWrap}>
          <Image source={{ uri: value.uri }} style={styles.preview} resizeMode="cover" />
          <TouchableOpacity
            onPress={() => onChange(null)}
            style={styles.removeBtn}
            accessibilityRole="button"
          >
            <Text style={styles.removeText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.dropzone, error && styles.dropzoneError]}
          onPress={openOptions}
          accessibilityRole="button"
        >
          <Text style={styles.dropzoneIcon}>🖼</Text>
          <Text style={styles.dropzoneText}>{t('actions.upload')}</Text>
        </TouchableOpacity>
      )}

      {(error || localError) ? (
        <Text style={styles.errorText}>{error ?? localError}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { fontSize: typography.sm, color: colors.text, marginBottom: spacing.xs },
  required: { color: colors.danger },
  dropzone: {
    minHeight: 120,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  dropzoneError: { borderColor: colors.danger },
  dropzoneIcon: { fontSize: 30, marginBottom: spacing.xs },
  dropzoneText: { fontSize: typography.md, color: colors.textMuted, fontWeight: '600' },
  previewWrap: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    aspectRatio: 1,
    width: '100%',
    maxWidth: 280,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  preview: { width: '100%', height: '100%' },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { color: '#fff', fontSize: 14 },
  errorText: { fontSize: typography.xs + 1, color: colors.danger },
});