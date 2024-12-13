'use client';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DownloadIcon from '@mui/icons-material/Download';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Button, Typography, Container, Grid, Drawer, Box, IconButton, useTheme, Tooltip } from '@mui/material';
import Head from 'next/head';

import PageHeader from '@/components/Default/PageHeader';
import PageTitleWrapper from '@/components/Default/PageTitleWrapper';
import React, { memo, useMemo, useState } from 'react';

import { useRequest } from '@/components/App';
import { useCommonReducer } from '@/components/App/reducer';
import DefaultTable from '@/components/Default/Table';
import { useContainerContext } from '@/Layout/Container/context';
import { REQUEST } from '@/types/interfaces';
import { confirmDialog, deleteDialog, toastr } from '@/utils/helpers';

import WorkoutForm from './Components/WorkoutForm';
interface WORKOUT {
  id: string;
  name: string;
  muscle_group: string
  createdAt: string;
  updatedAt: string;
  action: JSX.Element;
  goal: string;
}

function Index() {
  const theme = useTheme();
  const { request, loading } = useRequest();
  const { state: globalState } = useContainerContext();
  const { state, dispatch } = useCommonReducer({
    columns: {
      view: [],
      selected: [],
    },
  });

  const removeUser = async (id: string | string[]) => {
    if (!id?.length) return;
    const confirm = await deleteDialog('Are you sure you want to delete the workout/workouts?', 'Delete Workout');
    if (confirm) {
      const res = (await request('removeWorkoutFromList', { id: id })) as REQUEST;
      if (res) toastr('The workout has been successfully removed.', 'success', 'Workout removed');
      dispatch({ workoutDetail: {}, multirecordSelected: false, viewUserPreviewModal: false });
    }
  };
  
  const exportToCSV = async () => {
    const moduleName = 'workouts';

    const confirm = await confirmDialog('Are you sure you want to export Table to CSV?');
    if (!confirm) return;
    (await request('exportTable', { moduleName })) as REQUEST;
  };


  const columns = [
    {
      dataField: 'serial',
      text: '#',
      sort: true,
    },
    {
      dataField: 'name',
      text: 'Name',
      sort: true,
      search: true,
    },
    {
      dataField: 'muscle_group',
      text: 'Muscle Group',
      sort: false,
      search: true,
    },
    {
      dataField: 'goal',
      text: 'Goal',
      sort: false,
      search: true,
    },
    {
      dataField: 'action',
      text: 'Action',
    },
  ];

  const [mobileEditOpen, setMobileEditOpen] = useState(false);
  const handleEditDrawerToggle = (data?: WORKOUT, edit: boolean = true) => {
    if (data) {
      dispatch({
        workoutDetail: data, 
        edit
      });
    }else{
      dispatch({
        workoutDetail: undefined, 
        edit
      });
    }
    setMobileEditOpen(!mobileEditOpen);
  };
  

  const getWorkoutsList = useMemo(
    () =>
      globalState?.getWorkoutsList?.result
        ? globalState?.getWorkoutsList?.result?.map((workout: WORKOUT, index: number) => ({
            serial: (
              <Typography variant="body2" color="text.secondary" noWrap>
                {index+1}
              </Typography>
            ),
            name: (
              <Typography variant="body2" color="text.secondary" noWrap>
                {workout.name}
              </Typography>
            ),
            muscle_group: (
              <Typography variant="body2" color="text.secondary" noWrap>
                {workout.muscle_group}
              </Typography>
            ),
            goal: (
              <Typography variant="body2" color="text.secondary" noWrap>
                {workout.goal}
              </Typography>
            ),
            action: (
              <>
                <Tooltip title="Edit Record" arrow>
                  <IconButton
                    onClick={() => handleEditDrawerToggle(workout)}
                    sx={{
                      '&:hover': {
                        background: theme.colors.primary.lighter,
                      },
                      color: theme.palette.primary.main,
                    }}
                    color="inherit"
                    size="small"
                  >
                    <EditTwoToneIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Record" arrow>
                  <IconButton
                    sx={{
                      '&:hover': { background: theme.colors.error.lighter },
                      color: theme.palette.error.main,
                    }}
                    color="inherit"
                    size="small"
                    onClick={() => removeUser([workout.id])}
                  >
                    <DeleteTwoToneIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            ),
          }))
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [globalState?.getWorkoutsList?.result],
  );

  // /* Loading /
  const isLoading = useMemo(
    () => loading?.removeWorkoutFromList_LOADING || state?.isEditLoading,
    [loading, state?.isEditLoading],
  );
  return (
    <>
      <Head>
        <title>Security Questions - Applications</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          heading="Workouts"
          content={<Typography variant="subtitle2">Manage your Workouts</Typography>}
          action={
            <>
             <Button
              sx={{ mt: { xs: 2, md: 0, marginLeft: '10px' } }}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
              onClick={() =>   handleEditDrawerToggle(undefined, false)} // Pass false for edit
            >
              Add New Workout
            </Button>
            </>
          }
        />
      </PageTitleWrapper>

      <Container maxWidth="lg">
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
          <Grid item xs={12}>
            <DefaultTable
              api={{
                url: 'getWorkoutsList',
              }}
              search={true}
              columns={columns}
              data={getWorkoutsList}
              loading={Boolean(isLoading)}
              title=""
              placeholder="Search by name or description"
            />
          </Grid>
        </Grid>
      </Container>

      <Drawer
        sx={{
          display: 'flex',
        }}
        variant="temporary"
        anchor={theme.direction === 'rtl' ? 'left' : 'right'}
        open={mobileEditOpen}
        onClose={() => handleEditDrawerToggle(undefined)}
        elevation={9}
        >
        <Box
          sx={{
            minWidth: "500px",
          }}
          p={2}
        >
          <WorkoutForm edit={state.edit} {...{ state, dispatch }} handleClose={() => handleEditDrawerToggle(undefined)} />
        </Box>
        </Drawer>
      
    </>
  );
}

export default memo(Index);
