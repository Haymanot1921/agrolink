// mobile/src/navigation/auth/OnboardingScreen.tsx
// 5-slide onboarding — one per actor (SRS §4.1) + Amharic support.

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { Button } from '@components/ui/Button';
import { OnboardingImages } from '@assets/assets';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import type { AuthStackParamList } from '@navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

interface Slide {
  key: string;
  image: number;
  titleKey: string;
  bodyKey: string;
}

const SLIDES: Slide[] = [
  {
    key: 'farmer',
    image: OnboardingImages.step1,
    titleKey: 'onboarding.step1Title',
    bodyKey: 'onboarding.step1Body',
  },
  {
    key: 'buyer',
    image: OnboardingImages.step2,
    titleKey: 'onboarding.step2Title',
    bodyKey: 'onboarding.step2Body',
  },
  {
    key: 'expert',
    image: OnboardingImages.step3,
    titleKey: 'onboarding.step3Title',
    bodyKey: 'onboarding.step3Body',
  },
  {
    key: 'agent',
    image: OnboardingImages.step4,
    titleKey: 'onboarding.step4Title',
    bodyKey: 'onboarding.step4Body',
  },
  {
    key: 'admin',
    image: OnboardingImages.step5,
    titleKey: 'onboarding.step5Title',
    bodyKey: 'onboarding.step5Body',
  },
];

export function OnboardingScreen(): React.ReactElement {
  const navigation = useNavigation<Nav>();
  const { t } = useTranslation('auth');
  const { language, toggleLanguage } = useLanguage();
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const isLast = index === SLIDES.length - 1;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (newIndex !== index) setIndex(newIndex);
  };

  const goNext = () => {
    if (isLast) {
      navigation.replace('RoleSelection');
      return;
    }
    flatListRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  const goSkip = () => {
    navigation.replace('RoleSelection');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Language toggle (top right) */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={toggleLanguage} accessibilityRole="button">
          <Text style={styles.langToggle}>
            {language === 'en' ? 'አማርኛ' : 'English'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={goSkip} accessibilityRole="button">
          <Text style={styles.skip}>{t('actions.skip', { ns: 'common' })}</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{t(item.titleKey)}</Text>
            <Text style={styles.body}>{t(item.bodyKey)}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === index && styles.dotActive]}
          />
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title={isLast ? t('welcome.getStarted') : t('actions.next', { ns: 'common' })}
          onPress={goNext}
          variant="primary"
          fullWidth
        />
        {isLast && (
          <Button
            title={t('welcome.haveAccount')}
            onPress={() => navigation.replace('Login')}
            variant="ghost"
            fullWidth
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  langToggle: { fontSize: 14, color: colors.primary, fontWeight: '600' },
  skip: { fontSize: 14, color: colors.textMuted },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  image: { width: '80%', height: 260, marginBottom: spacing.xl },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  body: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  actions: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
});