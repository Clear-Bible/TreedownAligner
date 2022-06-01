import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    unlinked: React.CSSProperties;
    selected: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    unlinked?: React.CSSProperties;
    selected?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    unlinked: true;
    selected: true;
  }
}
