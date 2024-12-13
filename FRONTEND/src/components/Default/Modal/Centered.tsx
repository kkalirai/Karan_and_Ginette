import React from 'react';
import { Modal } from 'react-bootstrap';

interface PROPS {
  id: string;
  show: boolean;
  width?: string;
  title: string;
  children: JSX.Element | JSX.Element[];
  onClose: () => void;
  outer?: boolean;
}

function Index(props: PROPS) {
  const hideModal = () => {
    if (props?.onClose) props.onClose();
  };

  return (
    <div>
      <Modal id={props.id} show={props?.show} onHide={hideModal} backdrop="static" keyboard={false} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.children}</Modal.Body>
      </Modal>
    </div>
  );
}

export default Index;
