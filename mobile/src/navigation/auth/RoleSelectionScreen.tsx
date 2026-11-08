// mobile/src/navigation/auth/RoleSelectionScreen.tsx
// 5-actor role selection (SRS §4.1). Service Provider → secondary screen.

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { ActorIcons } from '@assets/assets';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import type { AuthStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'RoleSelection'>;

interface Role {
  key: 'farmer' | 'buyer' | 'service_provider' | 'support_agent' | 'administrator';
  icon: number;
  labelKey: string;
  descriptionKey: string;
}

const ROLES: Role[] = [
  {
    key: 'farmer',
    icon: ActorIcons.farmer,
    labelKey: 'roleSelection.farmer',
    descriptionKey: 'roleSelection.farmerDescription',
  },
  {
    key: 'buyer',
    icon: ActorIcons.buyer,
    labelKey: 'roleSelection.buyer',
    descriptionKey: 'roleSelection.buyerDescription',
  },
  {
    key: 'service_provider',
    icon: ActorIcons.inputSupplier,
    labelKey: 'roleSelection.serviceProvider',
    descriptionKey: 'roleSelection.serviceProviderDescription',
  },
  {
    key: 'support_agent',
    icon: ActorIcons.supportAgent,
    labelKey: 'roleSelection.supportAgent',
    descriptionKey: 'roleSelection.supportAgentDescription',
  },
  {
    key: 'administrator',
    icon: ActorIcons.administrator,
    labelKey: 'roleSelection.administrator',
    descriptionKey: 'roleSelection.administratorDescription',
  },
];

export function RoleSelectionScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation('auth');

  const handleSelect = (role: Role) => {
    if (role.key === 'service_provider') {
      navigation.navigate('ServiceProviderType', { role: 'service_provider' });
      return;
    }
    navigation.navigate('Register', { role: role.key });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{t('roleSelection.title')}</Text>
        <Text style={styles.subtitle}>{t('roleSelection.subtitle')}</Text>

        <View style={styles.list}>
          {ROLES.map((role) => (
            <TouchableOpacity
              key={role.key}
              style={styles.card}
              onPress={() => handleSelect(role)}
              accessibilityRole="button"
              accessibilityLabel={t(role.labelKey)}
            >
              <Image source={role.icon} style={styles.icon} />
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{t(role.labelKey)}</Text>
                <Text style={styles.cardDescription}>{t(role.descriptionKey)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => navigation.replace('Login')}
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>
            {t('welcome.haveAccount')} <Text style={styles.loginLinkText}>{t('login.submit')}</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing['2xl'] },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  list: { gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: { width: 48, height: 48, marginRight: spacing.md },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: colors.text },
  cardDescription: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  loginLink: { marginTop: spacing.xl, alignItems: 'center' },
  loginText: { fontSize: 14, color: colors.textMuted },
  loginLinkText: { color: colors.primary, fontWeight: '600' },
});