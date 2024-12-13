'use client';
import { useCallback } from 'react';

import { toastr } from '@/utils/helpers';

export const useAlert = () => {
  const toast = useCallback((title: string, icon: any) => {
    return toastr(title, icon);
  }, []);

  return { toast };
};
