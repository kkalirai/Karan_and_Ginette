'use client';

import React, { memo, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { useCommonReducer } from '@/components/App/reducer';
import DefaultTable from '@/components/Default/Table';
import { useContainerContext } from '@/Layout/Container/context';

interface CLIENT {
  firstName: string;
  lastName: string;
}

function Index() {
  const searchParams = useSearchParams();

  const instructorIdData = searchParams.get('instructorId');

  const { state: globalState } = useContainerContext();
  const { state, dispatch } = useCommonReducer({
    columns: {
      view: [],
      selected: [],
    },
    instructorId: null,
  });
  useEffect(() => {
    dispatch({
      instructorId: instructorIdData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instructorIdData]);

  const columns = [
    {
      dataField: 'serial',
      text: '#',
      sort: true,
    },
    {
      dataField: 'firstName',
      text: 'First Name',
      sort: true,
    },
    {
      dataField: 'lastName',
      text: 'Last Name',
      sort: true,
    },
  ];

  const getClientsList = useMemo(
    () =>
      globalState?.getClientsList?.result
        ? globalState?.getClientsList?.result?.map((clients: CLIENT, index: number) => ({
            serial: index + 1,
            firstName: clients.firstName,
            lastName: clients.lastName,
          }))
        : [],
    [globalState?.getClientsList?.result],
  );

  // /* Loading /
  const isLoading = useMemo(() => state?.isEditLoading, [state?.isEditLoading]);

  return (
    <>
      <DefaultTable
        api={{
          url: 'getClientsList',
          body: state,
        }}
        search={false}
        columns={columns}
        data={getClientsList}
        loading={Boolean(isLoading)}
        title=""
        placeholder="Search by Name"
      />
    </>
  );
}

export default memo(Index);
