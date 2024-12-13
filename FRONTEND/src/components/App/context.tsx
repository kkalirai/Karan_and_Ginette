import React, { useContext } from 'react';

import { useCommonReducer } from '@/components/App/reducer';

const AppContext = React.createContext<any>(null);

interface Props {
  children: JSX.Element | JSX.Element[];
}
export const ContextProvider = ({ children }: Props) => {
  const { state, dispatch } = useCommonReducer();

  return <AppContext.Provider value={{ state, dispatch } as any}>{children}</AppContext.Provider>;
};

export function useCommonContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an ContextProvider');
  }
  return context;
}
