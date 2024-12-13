'use client';

import React, { useState } from 'react';
import { Placeholder } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { Bars, ThreeDots } from 'react-loader-spinner';

function ButtonLoader() {
  return (
    <div className="d-flex justify-content-center">
      <ThreeDots
        height="30"
        width="30"
        color={'var(--sp-primary)' || '#FFFFFF'}
        ariaLabel="three-circles-rotating"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
}

export function BarLoader() {
  return (
    <div className="d-flex justify-content-center">
      <Bars
        height="30"
        width="30"
        color={'var(--sp-primary)' || '#FFFFFF'}
        ariaLabel="three-circles-rotating"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
}

export function SuspenseLoader() {
  return (
    <div className="d-flex justify-content-center" style={{ marginTop: '5%' }}>
      <ThreeDots
        height="30"
        width="50"
        color={'var(--sp-primary)' || '#FFFFFF'}
        ariaLabel="three-circles-rotating"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
}

export function SimpleLoader() {
  return <Spinner animation="border" style={{ color: 'var(--sp-primary)' }} />;
}
export function TopBarLoading() {
  return (
    <>
      <Placeholder as="p" animation="wave" className="placeholdertoploader" bg="light">
        <Placeholder xs={12} />
      </Placeholder>
    </>
  );
}
export const useLoading = () => {
  return { ButtonLoader, SimpleLoader };
};

export function Loading() {
  const [loading] = useState(false);
  return loading ? (
    <div className="mainLoader">
      <div className="d-flex justify-content-center" style={{ marginTop: '25%' }}>
        <ThreeDots
          height="30"
          width="50"
          color={'#002e6e'}
          ariaLabel="three-circles-rotating"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    </div>
  ) : null;
}
