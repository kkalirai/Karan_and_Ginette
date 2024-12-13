'use client';

import React, { memo, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import { useCommonReducer } from '@/components/App/reducer';
import DefaultTable from '@/components/Default/Table';
import { useContainerContext } from '@/Layout/Container/context';

interface WORKOUT {
  workoutName: string;
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
      dataField: 'workoutName',
      text: 'Workout Name',
      sort: true,
    },
    {
      dataField: 'count',
      text: 'Count',
      sort: true,
    },
  ];

  const getInstructorWorkoutList = useMemo(
    () =>
      globalState?.getInstructorWorkoutList?.result
        ? globalState?.getInstructorWorkoutList?.result?.map((workouts: WORKOUT, index: number) => ({
            serial: index + 1,
            workoutName: workouts.workoutName,
            count: workouts.count,
          }))
        : [],
    [globalState?.getInstructorWorkoutList?.result],
  );

  // /* Loading /
  const isLoading = useMemo(() => state?.isEditLoading, [state?.isEditLoading]);

  return (
    <>
      <DefaultTable
        api={{
          url: 'getInstructorWorkoutList',
          body: state,
        }}
        search={false}
        columns={columns}
        data={getInstructorWorkoutList}
        loading={Boolean(isLoading)}
        title=""
        placeholder="Search by Workout Name or Count"
      />
    </>
  );
}

export default memo(Index);
