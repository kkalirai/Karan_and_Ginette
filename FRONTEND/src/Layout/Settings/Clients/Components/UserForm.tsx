'use client';

import React, { memo } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';

import * as Yup from 'yup';

import { useLoading, useRequest } from '@/components/App';
import { KEYPAIR, REQUEST } from '@/types/interfaces';
import {  toastr } from '@/utils/helpers';
import { Button, Card, Box, FormControl, Grid, TextField, Typography } from '@mui/material';

const FormikSchema = Yup.object().shape({
  firstName: Yup.string().trim().min(2, 'Too Short!').max(50, 'Too Long!').required('Please provide your first name.'),
  lastName: Yup.string().trim().min(2, 'Too Short!').max(50, 'Too Long!').required('Please provide your last name.'),
  email: Yup.string().trim().email('Invalid email').required('Please provide your email.'),
  gender: Yup.string().oneOf(['male', 'female', 'other'], 'Invalid gender').required('Please provide your gender.'),
});

interface PROPS {
  state: {
    userDetail?: KEYPAIR;
    edit?: string;
  };
  dispatch: React.Dispatch<KEYPAIR>;
  handleClose: () => void;
  edit: boolean
}

function UserForm(props: PROPS) {
  const { request, loading } = useRequest();
  const { ButtonLoader } = useLoading();
  const { state, dispatch } = props;


  const handleSubmit = async (values: KEYPAIR) => {
    console.log("🚀 ~ handleSubmit ~ values:", values)
    dispatch({ isEditLoading: true });
      // values.status = values?.status === 'Active' ? true : false;
      const req = !props.edit
        ? ((await request('createClient', values)) as REQUEST)
        : ((await request('updateClient', { ...values, id: state?.userDetail?.id })) as REQUEST);
      if (req) {
        toastr('The user has been successfully saved.', 'success', !props.edit ? 'New User created' : 'User updated');
        dispatch({ isEditLoading: false, userSelected: [] });
        return props.handleClose();
    }
  };

  return (
    <>
      <Card sx={{ mt: 3, p: 4 }}>
        <Typography sx={{mb:3,fontSize:'20px'}}>
          User Details
        </Typography>
        <Formik
          enableReinitialize={true}
          initialValues={{
            firstName: (state?.userDetail?.firstName || '') as string,
            lastName: (state?.userDetail?.lastName || '') as string,
            email: (state?.userDetail?.email || '') as string,
            gender: (state?.userDetail?.gender || '') as string,
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={FormikSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" fullWidth>
                  <Field
                    as={TextField}
                    name="firstName"
                    label="First Name"
                    fullWidth
                    error={touched.firstName && Boolean(errors.firstName)}
                    helperText={<ErrorMessage name="firstName" />}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" fullWidth>
                  <Field
                    as={TextField}
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    error={touched.lastName && Boolean(errors.lastName)}
                    helperText={<ErrorMessage name="lastName" />}
                  />
                </FormControl>
              </Grid>

              <Grid item sm={6} xs={12}>
                <FormControl variant="outlined" fullWidth>
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    disabled={Boolean(props.edit)}
                    error={touched.email && Boolean(errors.email)}
                    helperText={<ErrorMessage name="email" />}
                  />
                </FormControl>
              </Grid>

              <Grid item sm={6} xs={12}>
                <FormControl variant="outlined" fullWidth>
                  <Field
                    as={TextField}
                    name="gender"
                    label="Gender"
                    fullWidth
                    error={touched.gender && Boolean(errors.gender)}
                    helperText={<ErrorMessage name="gender" />}
                  />
                </FormControl>
              </Grid>

              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button size="medium" sx={{ margin: 2, mr: 0, float: 'right' }}
                variant="contained" color='error' onClick={props.handleClose}>
                Cancel
              </Button>
              <Button type="submit" onClick={() =>handleSubmit()}
                size="medium" sx={{ margin: 2, mr: 0, float: 'right' }}
                variant="contained" form="user-form">
                {loading?.updateUser_LOADING ? ButtonLoader() : 'Save'}
              </Button>
              </Box>
            </Grid>
          </Form>
        )}
        </Formik>  
      </Card>
      
      </>
  );
}

export default memo(UserForm);
