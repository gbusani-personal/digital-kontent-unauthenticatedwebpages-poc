import { designTokens } from './design-tokens';

export type DesignTokens = typeof designTokens;

export const ds = designTokens;

const brandThemeMappings: Record<string, Record<string, any>> = {
  default: {},
  BUPA: {
    page: {
      background: 'linear-gradient(135deg, #edf4ff 0%, #ffffff 100%)',
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
      background: 'linear-gradient(135deg, #e6f5f1 0%, #ffffff 100%)',
      color: '#003d2d',
    },
    card: {
      borderColor: '#a8d5ca',
      backgroundColor: '#ffffff',
    },
    contentHeading: {
      color: '#005a42',
    },
    sectionTitle: {
      color: '#008060',
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
    background: ds.colors.backgroundGradient,
    color: ds.colors.textPrimary,
    fontFamily: ds.typography.fontFamily,
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
  },
  contentHeading: {
    fontSize: ds.typography.size['4xl'],
    lineHeight: ds.typography.lineHeight.heading,
    fontWeight: ds.typography.fontWeight.bold,
    color: ds.colors.textPrimary,
    letterSpacing: ds.typography.letterSpacing.normal,
  },
  sectionTitle: {
    fontSize: ds.typography.size['xl'],
    fontWeight: ds.typography.fontWeight.semibold,
    color: ds.colors.textPrimary,
  },
  bodyText: {
    fontSize: ds.typography.size.lg,
    lineHeight: ds.typography.lineHeight.body,
    color: ds.colors.textSecondary,
  },
  faqCard: {
    backgroundColor: ds.colors.surface,
    borderColor: ds.colors.border,
    borderRadius: ds.radius['2xl'],
    boxShadow: ds.colors.surfaceShadow,
    padding: ds.spacing.xl,
  },
  faqItem: {
    borderColor: ds.colors.border,
    backgroundColor: ds.colors.surfaceMuted,
    borderRadius: ds.radius.lg,
  },
  faqQuestion: {
    color: ds.colors.textPrimary,
    fontWeight: ds.typography.fontWeight.semibold,
  },
  faqAnswer: {
    color: ds.colors.textSecondary,
  },
  tileCard: {
    backgroundColor: ds.colors.surface,
    borderColor: ds.colors.border,
    borderRadius: ds.radius.lg,
    boxShadow: ds.colors.surfaceShadow,
  },
  brandDisclaimer: {
    color: ds.colors.textSecondary,
    borderColor: ds.colors.border,
  },
  bannerImage: {
    maxHeight: ds.sizing.bannerHeight,
    borderRadius: ds.radius['2xl'],
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
