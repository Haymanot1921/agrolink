// mobile/src/shared/components/ui/DateRangePicker.tsx
// Calendar-driven date / date-range picker (uses react-native-calendars).
// SRS refs: §5.9 (market price date), FR-ADMIN-013 (report date ranges).

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { BottomSheet } from './BottomSheet';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';
import { formatDate } from '@i18n/utils/formatters';

export interface DateRangeValue {
  start: string | null; // YYYY-MM-DD
  end: string | null;
}

export interface DateRangePickerProps {
  label?: string;
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
  mode?: 'single' | 'range';
  minDate?: string;
  maxDate?: string;
  error?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
}

export function DateRangePicker({
  label,
  value,
  onChange,
  mode = 'range',
  minDate,
  maxDate,
  error,
  required,
  containerStyle,
}: DateRangePickerProps): React.ReactElement {
  const { language } = useLanguage();
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const [tempStart, setTempStart] = useState<string | null>(value.start);
  const [tempEnd, setTempEnd] = useState<string | null>(value.end);

  const summary =
    mode === 'single'
      ? value.start
        ? formatDate(value.start, undefined, language)
        : t('actions.selectOne')
      : value.start && value.end
      ? `${formatDate(value.start, undefined, language)} → ${formatDate(
          value.end,
          undefined,
          language,
        )}`
      : value.start
      ? `${formatDate(value.start, undefined, language)} → …`
      : t('actions.selectOne');

  const buildMarkedDates = (): Record<string, any> => {
    const marked: Record<string, any> = {};
    if (!tempStart) return marked;
    if (mode === 'single') {
      marked[tempStart] = {
        selected: true,
        selectedColor: colors.primary,
      };
      return marked;
    }
    if (!tempEnd) {
      marked[tempStart] = { startingDay: true, endingDay: true, color: colors.primary, textColor: '#fff' };
      return marked;
    }
    const start = new Date(tempStart);
    const end = new Date(tempEnd);
    const cursor = new Date(start);
    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 10);
      const isStart = key === tempStart;
      const isEnd = key === tempEnd;
      marked[key] = {
        startingDay: isStart,
        endingDay: isEnd,
        color: colors.primary,
        textColor: '#fff',
      };
      cursor.setDate(cursor.getDate() + 1);
    }
    return marked;
  };

  const handleDayPress = (day: DateData) => {
    const date = day.dateString;
    if (mode === 'single') {
      setTempStart(date);
      setTempEnd(date);
      return;
    }
    if (!tempStart || tempEnd) {
      setTempStart(date);
      setTempEnd(null);
      return;
    }
    if (date < tempStart) {
      setTempStart(date);
      setTempEnd(null);
      return;
    }
    setTempEnd(date);
  };

  const handleConfirm = () => {
    onChange({ start: tempStart, end: tempEnd });
    setOpen(false);
  };

  const handleClear = () => {
    setTempStart(null);
    setTempEnd(null);
    onChange({ start: null, end: null });
    setOpen(false);
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { fontFamily: pickFontFamily(language, 'bold') }]}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}

      <TouchableOpacity
        style={[styles.trigger, error && styles.triggerError]}
        onPress={() => setOpen(true)}
        accessibilityRole="button"
      >
        <Text style={[styles.value, { fontFamily: pickFontFamily(language, 'regular') }]} numberOfLines={1}>
          {summary}
        </Text>
        <Text style={styles.icon}>📅</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <BottomSheet visible={open} onClose={() => setOpen(false)}>
        <Text style={[styles.sheetTitle, { fontFamily: pickFontFamily(language, 'bold') }]}>
          {label ?? t('actions.selectOne')}
        </Text>
        <Calendar
          current={tempStart ?? undefined}
          minDate={minDate}
          maxDate={maxDate}
          onDayPress={handleDayPress}
          markingType={mode === 'range' ? 'period' : 'dot'}
          markedDates={buildMarkedDates()}
          theme={{
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: '#fff',
            todayTextColor: colors.primary,
            arrowColor: colors.primary,
          }}
        />
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <Text style={styles.clearText}>{t('actions.clear')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleConfirm} style={styles.confirmBtn}>
            <Text style={styles.confirmText}>{t('actions.confirm')}</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { fontSize: typography.sm, color: colors.text, marginBottom: spacing.xs },
  required: { color: colors.danger },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.card,
  },
  triggerError: { borderColor: colors.danger },
  value: { flex: 1, fontSize: typography.md, color: colors.text },
  icon: { fontSize: 16, marginLeft: spacing.sm },
  errorText: { fontSize: typography.xs + 1, color: colors.danger },
  sheetTitle: { fontSize: typography.lg, color: colors.text, marginBottom: spacing.md, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  clearBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  clearText: { fontSize: typography.md, color: colors.text, fontWeight: '600' },
  confirmBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  confirmText: { fontSize: typography.md, color: '#fff', fontWeight: '700' },
});