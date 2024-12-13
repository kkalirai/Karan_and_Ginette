import React from 'react';

import style from '@/styles/Components/Dashboard/Dashboard.module.scss';

interface PROPS {
  item: {
    name: string;
    post_count: number;
  };
}
function DSCount({ item }: PROPS) {
  return (
    <div className="col-lg-3 col-md-3 col-sm-6">
      <div className={`d-flex flex-column card card-body shadow-lg p-3 m-3 ${style.dscount}`}>
        <span className="text-uppercase">{item.name}</span>
        <h2 className="h2">{item.post_count}</h2>
      </div>
    </div>
  );
}

export default DSCount;
