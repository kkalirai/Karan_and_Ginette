'use client';

import React, { memo, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { useCommonReducer } from '@/components/App/reducer';
import DefaultTable from '@/components/Default/Table';
import { useContainerContext } from '@/Layout/Container/context';

interface WEIGHT {
  weight: number;
  date: string;
}

function Index() {
  const searchParams = useSearchParams();

  const clientIdData = searchParams.get('clientId');

  const { state: globalState } = useContainerContext();
  const { state, dispatch } = useCommonReducer({
    columns: {
      view: [],
      selected: [],
    },
    clientId: null,
  });
  useEffect(() => {
    dispatch({
      clientId: clientIdData,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientIdData]);

  const columns = [
    {
      dataField: 'serial',
      text: '#',
      sort: true,
    },
    {
      dataField: 'weight',
      text: 'Weight',
      sort: true,
    },
    {
      dataField: 'date',
      text: 'Date',
      sort: true,
    },
  ];

  const getWeightsList = useMemo(
    () =>
      globalState?.getWeightsList?.result
        ? globalState?.getWeightsList?.result?.map((weights: WEIGHT, index: number) => ({
            serial: index + 1,
            weight: weights.weight,
            date: weights.date,
          }))
        : [],
    [globalState?.getWeightsList?.result],
  );

  // /* Loading /
  const isLoading = useMemo(() => state?.isEditLoading, [state?.isEditLoading]);

  return (
    <>
      <DefaultTable
        api={{
          url: 'getWeightsList',
          body: state,
        }}
        search={false}
        columns={columns}
        data={getWeightsList}
        loading={Boolean(isLoading)}
        title=""
        placeholder="Search by Weight"
      />
    </>
  );
}

export default memo(Index);
