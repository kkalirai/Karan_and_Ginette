'use client';

import { useMediaQuery, useTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { useRequest } from '@/components/App';
import { useCommonReducer } from '@/components/App/reducer';
import { KEYPAIR, REQUEST } from '@/types/interfaces';
import { getDecodedToken, logout as clearCookies, validateAuthentication } from '@/utils/helpers';

// Sidebar Context
type SidebarContextType = {
  sidebarToggle: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
};

export const SidebarContext = createContext<SidebarContextType>({
  sidebarToggle: false,

  toggleSidebar: () => {
    undefined;
  },
  closeSidebar: () => {
    false;
  },
});

// App Context
const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

interface CONTEXTVALUE {
  state: any;
  dispatch: React.Dispatch<KEYPAIR>;
  logout: () => void;

  currentColor: string;
  currentMode: string;
  activeMenu: boolean;
  screenSize: number | undefined;
  themeSettings: boolean;
  isClicked: typeof initialState;
  setScreenSize: React.Dispatch<React.SetStateAction<number | undefined>>;
  setCurrentColor: (color: string) => void;
  setCurrentMode: (mode: string) => void;
  setThemeSettings: React.Dispatch<React.SetStateAction<boolean>>;
  setIsClicked: React.Dispatch<React.SetStateAction<typeof initialState>>;
  setActiveMenu: React.Dispatch<React.SetStateAction<boolean>>;
  handleClick: (clicked: keyof typeof initialState) => void;

  sidebarToggle: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  largeScreen: boolean;
}

const AppContext = createContext<CONTEXTVALUE | null>(null);

interface Props {
  children: ReactNode;
}

export const ContainerContextProvider = ({ children }: Props) => {
  const router = useRouter();
  const asPath = usePathname();
  const { state, dispatch } = useCommonReducer({
    profileDetail: {},
    show: false,
  });
  const theme = useTheme();
  const largeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const { request } = useRequest();
  const [screenSize, setScreenSize] = useState<number | undefined>(undefined);
  const [currentColor, setCurrentColor] = useState<string>('#03C9D7');
  const [currentMode, setCurrentMode] = useState<string>('Light');
  const [themeSettings, setThemeSettings] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<boolean>(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [sidebarToggle, setSidebarToggle] = useState(!largeScreen || asPath.startsWith('/chat') ? true : false);

  const toggleSidebar = () => setSidebarToggle(!sidebarToggle);
  const closeSidebar = () => setSidebarToggle(false);

  const handleClick = (clicked: keyof typeof initialState) => setIsClicked({ ...initialState, [clicked]: true });

  const setMode = (mode: string) => {
    setCurrentMode(mode);
    localStorage.setItem('themeMode', mode);
  };

  const setColor = (color: string) => {
    setCurrentColor(color);
    localStorage.setItem('colorMode', color);
  };

  const value: CONTEXTVALUE = {
    state,
    dispatch,
    logout,
    currentColor,
    currentMode,
    activeMenu,
    screenSize,
    setScreenSize,
    setCurrentColor: setColor,
    setCurrentMode: setMode,
    themeSettings,
    setThemeSettings,
    handleClick,
    isClicked,
    setIsClicked,
    setActiveMenu,
    sidebarToggle,
    toggleSidebar,
    closeSidebar,
    largeScreen,
  };

  function logout() {
    clearCookies();
    router.push('/login');
  }

  async function fetchProfileDetails() {
    const { decoded, isValid } = getDecodedToken('');
    if (!isValid) return;
    const detail = (await request('getUserProfile', { id: decoded.userId })) as REQUEST;
    if (detail) {
      dispatch({ profileDetail: detail?.data });
    }
  }

  useEffect(() => {
    if (!validateAuthentication()) {
      logout();
    }
    fetchProfileDetails();
  }, [asPath]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useContainerContext() {
  const context = useContext(AppContext);
  if (context === null) {
    throw new Error('useContainerContext must be used within a ContainerContextProvider');
  }
  return context;
}
