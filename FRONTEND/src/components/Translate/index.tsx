import { useMemo, useReducer } from 'react';
// import { FormattedMessage } from 'react-intl';
import { useCookies } from 'react-cookie';

import messages_en from '@/locale/en.json';
import messages_de from '@/locale/sp.json';

import { initialState, reducer } from './reducer';

export const messages = {
  sp: messages_de,
  en: messages_en,
};
// export const language = navigator.language.split(/[-_]/)[0];

interface Trans {
  (message: string): string;
}
interface DefaultLanguage {
  (): string;
}
declare global {
  interface Window {
    lang: any;
  }
}
if (typeof window !== 'undefined') {
  window.lang = {};
}
export const useTranslate = () => {
  //   const intl = useIntl();
  const [cookies] = useCookies(['lang']);
  const [state, dispatch] = useReducer(reducer, initialState);

  const { trans, language, defaultLanguage } = useMemo(() => {
    const language = cookies.lang || state.lang;

    const defaultLanguage: DefaultLanguage = () => {
      const languages = {
        sp: 'SPANISH',
        en: 'ENGLISH',
      };
      if (language) {
        return languages[language as keyof typeof languages];
      } else return 'ENGLISH';
    };

    const trans: Trans = message => {
      try {
        window.lang[message] = message;
        const lang = messages[language as keyof typeof messages];
        return lang[message as keyof typeof lang] || message;
      } catch (err) {
        return message;
      }
      // return <FormattedMessage id={message} defaultMessage={message} description={message} />;
    };

    return {
      trans,
      language,
      defaultLanguage,
    };
  }, [cookies.lang, state.lang]);

  return {
    trans,
    defaultLanguage,
    language,
    dispatchTranslate: dispatch,
  };
};
