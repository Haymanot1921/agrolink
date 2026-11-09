// mobile/src/navigation/auth/ServiceProviderTypeScreen.tsx
// Service Provider → Input Supplier or Agricultural Expert (SRS §4.1.3, BR-026).

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import type { AuthStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'ServiceProviderType'>;
type Route = RouteProp<AuthStackParamList, 'ServiceProviderType'>;

export function ServiceProviderTypeScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { t } = useTranslation('auth');

  const handleSelect = (providerType: 'input_supplier' | 'agricultural_expert') => {
    navigation.navigate('Register', {
      role: route.params.role,
      providerType,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{t('serviceProviderType.title')}</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => handleSelect('input_supplier')}
          accessibilityRole="button"
        >
          <Text style={styles.icon} accessibilityLabel={t('serviceProviderType.inputSupplier')}>
            🧰
          </Text>
          <Text style={styles.cardTitle}>{t('serviceProviderType.inputSupplier')}</Text>
          <Text style={styles.cardDescription}>
            {t('serviceProviderType.inputSupplierDescription')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => handleSelect('agricultural_expert')}
          accessibilityRole="button"
        >
          <Text style={styles.icon} accessibilityLabel={t('serviceProviderType.agriculturalExpert')}>
            🌾
          </Text>
          <Text style={styles.cardTitle}>{t('serviceProviderType.agriculturalExpert')}</Text>
          <Text style={styles.cardDescription}>
            {t('serviceProviderType.agriculturalExpertDescription')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  icon: { fontSize: 48, marginBottom: spacing.md },
  cardTitle: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 4 },
  cardDescription: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },
});