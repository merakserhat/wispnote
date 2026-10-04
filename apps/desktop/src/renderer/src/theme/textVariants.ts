import fonts from './fonts';

const textVariants = {
  heading: { fontSize: '30px', fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.02em' },
  title: { fontSize: '20px', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.01em' },
  subtitle: { fontSize: '16px', fontWeight: 500, lineHeight: 1.4 },
  body: { fontSize: '15px', fontWeight: 400, lineHeight: 1.5 },
  bodyBold: { fontSize: '15px', fontWeight: 600, lineHeight: 1.5 },
  bodySub: { fontSize: '13px', fontWeight: 400, lineHeight: 1.45 },
  bodySubBold: { fontSize: '13px', fontWeight: 600, lineHeight: 1.45 },
  caption: { fontSize: '12px', fontWeight: 400, lineHeight: 1.4 },
  label: {
    fontSize: '11px',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  mono: { fontSize: '12px', fontWeight: 400, lineHeight: 1.5, fontFamily: fonts.mono },
} as const;

export default textVariants;
