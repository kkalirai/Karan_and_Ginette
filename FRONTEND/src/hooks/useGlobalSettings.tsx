'use client';
import { useCallback, useEffect, useMemo } from 'react';

import { useCommonReducer } from '@/components/App/reducer';
import { KEYPAIR, SETTINGS_PAYLOAD } from '@/types/interfaces';

interface PROPS {
  branding: {
    columnData: KEYPAIR;
  };
}

const useGlobalSetting = (props: PROPS) => {
  const { branding } = props;
  const { state, dispatch } = useCommonReducer({
    primaryColor: (branding?.columnData?.primaryColor || '#000000') as string,
    font: (branding?.columnData?.font || 'Inter') as string,
  });

  const updateGlobalSetting = useCallback((data: SETTINGS_PAYLOAD) => {
    dispatch({
      ...data,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logoURL = useMemo(() => {
    if (state?.logo) {
      return state?.logo;
    } else if (branding?.columnData?.logo) {
      return `${branding?.columnData?.logo}`;
    } else {
      return '/assets/images/logoMain.png';
    }
  }, [branding?.columnData?.logo, state?.logo]);

  const bannerURL = useMemo(() => {
    if (state?.banner) {
      return state?.banner;
    } else if (branding?.columnData?.banner) {
      return `${branding?.columnData?.banner}`;
    } else {
      return '/assets/images/logoMain.png';
    }
  }, [branding?.columnData?.banner, state?.banner]);

  const getGlobalSettings: () => SETTINGS_PAYLOAD = useCallback(() => {
    return {
      logo: "",
      banner: bannerURL,
      font: state.font,
      primaryColor: state.primaryColor,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branding?.columnData, state, logoURL, bannerURL]);

  useEffect(() => {
    const root = document.documentElement;
    root?.style.setProperty('--sp-primary', state?.primaryColor);
    root?.style.setProperty('--sp-font-family', state?.font);
  }, [state]);

  return {
    updateGlobalSetting,
    getGlobalSettings,
  };
};

export default useGlobalSetting;
