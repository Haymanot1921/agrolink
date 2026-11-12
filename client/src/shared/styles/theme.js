import theme from '@/shared/styles/theme';

function ExampleCard() {
  return (
    <div
      style={{
        padding: theme.spacing[4],
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.card,
        fontFamily: theme.fonts.primary,
      }}
    >
      AgroLink Dashboard
    </div>
  );
}

export default ExampleCard;