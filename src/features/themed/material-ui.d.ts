import { PaletteOptions } from '@mui/material/styles/createPalette';

// declare module '@mui/material/styles/createPalette' {
//   export interface PaletteOptions {
    // textSegment: {
    //   unlinked: string;
    // };
//   }
// }

// declare module '@mui/material/styles/createTypography' {
//   export interface TypographyOptions {
//     unlinked: {
//       fontStyle: string;
//     };
//   }

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
  // declare module '@mui/material/Typography' {
  //   interface TypographyPropsVariantOverrides {
  //     'textSegment.unlinked': true;
  //   }
// }

// declare module '@mui/material/styles' {
//   interface Theme {
//     typography: {
//       unlinked: {
//
//       }
//     };
//   }
//   // allow configuration using `createTheme`
//   interface ThemeOptions {
//     status?: {
//       danger?: string;
//     };
//   }
// }
