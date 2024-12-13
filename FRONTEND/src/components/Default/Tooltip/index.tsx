import React, { memo } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

interface PROPS {
  text: string;
  children: JSX.Element | JSX.Element[] | any;
}
function index({ text, children }: PROPS) {
  const renderTooltip = (props: any) => (
    <Tooltip id={text.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random() * 10000)} {...props}>
      {text}
    </Tooltip>
  );

  return (
    <OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
      {children}
    </OverlayTrigger>
  );
}

export default memo(index);
