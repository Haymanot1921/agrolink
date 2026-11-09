// mobile/src/pages/experts/_fallbacks/GuestExpertDetailsFallback.tsx
// Self-contained expert profile (guest) — permitted info only (FR-CONSULT-002).

import React from 'react';
import { ScrollView, Text, StyleSheet, Image, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';

import { api } from '@services/apiClient';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { ErrorState } from '@components/ui/ErrorState';
import { StarRating } from '@components/ui/StarRating';
import { AppButton } from '@components/ui/AppButton';
import { Badge } from '@components/ui/Badge';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useTheme } from '@styles/useTheme';

export interface GuestExpertDetailsFallbackProps {
  expertId?: string;
  onRequireAuth: () => void;
}

interface PublicExpertDetails {
  id: string;
  full_name: string;
  avatar_url?: string;
  biography?: string;
  education?: { degree: string; institution: string; year?: number }[];
  experience_years?: number;
  certifications?: { name: string; issuer?: string; year?: number }[];
  specializations?: string[];
  languages?: string[];
  rating_avg?: number;
  rating_count?: number;
  consultation_fee_etb?: number;
}

export function GuestExpertDetailsFallback({
  expertId,
  onRequireAuth,
}: GuestExpertDetailsFallbackProps): React.ReactElement {
  const { t } = useTranslation('buyer');
  const { colors, spacing } = useTheme();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['public-expert', expertId],
    queryFn: () => api.get<PublicExpertDetails>(`/public/experts/${expertId}`),
    enabled: Boolean(expertId),
  });

  if (!expertId) {
    return (
      <View style={{ padding: spacing.lg }}>
        <Text style={{ color: colors.textMuted }}>
          {t('consultations.noExperts', { defaultValue: 'No expert selected' })}
        </Text>
      </View>
    );
  }
  if (isLoading) return <LoadingSpinner fullScreen />;
  if (error || !data) {
    return <ErrorState message={(error as Error)?.message} onRetry={refetch} />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing['2xl'] }}>
      <View style={styles.header}>
        {data.avatar_url ? (
          <Image source={{ uri: data.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>E</Text>
          </View>
        )}
        <Text style={[styles.name, { color: colors.text }]}>{data.full_name}</Text>
        {data.specializations?.length ? (
          <View style={styles.badgeRow}>
            {data.specializations.map((s) => (
              <Badge key={s} label={s.replace(/_/g, ' ')} variant="primary" size="sm" />
            ))}
          </View>
        ) : null}
        {data.rating_avg ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <StarRating rating={data.rating_avg} size={16} />
            <Text style={[styles.rating, { color: colors.textMuted }]}>
              {' '}
              {data.rating_avg.toFixed(1)} ({data.rating_count ?? 0} reviews)
            </Text>
          </View>
        ) : null}
      </View>

      {data.experience_years ? (
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Experience</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {data.experience_years} years
          </Text>
        </View>
      ) : null}

      {data.languages?.length ? (
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Languages</Text>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {data.languages.join(' · ')}
          </Text>
        </View>
      ) : null}

      {data.biography ? (
        <>
          <Text style={[styles.h2, { color: colors.text }]}>About</Text>
          <Text style={[styles.body, { color: colors.textMuted }]}>{data.biography}</Text>
        </>
      ) : null}

      {data.education?.length ? (
        <>
          <Text style={[styles.h2, { color: colors.text }]}>Education</Text>
          {data.education.map((ed, i) => (
            <Text key={i} style={[styles.body, { color: colors.textMuted }]}>
              • {ed.degree} — {ed.institution}
              {ed.year ? ` (${ed.year})` : ''}
            </Text>
          ))}
        </>
      ) : null}

      {data.certifications?.length ? (
        <>
          <Text style={[styles.h2, { color: colors.text }]}>Certifications</Text>
          {data.certifications.map((c, i) => (
            <Text key={i} style={[styles.body, { color: colors.textMuted }]}>
              • {c.name}
              {c.issuer ? ` — ${c.issuer}` : ''}
              {c.year ? ` (${c.year})` : ''}
            </Text>
          ))}
        </>
      ) : null}

      {data.consultation_fee_etb ? (
        <View style={[styles.feeCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Text style={[styles.feeLabel, { color: colors.textMuted }]}>Consultation fee</Text>
          <Text style={[styles.feeValue, { color: colors.text }]}>
            ETB {data.consultation_fee_etb.toFixed(2)}
          </Text>
        </View>
      ) : null}

      <View style={{ marginTop: 24 }}>
        <AppButton
          title={t('consultations.request', { defaultValue: 'Request consultation' })}
          onPress={onRequireAuth}
          fullWidth
        />
        <Text style={[styles.note, { color: colors.textSubtle }]}>
          You'll need to log in to request a consultation.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 96, height: 96, borderRadius: 48, marginBottom: 12, backgroundColor: '#eee' },
  avatarPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: '#555', fontSize: 36, fontWeight: '700' },
  name: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginTop: 8,
  },
  rating: { fontSize: 12 },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  statLabel: { fontSize: 13 },
  statValue: { fontSize: 14, fontWeight: '600' },
  h2: { fontSize: 16, fontWeight: '700', marginTop: 20, marginBottom: 6 },
  body: { fontSize: 14, lineHeight: 22 },
  feeCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  feeLabel: { fontSize: 12 },
  feeValue: { fontSize: 22, fontWeight: '800', marginTop: 4 },
  note: { fontSize: 11, textAlign: 'center', marginTop: 12 },
});