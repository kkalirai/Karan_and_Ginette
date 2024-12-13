// hooks/useUserId.ts
import { useState } from 'react';

interface UseUserIdHook {
  userId: string | null;
  setUserId: (id: string) => void;
}

const useUserId = (): UseUserIdHook => {
  const [userId, setUserId] = useState<string | null>(null);

  const setUserIdAndExport = (id: string) => {
    setUserId(id);
    // You can export the userId here if needed for use in other components or modules
  };

  return { userId, setUserId: setUserIdAndExport };
};

export default useUserId;
