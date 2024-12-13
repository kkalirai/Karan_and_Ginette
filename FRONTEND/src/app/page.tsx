'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function Page() {
  // Change `page` to `Page`
  const router = useRouter();
  useEffect(() => {
    router.push('/login');
  }, [router]);

  return <div>page</div>;
}

export default Page;
