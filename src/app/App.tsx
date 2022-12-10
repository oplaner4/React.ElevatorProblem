import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';

import * as serviceWorker from '../serviceWorker';
import AppResponsiveBar from './components/layout/AppResponsiveBar';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.module.scss';
import { Box, Typography, Alert, IconButton } from '@mui/material';
import AppRoutes, { AppRoute, UseRoutes } from './components/AppRoutes';

import CloseIcon from '@mui/icons-material/Close';

import { useRecoilState } from 'recoil';
import { appAlertsAtom } from './state/atom';
import AppWrapper from './components/layout/AppWrapper';

export interface AppProps {
  brand: string;
  authors: string[];
}

declare module '@mui/material/styles' {
  interface Palette {
    dark: Palette['primary'];
  }

  interface PaletteOptions {
    dark: PaletteOptions['primary'];
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#0157aa',
    },
    dark: {
      main: '#343a40',
      contrastText: '#fff',
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          /* backgroundColor: '#fff',
                    color: 'red',
                    border: '1px solid #dadde9' */
        },
      },
    },
  },
});

const App: React.FC<AppProps> = ({ brand, authors }: AppProps) => {
  const [appAlerts, setAppAlerts] = useRecoilState(appAlertsAtom);
  const [activeRoute, setActiveRoute] = useState<AppRoute>(AppRoute.Default);

  useEffect(() => {
    document.title = `${UseRoutes[activeRoute].title} - ${brand}`;
  }, [activeRoute, brand]);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AppResponsiveBar />
        <Box component="main">
          <AppWrapper pt={3} pb={5} mt={2} mb={3} textAlign={{ xs: 'center', md: 'left' }}>
            <Box component="div" mb={appAlerts.length === 0 ? 0 : 3}>
              {appAlerts.map((alert, i) => (
                <Box
                  key={i}
                  component={Alert}
                  severity={alert.severity}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                      onClick={() => {
                        setAppAlerts(appAlerts.filter((_, inx) => inx !== i));
                      }}
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  mb={1}
                >
                  {alert.text}
                </Box>
              ))}
            </Box>
            <Box mb={2}>
              <Typography component="h1" variant="h4">
                {UseRoutes[activeRoute].title}
              </Typography>
            </Box>
            <AppRoutes onChange={setActiveRoute} />
          </AppWrapper>
        </Box>
        <Box
          component="footer"
          position="fixed"
          bottom={0}
          width="100%"
          py={2}
          px={3}
          boxSizing="border-box"
          bgcolor="#fff"
        >
          <Typography variant="subtitle1" color="text.secondary" align="center">
            @ {authors.join(', ')} {new Date().getFullYear()}, All rights reserved
          </Typography>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
