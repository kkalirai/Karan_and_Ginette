'use client';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import Label from '@/components/Default/Label';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Button, Typography, Container, Grid, Drawer, Box, IconButton, useTheme, Tooltip } from '@mui/material';

import React, { memo, useMemo, useState } from 'react';
import PageHeader from '@/components/Default/PageHeader';
import PageTitleWrapper from '@/components/Default/PageTitleWrapper';

import { useRequest } from '@/components/App';
import { useCommonReducer } from '@/components/App/reducer';
import DefaultTable from '@/components/Default/Table';
import { useContainerContext } from '@/Layout/Container/context';
import { REQUEST } from '@/types/interfaces';
import { confirmDialog, deleteDialog, toastr } from '@/utils/helpers';

import UserForm from './Components/UserForm';

interface USER {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  isActive: number;
  action: JSX.Element;
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

  const [mobileEditOpen, setMobileEditOpen] = useState(false);

  const handleEditDrawerToggle = (data?: USER, edit: boolean = true) => {
    if (data) {
      dispatch({
        userDetail: data, 
        edit
      });
    }else{
      dispatch({
        userDetail: undefined, 
        edit
      });
    }
    setMobileEditOpen(!mobileEditOpen);
  };
  
  const exportToCSV = async () => {
    const moduleName = 'users';

    const confirm = await confirmDialog('Are you sure you want to export Table to CSV?');
    if (!confirm) return;
    (await request('exportTable', { moduleName })) as REQUEST;
  };

  const removeUser = async (id: string | string[]) => {
    if (!id?.length) return;
    const confirm = await deleteDialog('Are you sure you want to delete the Admin?', 'Delete Admin');
    if (confirm) {
      const res = (await request('removeUserFromList', { id: id })) as REQUEST;
      if (res) toastr('The Admin has been successfully removed.', 'success', 'Admin removed');
      dispatch({ userDetail: {}, multirecordSelected: false, viewUserPreviewModal: false });
    }
  };

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
    {
      dataField: 'email',
      text: 'Email',
      sort: true,
    },
    {
      dataField: 'isActive',
      text: 'isActive',
      sort: false,
    },
    {
      dataField: 'action',
      text: 'Action',
    },
  ];

  const theme = useTheme();

  const getUsersList = useMemo(
    () =>
      globalState?.getUsersList?.result
        ? globalState?.getUsersList?.result?.map((user: USER, index: number) => ({
            serial: index + 1,
            firstName: (
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.firstName}
              </Typography>
            ),
            lastName: (
              <Typography variant="body2" color="text.secondary" noWrap>
                { user.lastName}
              </Typography>
            ),
            email: (
              <Typography variant="body2" color="text.secondary" noWrap>
              { user.email}
            </Typography>
            ),
            isActive:
              user.isActive === 1 ? (
                <Typography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: 'pointer' }}
                noWrap
              >
              <Label color="success">Active</Label> 
              </Typography>
              ) : (
                <Typography
                variant="body2"
                color="text.secondary"
                sx={{ cursor: 'pointer' }}
                noWrap
              >
              <Label color="error">Inactive</Label> 
              </Typography>
              ),
            action: (
               <>
                <Tooltip title="Edit Record" arrow>
                  <IconButton
                    onClick={() => handleEditDrawerToggle(user)}
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
                    onClick={() => removeUser([user.id])}
                  >
                    <DeleteTwoToneIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            ),
          }))
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [globalState?.getUsersList?.result],
  );

  // /* Loading /
  const isLoading = useMemo(
    () => loading?.removeUserFromList_LOADING || state?.isEditLoading,
    [loading, state?.isEditLoading],
  );

  const path = usePathname();

  return (
    <>
      <Head>
        <title>Security Questions - Applications</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          heading="Admin Manager"
          content={<Typography variant="subtitle2">Manage your Admins</Typography>}
          action={
            <>
            <Button
              sx={{ mt: { xs: 2, md: 0, marginLeft: '10px' } }}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
              onClick={() => handleEditDrawerToggle(undefined, false)} // Pass false for edit
            >
              Add New Admin
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
              url: 'getUsersList',
            }}
            search={false}
            columns={columns}
            data={getUsersList}
            loading={Boolean(isLoading)}
            title=""
            placeholder="Search by name or email"
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
            minWidth: 200,
          }}
          p={2}
        >
          {/* Add your Edit Drawer content here */}
          <Typography variant="h6">Edit User</Typography>
          {/* Example content */}
          <UserForm edit={state.edit} {...{ state, dispatch }} handleClose={() => handleEditDrawerToggle(undefined)} />
        </Box>
        </Drawer>
    </>
  );
}

export default memo(Index);
