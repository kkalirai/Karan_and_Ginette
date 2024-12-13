import React, { memo } from 'react';

// import CreateNewCustomer from './CreateNewCustomer';
// import CustomerPreview from './CustomerPreview';
// import EditVehicle from './EditVehicle';
// import PriviewOffCanvasFooter from './PriviewOffCanvasFooter';
function OffCanvas() {
  return (
    <>
      <div className="OffCanvas show">
        <div className="canvasInner">
          {/* <CreateNewCustomer/> */}
          {/* <CustomerPreview/> */}
          {/* <EditVehicle/> */}

          {/* <PriviewOffCanvasFooter/> */}
        </div>
      </div>
    </>
  );
}

export default memo(OffCanvas);
