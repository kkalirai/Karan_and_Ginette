'use client';

import React, { memo, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
//import Container from 'react-bootstrap/Container';
// import DatePicker from 'react-datepicker';

import DatePicker from '@/components/Default/Datepicker';
import { useCommonReducer } from '@/components/App/reducer';
import DefaultTable from '@/components/Default/Table';
import { useContainerContext } from '@/Layout/Container/context';

interface WORKOUT {
  workoutName: string;
  date: string;
}

function Index() {
  const searchParams = useSearchParams();

  const clientIdData = searchParams.get('clientId');

  const { state: globalState } = useContainerContext();
  const { state, dispatch } = useCommonReducer({
    startDate: new Date(),
    endDate: new Date(),
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
      dataField: 'workoutName',
      text: 'WorkoutName',
      sort: true,
    },
    {
      dataField: 'date',
      text: 'Date',
      sort: true,
    },
  ];

  // Function to format date in mm/dd/yyyy format
  const formatDate = (date: string | Date) => {
    const newDate = new Date(date);
    const day = String(newDate.getDate()).padStart(2, '0');
    const month = String(newDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = newDate.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const getExercisesList = useMemo(
    () =>
      globalState?.getExercisesList?.result
        ? globalState?.getExercisesList?.result?.map((exercises: WORKOUT, index: number) => ({
            serial: index + 1,
            workoutName: exercises.workoutName,
            date: formatDate(exercises.date), // Call formatDate function
          }))
        : [],
    [globalState?.getExercisesList?.result],
  );

  // / /* Loading /
  const isLoading = useMemo(() => state?.isEditLoading, [state?.isEditLoading]);

  return (
    <>
      <div>
        <div className="d-flex flex-wrap justify-content-between align-items-center border rounded p-3 mb-3">
          <div className="form-group d-flex align-items-center mb-0">
            <label htmlFor="startDate" className="me-2">
              Start Date:
            </label>
            <DatePicker
              name={`start_date`}
              onChange={(_, date) => {
                dispatch({
                  startDate: date,
                });
              }}
              maxDate={state.endDate}
              selected={state.startDate}
            />
          </div>
          <div className="form-group d-flex align-items-center mb-0">
            <label htmlFor="endDate" className="me-2">
              End Date:
            </label>
            <DatePicker
              name={`end_date`}
              onChange={(_, date) => {
                dispatch({
                  endDate: date,
                });
              }}
              minDate={state.startDate}
              selected={state.endDate}
            />

            {/* <DatePicker
              id="endDate"
              className="form-control"
              selected={state.endDate}
              disabled={state.endDate < state.startDate}
              onChange={(date: Date) => {
                dispatch({
                  endDate: date,
                });
              }}
              onKeyDown={e => {
                e.preventDefault();
              }}
            /> */}
          </div>
        </div>
      </div>
      <DefaultTable
        api={{
          url: 'getExercisesList',
          body: state,
        }}
        search={false}
        columns={columns}
        data={getExercisesList}
        loading={Boolean(isLoading)}
        title=""
        placeholder="Search by Workout Name: "
      />
    </>
  );
}

export default memo(Index);
