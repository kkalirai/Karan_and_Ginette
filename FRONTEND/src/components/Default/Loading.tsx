import React, { Suspense } from 'react';

type props = {
  children: React.ReactNode;
};
function Loading(props: props) {
  return <Suspense fallback={<div>Loading...</div>}>{props.children}</Suspense>;
}

export default Loading;
