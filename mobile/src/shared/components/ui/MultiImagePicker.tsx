// mobile/src/shared/components/ui/MultiImagePicker.tsx
// Pick up to N images at once (product listings, case attachments).
// SRS refs: FR-MARKET-003 (product images), §5.8 (case attachments).

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
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
import type { PickedImage } from './ImagePicker';

export interface MultiImagePickerProps {
  label?: string;
  value: PickedImage[];
  onChange: (images: PickedImage[]) => void;
  maxImages?: number;
  error?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
}

export function MultiImagePicker({
  label,
  value,
  onChange,
  maxImages = 5,
  error,
  required,
  containerStyle,
}: MultiImagePickerProps): React.ReactElement {
  const { language } = useLanguage();
  const { t } = useTranslation('common');
  const [localError, setLocalError] = useState<string | null>(null);

  const pickImages = async () => {
    setLocalError(null);
    if (value.length >= maxImages) {
      setLocalError(`Max ${maxImages} images`);
      return;
    }
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
    const remaining = maxImages - value.length;
    const result = await ImagePickerLib.launchImageLibraryAsync({
      mediaTypes: ImagePickerLib.MediaTypeOptions.Images,
      quality: 0.85,
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      orderedSelection: true,
    });
    if (result.canceled) return;
    const picked = result.assets.slice(0, remaining).map((a) => ({
      uri: a.uri,
      width: a.width,
      height: a.height,
      mimeType: a.mimeType,
      fileName: a.fileName ?? undefined,
      fileSize: a.fileSize,
    }));
    onChange([...value, ...picked]);
  };

  const removeAt = (idx: number) => {
    const next = [...value];
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <View style={styles.labelRow}>
          <Text style={[styles.label, { fontFamily: pickFontFamily(language, 'bold') }]}>
            {label}
            {required ? <Text style={styles.required}> *</Text> : null}
          </Text>
          <Text style={styles.counter}>
            {value.length}/{maxImages}
          </Text>
        </View>
      ) : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {value.map((img, idx) => (
          <View key={`${img.uri}-${idx}`} style={styles.thumbWrap}>
            <Image source={{ uri: img.uri }} style={styles.thumb} />
            <TouchableOpacity
              onPress={() => removeAt(idx)}
              style={styles.thumbRemove}
              accessibilityRole="button"
            >
              <Text style={styles.thumbRemoveText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
        {value.length < maxImages ? (
          <TouchableOpacity
            style={[styles.addBox, error && styles.addBoxError]}
            onPress={pickImages}
            accessibilityRole="button"
          >
            <Text style={styles.addIcon}>＋</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>

      {(error || localError) ? (
        <Text style={styles.errorText}>{error ?? localError}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: typography.sm, color: colors.text },
  required: { color: colors.danger },
  counter: { fontSize: typography.xs, color: colors.textMuted },
  row: { gap: spacing.sm, paddingVertical: spacing.xs },
  thumbWrap: {
    width: 88,
    height: 88,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  thumb: { width: '100%', height: '100%' },
  thumbRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbRemoveText: { color: '#fff', fontSize: 11 },
  addBox: {
    width: 88,
    height: 88,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  addBoxError: { borderColor: colors.danger },
  addIcon: { fontSize: 26, color: colors.textMuted },
  errorText: { fontSize: typography.xs + 1, color: colors.danger },
});