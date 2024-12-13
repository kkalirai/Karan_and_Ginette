'use client';

import React, { memo, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { useCommonReducer } from '@/components/App/reducer';
import DefaultTable from '@/components/Default/Table';
import { useContainerContext } from '@/Layout/Container/context';

interface NUTRITION {
  nutritionName: string;
  count: number;
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
      sort: false,
    },
    {
      dataField: 'nutritionName',
      text: 'Nutrition Name',
      sort: true,
    },
    {
      dataField: 'count',
      text: 'Count',
      sort: true,
    },
  ];

  const getInstructorNutritionList = useMemo(
    () =>
      globalState?.getInstructorNutritionList?.result
        ? globalState?.getInstructorNutritionList?.result?.map((nutritions: NUTRITION, index: number) => ({
            serial: index + 1,
            nutritionName: nutritions.nutritionName,
            count: nutritions.count,
          }))
        : [],
    [globalState?.getInstructorNutritionList?.result],
  );

  // /* Loading /
  const isLoading = useMemo(() => state?.isEditLoading, [state?.isEditLoading]);

  return (
    <>
      <DefaultTable
        api={{
          url: 'getInstructorNutritionList',
          body: state,
        }}
        search={false}
        columns={columns}
        data={getInstructorNutritionList}
        loading={Boolean(isLoading)}
        title=""
        placeholder="Search by Nutrition Name or Count"
      />
    </>
  );
}

export default memo(Index);
