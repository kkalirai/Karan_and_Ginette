import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from 'react-bootstrap';

function NoVehicles() {
  const router = useRouter();
  return (
    <div className="WhtBox vh-100" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="noVechicles">
        <h3>
          Unauthorized <span>You are unauthorized to access this page.</span>
        </h3>
        <div>
          {' '}
          <Button className="customBtn SmBtn" onClick={() => router.back()}>
            Click to go back
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NoVehicles;
