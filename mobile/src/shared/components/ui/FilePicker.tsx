// mobile/src/shared/components/ui/FilePicker.tsx
// Pick any file (PDF, CSV, DOCX, etc.) via expo-document-picker.
// SRS refs: §5.16 verification documents, FR-ADMIN-003 KYC.

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface PickedFile {
  uri: string;
  name: string;
  size?: number;
  mimeType?: string;
}

export interface FilePickerProps {
  label?: string;
  /** Allowed MIME types, e.g. ['application/pdf', 'image/*'] */
  allowedTypes?: string[];
  /** Max file size in MB (default 10). */
  maxSizeMb?: number;
  value?: PickedFile | null;
  onChange: (file: PickedFile | null) => void;
  error?: string;
  required?: boolean;
  helper?: string;
  containerStyle?: ViewStyle;
}

export function FilePicker({
  label,
  allowedTypes,
  maxSizeMb = 10,
  value,
  onChange,
  error,
  required,
  helper,
  containerStyle,
}: FilePickerProps): React.ReactElement {
  const { language } = useLanguage();
  const { t } = useTranslation('common');
  const [localError, setLocalError] = useState<string | null>(null);

  const handlePick = async () => {
    setLocalError(null);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: allowedTypes ?? '*/*',
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      if (!file) return;
      if (file.size && file.size > maxSizeMb * 1024 * 1024) {
        setLocalError(`File must be less than ${maxSizeMb}MB`);
        return;
      }
      onChange({
        uri: file.uri,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
      });
    } catch {
      setLocalError(t('messages.tryAgain'));
    }
  };

  const handleRemove = () => {
    onChange(null);
    setLocalError(null);
  };

  const errorToShow = error ?? localError;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { fontFamily: pickFontFamily(language, 'bold') }]}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}

      {value ? (
        <View style={styles.fileRow}>
          <Text style={styles.fileIcon}>📄</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.fileName} numberOfLines={1}>
              {value.name}
            </Text>
            {value.size ? (
              <Text style={styles.fileMeta}>{(value.size / 1024).toFixed(0)} KB</Text>
            ) : null}
          </View>
          <TouchableOpacity onPress={handleRemove} style={styles.removeBtn} accessibilityRole="button">
            <Text style={styles.removeText}>{t('actions.remove')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.dropzone, errorToShow && styles.dropzoneError]}
          onPress={handlePick}
          accessibilityRole="button"
        >
          <Text style={styles.dropzoneIcon}>📎</Text>
          <Text style={styles.dropzoneText}>{t('actions.upload')}</Text>
        </TouchableOpacity>
      )}

      {(errorToShow || helper) ? (
        <Text style={[styles.helper, errorToShow && styles.errorText]}>
          {errorToShow ?? helper}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { fontSize: typography.sm, color: colors.text, marginBottom: spacing.xs },
  required: { color: colors.danger },
  dropzone: {
    minHeight: 100,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.card,
  },
  dropzoneError: { borderColor: colors.danger },
  dropzoneIcon: { fontSize: 26, marginBottom: spacing.xs },
  dropzoneText: { fontSize: typography.md, color: colors.textMuted, fontWeight: '600' },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  fileIcon: { fontSize: 22 },
  fileName: { fontSize: typography.md, color: colors.text, fontWeight: '600' },
  fileMeta: { fontSize: typography.xs, color: colors.textMuted, marginTop: 2 },
  removeBtn: { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  removeText: { fontSize: typography.sm, color: colors.danger, fontWeight: '600' },
  helper: { fontSize: typography.xs + 1, color: colors.textMuted },
  errorText: { color: colors.danger },
});