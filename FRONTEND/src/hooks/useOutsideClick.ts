import React, { useEffect } from 'react';

const useOutsideClick = (ref: React.RefObject<HTMLInputElement>, callback: () => void) => {
  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (ref.current && ref?.current?.contains && !ref.current.contains(target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};

export default useOutsideClick;
