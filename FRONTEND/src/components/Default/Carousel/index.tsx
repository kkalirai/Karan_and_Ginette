import React, { useEffect, useRef, useState } from 'react';

import useWindowSize from '@/hooks/useWindowSize';

import styles from './style.module.scss';

interface VerticalAndHorizontalCarouselProps {
  children: React.ReactNode;
  direction: 'horizontal' | 'vertical';
  height?: number | string;
}

const VerticalAndHorizontalCarousel: React.FC<VerticalAndHorizontalCarouselProps> = ({
  children,
  direction,
  height,
}) => {
  const { width } = useWindowSize();

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsGrabbing(false);
    };

    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsGrabbing(true);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setStartX(event.clientX - carouselRef.current!.offsetLeft);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setStartY(event.clientY - carouselRef.current!.offsetTop);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setScrollLeft(carouselRef.current!.scrollLeft);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setScrollTop(carouselRef.current!.scrollTop);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isGrabbing) return;
    event.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const x = event.clientX - carouselRef.current!.offsetLeft;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const y = event.clientY - carouselRef.current!.offsetTop;
    const distanceX = x - startX;
    const distanceY = y - startY;
    if (direction === 'horizontal') {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      carouselRef.current!.scrollLeft = scrollLeft - distanceX;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      carouselRef.current!.scrollTop = scrollTop - distanceY;
    }
  };

  return (
    <div
      className={`${styles.carousel} ${
        direction === 'horizontal' && width > 778 ? styles.horizontal : styles.vertical
      }`}
      ref={carouselRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <div className={styles.carouselContent} style={{ maxHeight: height || '' }}>
        {children}
      </div>
    </div>
  );
};

export default VerticalAndHorizontalCarousel;
