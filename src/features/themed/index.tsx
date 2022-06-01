import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Not sure yet if we really need to manually load these.
// import '@fontsource/roboto/300.css';
// import '@fontsource/roboto/400.css';
// import '@fontsource/roboto/500.css';
// import '@fontsource/roboto/700.css';

const baseDarkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const baseLightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    unlinked: {
      fontStyle: 'italic',
      color: baseDarkTheme.palette.grey['500'],
    },
    selected: {
      color: baseDarkTheme.palette.grey['50'],
      backgroundColor: baseDarkTheme.palette.grey['600'],
      borderRadius: '0.25rem',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
  typography: {
    unlinked: {
      fontStyle: 'italic',
      color: baseLightTheme.palette.grey['500'],
    },
    selected: {
      color: baseLightTheme.palette.grey['50'],
      backgroundColor: baseLightTheme.palette.grey['800'],
      borderRadius: '0.25rem',
    },
  },
});

interface ThemedProps {
  theme: 'day' | 'night';
  children: any;
}

const Themed = (props: ThemedProps) => {
  const { theme, children } = props;
  const chosenTheme = theme === 'night' ? darkTheme : lightTheme;
  return (
    <ThemeProvider theme={chosenTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default Themed;
