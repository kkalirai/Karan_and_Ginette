import React from 'react';
import { Form } from 'react-bootstrap';

interface PROPS {
  name: string;
  label?: string | JSX.Element;
  checked?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function index(props: PROPS) {
  return (
    <Form.Check
      id={Math.random() * 1000 + 'Checkox'}
      name={props.name}
      checked={props?.checked}
      onChange={props.onChange}
    />
  );
}

export default index;
