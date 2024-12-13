import React, { memo, useEffect, useRef, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

import styles from '@/styles/Components/Default/Popover.module.scss';

interface PROPS {
  header: string;
  children: JSX.Element | JSX.Element[] | any;
  label: JSX.Element | JSX.Element[] | any;
}
function Index({ header, children, label }: PROPS) {
  const [show, setshow] = useState(false);
  const wrapperRef = useRef() as any;
  const renderPopover = (props: any) => (
    <Popover
      className={styles.popoverContainer}
      id={header.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random() * 10000)}
      {...props}
    >
      <Popover.Header
        className={styles.popoverHeader}
        style={{ backgroundColor: '#3299cc', color: 'white', textAlign: 'center' }}
      >
        {header}
      </Popover.Header>
      <Popover.Body className={styles.popoverBody}>{children}</Popover.Body>
    </Popover>
  );
  const onToggle = () => {
    setshow(!show);
  };

  useEffect(() => {
    const outSideModalClickEvent = (event: MouseEvent) => {
      if (wrapperRef && !wrapperRef.current?.contains(event.target)) {
        setshow(false);
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
    <OverlayTrigger
      show={show}
      onToggle={onToggle}
      trigger={['focus', 'click']}
      delay={{ show: 250, hide: 400 }}
      placement="left"
      overlay={renderPopover}
      onExited={() => setshow(false)}
    >
      <span ref={wrapperRef}>{label}</span>
    </OverlayTrigger>
  );
}

export default memo(Index);
