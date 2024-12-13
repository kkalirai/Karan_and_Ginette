import React from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';

interface PROPS {
  id: string;
  show: boolean;
  width?: string;
  title?: string;
  children: JSX.Element | JSX.Element[];
  onClose: () => void;
}

function Index(props: PROPS) {
  const hideModal = () => {
    if (props?.onClose) props.onClose();
  };
  return (
    <div>
      <Offcanvas
        style={{ width: `${props?.width || '45%'}` }}
        id={props.id}
        show={props?.show}
        onHide={hideModal}
        placement="end"
      >
        {props.title ? (
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              <div className="head">
                {' '}
                <h2> {props.title}</h2>
              </div>
            </Offcanvas.Title>
          </Offcanvas.Header>
        ) : (
          <></>
        )}
        <Offcanvas.Body>{props.children}</Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Index;
