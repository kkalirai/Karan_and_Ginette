'use client';

/* eslint-disable react/prop-types */
import { CssBaseline, ThemeProvider } from '@mui/material';
import { StylesProvider } from '@mui/styles';
import { createContext, ReactNode, useEffect, useState } from 'react';

import { themeCreator } from './base';

export const ThemeContext = createContext((_themeName: string): void => {
  console.log();
});

interface ThemeProviderWrapperProps {
  children: ReactNode;
}

const ThemeProviderWrapper: React.FC<ThemeProviderWrapperProps> = props => {
  const [themeName, _setThemeName] = useState('NebulaFighterTheme');

  useEffect(() => {
    const curThemeName = window.localStorage.getItem('appTheme') || 'NebulaFighterTheme';
    _setThemeName(curThemeName);
  }, []);

  const theme = themeCreator(themeName);
  const setThemeName = (themeName: string): void => {
    window.localStorage.setItem('appTheme', themeName);
    _setThemeName(themeName);
  };

  return (
    <StylesProvider injectFirst>
      <ThemeContext.Provider value={setThemeName}>
        <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
      </ThemeContext.Provider>
    </StylesProvider>
  );
};

const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProviderWrapper>
      <CssBaseline />
      {children}
    </ThemeProviderWrapper>
  );
};

export default AppThemeProvider;
