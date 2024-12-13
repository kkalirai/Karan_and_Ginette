'use client';
import React, { useCallback, useEffect } from 'react';

import { useCommonReducer } from '@/components/App/reducer';
import { useRequest } from '@/components/App';

import DSCount from './Components/DSCount';

function Index() {
  const { state, dispatch } = useCommonReducer();
  const { request } = useRequest();

  const getTotalUserInstructorCount = useCallback(async () => {
    const req = (await request('getUsersTotal')) as any;
    dispatch({ getTotalUserCount: req.data.users, getTotalInstructorCount: req.data.instructors });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getTotalUserInstructorCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="row">
        <>
          <Box></Box>
          <DSCount item={{ name: 'Total Users', post_count: state?.getTotalUserCount }} />
        </>
      </div>
    </div>
  );
}

export default Index;
