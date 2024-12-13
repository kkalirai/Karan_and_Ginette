import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

import { KEYPAIR } from '@/types/interfaces';

interface PROPS {
  children: JSX.Element | JSX.Element[] | string;
  style: KEYPAIR;
  className: string;
  onClick: any;
  'aria-labelledby': string;
}
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }: PROPS, ref) => (
  <span
    ref={ref as any}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
    style={{ cursor: 'pointer' }}
  >
    {children}
  </span>
));
CustomToggle.displayName = 'CustomToggle';
// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(({ children, style, className, 'aria-labelledby': labeledBy }: PROPS, ref) => {
  return (
    <div ref={ref as any} style={style} className={className} aria-labelledby={labeledBy}>
      <ul className="list-unstyled">{children}</ul>
    </div>
  );
});
CustomMenu.displayName = 'CustomMenu';

function index({ children }: { children: JSX.Element | JSX.Element[] }) {
  return (
    <Dropdown style={{ paddingLeft: '10px' }} autoClose="outside" drop={'start'}>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" role="button">
        <i className="fa-solid fa-ellipsis-vertical" role="button"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {children instanceof Array ? (
          children.map((item: JSX.Element | string, i: number) => (
            <Dropdown.Item key={i} eventKey={i} as={'span'}>
              <span>{item}</span>
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item eventKey={'dropdownitem'} as={'span'}>
            <span>{children}</span>
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default index;
