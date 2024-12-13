import React from 'react';

interface PROPS {
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
}
function NImage(props: PROPS) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img width={props?.width || '100%'} height={props?.height || '100%'} src={props?.src} alt={props.alt || ''} />;
  // return <Image width={props?.width || 100} height={props?.height || 100} src={props?.src} alt={props.alt || ''} />;
}

export default NImage;
