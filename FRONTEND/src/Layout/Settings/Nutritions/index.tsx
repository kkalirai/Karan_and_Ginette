'use client';

import React, { memo, useMemo, useState } from 'react';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DownloadIcon from '@mui/icons-material/Download';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Button, Typography, Container, Grid, Drawer, Box, IconButton, useTheme, Tooltip } from '@mui/material';
import Head from 'next/head';

import PageHeader from '@/components/Default/PageHeader';
import PageTitleWrapper from '@/components/Default/PageTitleWrapper';
import { Dropdown, Image } from 'react-bootstrap';

import { useRequest } from '@/components/App';
import { useCommonReducer } from '@/components/App/reducer';
import Modal from '@/components/Default/Modal';
import DefaultTable from '@/components/Default/Table';
import { useContainerContext } from '@/Layout/Container/context';
import { REQUEST } from '@/types/interfaces';
import { confirmDialog, deleteDialog, toastr } from '@/utils/helpers';
import NutritionPreview from '@/Layout/Settings/Nutritions/Components/NutritionPreview';

import NutritionForm from './Components/NutritionForm';
import NutritionHeader from './Components/NutritionHeader';

interface NUTRITION {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  action: JSX.Element;
  planName: string
  mealType: string
}

function Index() {
  const { request, loading } = useRequest();
  const { state: globalState } = useContainerContext();
  const { state, dispatch } = useCommonReducer({
    columns: {
      view: [],
      selected: [],
    },
  });

  const removeNutrition = async (id: string | string[]) => {
    if (!id?.length) return;
    const confirm = await deleteDialog('Are you sure you want to delete the nutrition/nutritions?', 'Delete Nutrition');
    if (confirm) {
      const res = (await request('removeNutritionFromList', { id: id })) as REQUEST;
      if (res) toastr('The nutrition has been successfully removed.', 'success', 'Nutrition removed');
      dispatch({ nutritionDetail: {}, multirecordSelected: false, viewUserPreviewModal: false });
    }
  };

  const exportToCSV = async () => {
    const moduleName = 'nutritions';

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
    },
    {
      dataField: 'mealType',
      text: 'Meal Type',
      sort: false,
    },
    {
      dataField: 'planName',
      text: 'Plan Name',
      sort: false,
    },

    {
      dataField: 'action',
      text: 'Action',
    },
  ];
  const theme = useTheme();

  const [mobileEditOpen, setMobileEditOpen] = useState(false);
  const handleEditDrawerToggle = (data?: NUTRITION, edit: boolean = true) => {
    if (data) {
      dispatch({
        nutritionDetail: data, 
        edit
      });
    }else{
      dispatch({
        nutritionDetail: undefined, 
        edit
      });
    }
    setMobileEditOpen(!mobileEditOpen);
  };
  

  const getNutritionsList = useMemo(
    () =>
      globalState?.getNutritionsList?.result
        ? globalState?.getNutritionsList?.result?.map((nutrition: NUTRITION, index: number) => ({
            serial: index + 1,
            name: (
            <Typography variant="body2" color="text.secondary" noWrap>
              {nutrition.name}
            </Typography>
            ),
            
            planName: (
              <Typography variant="body2" color="text.secondary" noWrap>
                {nutrition.planName}
              </Typography>
            ),

            mealType: (
              <Typography variant="body2" color="text.secondary" noWrap>
                {nutrition.mealType}
              </Typography>
            ),
            action: (
              <>
                <Tooltip title="Edit Record" arrow>
                  <IconButton
                    onClick={() => handleEditDrawerToggle(nutrition)}
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
                    onClick={() => removeNutrition([nutrition.id])}
                  >
                    <DeleteTwoToneIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            ),
          }))
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [globalState?.getNutritionsList?.result],
  );

  // /* Loading /
  const isLoading = useMemo(
    () => loading?.removeNutritionFromList_LOADING || state?.isEditLoading,
    [loading, state?.isEditLoading],
  );

  return (
    <>
      <Head>
        <title>Security Questions - Applications</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          heading="Nutritions"
          content={<Typography variant="subtitle2">Manage your Nutritions</Typography>}
          action={
            <>
            <Button
              sx={{ mt: { xs: 2, md: 0, marginLeft: '10px' } }}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
              onClick={() =>  handleEditDrawerToggle(undefined, false)} // Pass false for edit
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
                url: 'getNutritionsList',
              }}
              search={false}
              columns={columns}
              data={getNutritionsList}
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
          <NutritionForm edit={state.edit} {...{ state, dispatch }} handleClose={() => handleEditDrawerToggle(undefined)} />
        </Box>
      </Drawer>
    </>
  );
}

export default memo(Index);
