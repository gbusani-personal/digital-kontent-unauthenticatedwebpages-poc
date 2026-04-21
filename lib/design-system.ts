import { designTokens } from './design-tokens';

export type DesignTokens = typeof designTokens;

export const ds = designTokens;

const brandThemeMappings: Record<string, Record<string, any>> = {
  default: {},
  BUPA: {
    page: {
      background: '#edf4ff',
      backgroundColor: '#edf4ff',
      color: '#102a55',
    },
    card: {
      borderColor: '#bfd4ff',
      backgroundColor: '#ffffff',
    },
    contentHeading: {
      color: '#003271',
    },
    sectionTitle: {
      color: '#003d99',
    },
    bodyText: {
      color: '#334155',
    },
    faqCard: {
      backgroundColor: '#f7faff',
      borderColor: '#dbe7ff',
    },
    faqItem: {
      backgroundColor: '#eef4ff',
      borderColor: '#cfe1fd',
    },
    faqQuestion: {
      color: '#002f72',
    },
    tileCard: {
      backgroundColor: '#f7faff',
      borderColor: '#cfe1fd',
    },
    brandDisclaimer: {
      color: '#475569',
      borderColor: '#cfe1fd',
    },
  },
  HCF: {
    page: {
      background: '#e6f5f1',
      backgroundColor: '#e6f5f1',
      color: '#003d2d',
    },
    card: {
      borderColor: '#a8d5ca',
      backgroundColor: '#ffffff',
    },
    contentHeading: {
      color: '#E0004D',
    },
    sectionTitle: {
      color: '#E0004D',
    },
    bodyText: {
      color: '#334155',
    },
    faqCard: {
      backgroundColor: '#f0faf7',
      borderColor: '#cce8e0',
    },
    faqItem: {
      backgroundColor: '#e6f5f1',
      borderColor: '#a8d5ca',
    },
    faqQuestion: {
      color: '#004d38',
    },
    tileCard: {
      backgroundColor: '#f0faf7',
      borderColor: '#a8d5ca',
    },
    brandDisclaimer: {
      color: '#475569',
      borderColor: '#cce8e0',
    },
  },
};

export function getBrandStyles(brandKey?: string) {
  return brandThemeMappings[brandKey ?? 'default'] ?? brandThemeMappings.default;
}

export const landingPageStyles = {
  page: {
    background: ds.colors.background,
    backgroundColor: ds.colors.background,
    color: ds.colors.textPrimary,
    fontFamily: ds.typography.fontFamily,
    transition: ds.states.transition,
  },
  layout: {
    paddingLeft: ds.spacing.xl,
    paddingRight: ds.spacing.xl,
    paddingTop: ds.spacing['4xl'],
    paddingBottom: ds.spacing['4xl'],
  },
  card: {
    backgroundColor: ds.colors.surface,
    borderColor: ds.colors.border,
    borderRadius: ds.radius['3xl'],
    boxShadow: ds.colors.shadow,
    padding: ds.spacing['2xl'],
    border: `1px solid ${ds.colors.border}`,
    transition: ds.states.transition,
  },
  contentHeading: {
    fontSize: ds.typography.size['4xl'],
    lineHeight: ds.typography.lineHeight.heading,
    fontWeight: ds.typography.fontWeight.bold,
    color: ds.colors.textPrimary,
    letterSpacing: ds.typography.letterSpacing.normal,
    marginBottom: ds.spacing.lg,
  },
  sectionTitle: {
    fontSize: ds.typography.size['xl'],
    fontWeight: ds.typography.fontWeight.semibold,
    color: ds.colors.textPrimary,
    marginBottom: ds.spacing.md,
  },
  bodyText: {
    fontSize: ds.typography.size.lg,
    lineHeight: ds.typography.lineHeight.body,
    color: ds.colors.textSecondary,
    marginBottom: ds.spacing.md,
  },
  faqCard: {
    backgroundColor: ds.colors.surface,
    borderColor: ds.colors.border,
    borderRadius: ds.radius['2xl'],
    boxShadow: ds.colors.surfaceShadow,
    padding: ds.spacing.xl,
    border: `1px solid ${ds.colors.border}`,
  },
  faqItem: {
    borderColor: ds.colors.border,
    backgroundColor: ds.colors.surfaceMuted,
    borderRadius: ds.radius.lg,
    border: `1px solid ${ds.colors.border}`,
    padding: ds.spacing.md,
    marginBottom: ds.spacing.sm,
    transition: ds.states.transition,
  },
  faqQuestion: {
    color: ds.colors.textPrimary,
    fontWeight: ds.typography.fontWeight.semibold,
    fontSize: ds.typography.size.base,
    transition: ds.states.transition,
  },
  faqAnswer: {
    color: ds.colors.textSecondary,
    fontSize: ds.typography.size.base,
    lineHeight: ds.typography.lineHeight.body,
    marginTop: ds.spacing.sm,
  },
  tileCard: {
    backgroundColor: ds.colors.surface,
    borderColor: ds.colors.border,
    borderRadius: ds.radius.lg,
    boxShadow: ds.colors.surfaceShadow,
    border: `1px solid ${ds.colors.border}`,
    transition: ds.states.transition,
    overflow: 'hidden' as const,
  },
  brandDisclaimer: {
    color: ds.colors.textSecondary,
    borderColor: ds.colors.border,
    fontSize: ds.typography.size.base,
    lineHeight: ds.typography.lineHeight.body,
    paddingTop: ds.spacing.lg,
    borderTopWidth: '1px',
    borderTopStyle: 'solid' as const,
  },
  bannerImage: {
    maxHeight: ds.sizing.bannerHeight,
    borderRadius: ds.radius['2xl'],
    boxShadow: ds.colors.surfaceShadow,
  },
  logo: {
    height: ds.sizing.logoHeight,
    objectFit: 'contain' as const,
    maxWidth: '320px',
    width: 'auto' as const,
    objectPosition: 'center' as const,
  },
  logoWrapper: {
    display: 'flex' as const,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: ds.spacing['3xl'],
  },
};

export const interactiveStyles = {
  hoverBorder: {
    transition: ds.states.transition,
  },
  focus: {
    boxShadow: ds.states.focusRing,
    outline: 'none' as const,
  },
};
