import React, { useEffect, useRef, useState } from 'react';

import styles from '@/styles/Components/Default/SelectOptions.module.scss';

interface PROPS {
  label: JSX.Element;
  position?: ('static' | 'relative' | 'absolute' | 'sticky' | 'fixed') | undefined;
  onItemClick?: (pr: string) => void;
  items?: string[];
  children?: JSX.Element | JSX.Element[] | string;
}
function LoadStatusList(props: PROPS) {
  const { children } = props;
  const wrapperRef = useRef() as any;
  const [showList, setShowList] = useState(false);

  function showStatusList() {
    setShowList(!showList);
  }

  useEffect(() => {
    const outSideModalClickEvent = (event: MouseEvent) => {
      if (wrapperRef && !wrapperRef.current?.contains(event.target)) {
        setShowList(false);
        if (wrapperRef?.current?.classList) {
          wrapperRef.current.classList.remove('show');
        }
      }
    };

    const removeListener = () => {
      document.removeEventListener('click', outSideModalClickEvent, false);
    };
    document.addEventListener('click', outSideModalClickEvent, false);
    return () => {
      removeListener();
    };
  }, []);
  return (
    <div ref={wrapperRef}>
      <span role="button" onClick={showStatusList}>
        {props.label}
      </span>
      {/* <p className="text-capitalize badge rounded-pill bg-info">{props.label}</p> */}
      {showList && (props?.items?.length || props?.children) && (
        <ul className={styles.customStatusList} style={{ position: props?.position || 'relative', inset: 'auto' }}>
          {children && children instanceof Array
            ? children.map((item: JSX.Element | string, index: number) => (
                <li role="button" key={index}>
                  {item}
                </li>
              ))
            : props.items &&
              props.items.map((pr, index) => (
                <li
                  role="button"
                  key={index}
                  onClick={() => {
                    setShowList(false);
                    if (props.onItemClick) props?.onItemClick(pr);
                  }}
                >
                  {pr}
                </li>
              ))}
        </ul>
      )}
    </div>
  );
}

export default LoadStatusList;
