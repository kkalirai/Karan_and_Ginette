'use client';
import Head from 'next/head';
import { Button, Typography, Container, InputAdornment, IconButton, FormControl, FormHelperText, InputLabel, OutlinedInput, Grid, Card } from '@mui/material';
import PageHeader from '@/components/Default/PageHeader';
import PageTitleWrapper from '@/components/Default/PageTitleWrapper';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import React, { memo, useState } from 'react';
import * as Yup from 'yup';

import { useLoading, useRequest } from '@/components/App';
import { KEYPAIR, REQUEST } from '@/types/interfaces';
import { toastr } from '@/utils/helpers';

export interface USER {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface PROPS {
  profileDetail: USER;
}

const FormikSchema = Yup.object().shape({
  firstName: Yup.string().trim().min(2, 'Too Short!').max(50, 'Too Long!').required('Please provide your first name.'),
  lastName: Yup.string().trim().min(2, 'Too Short!').max(50, 'Too Long!').required('Please provide your last name.'),
  email: Yup.string().email('Invalid email').required('Please provide your email.'),
  password: Yup.string()
    .required('Please provide your password.')
    .trim()
    .matches(/\w*[a-z]\w*/, 'Password must have a lower case letter')
    .matches(/\w*[A-Z]\w*/, 'Password must have an uppercase letter')
    .matches(/\d/, 'Password must have a number')
    .matches(/^\S*$/, 'White Spaces are not allowed')
    .min(6, ({ min }) => `Password must be at least ${min} characters`)
    .max(128, ({ max }) => `Password must not be greater than ${max} characters`),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "Passwords don't match")
    .when('password', {
      is: (password: string) => password && password.length !== 0,
      then: Yup.string().required('Please provide your confirm password.'),
    }),
});

function Index(props: PROPS) {
  console.log("🚀 ~ Index ~ props:", props)
  const { request, loading } = useRequest();
  const { ButtonLoader } = useLoading();
  const { profileDetail } = props;
  const [viewPassword, setviewPassword] = useState(false);
  const [viewConfirmPassword, setviewConfirmPassword] = useState(false);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Account Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          heading="Account Management"
          content={<Typography variant="subtitle2">Manage Your Account here</Typography>}
          action={<></>}
        />
      </PageTitleWrapper>
      <Container maxWidth="lg">
      <Card sx={{ mt: 3, p: 4 }}>
      <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
      <Grid item xs={12}>
      <Formik
  enableReinitialize={true}
  initialValues={{
    firstName: profileDetail?.firstName,
    lastName: profileDetail?.lastName,
    email: profileDetail?.email,
    password: '',
    confirmPassword: '',
  }}
  validateOnChange={false}
  validateOnBlur={false}
  validationSchema={FormikSchema}
  onSubmit={async (values: KEYPAIR, { resetForm }) => {
    const req = (await request('updateUserAccount', {
      id: profileDetail.id,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
    })) as REQUEST;
    if (req) {
      toastr('The user has been successfully saved.', 'success');
      resetForm();
      router.refresh();
    }
  }}
>
  {({ handleSubmit, handleChange, values, errors, resetForm }) => (
    <form noValidate onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal" error={!!errors.firstName}>
        <OutlinedInput
          type="text"
          name="firstName"
          placeholder="First name"
          onChange={handleChange}
          value={values.firstName}
        />
        {errors.firstName && <FormHelperText>{errors.firstName}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth margin="normal" error={!!errors.lastName}>
        <OutlinedInput
          type="text"
          name="lastName"
          placeholder="Last name"
          onChange={handleChange}
          value={values.lastName}
        />
        {errors.lastName && <FormHelperText>{errors.lastName}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth margin="normal" disabled>
        <OutlinedInput
          type="email"
          name="email"
          value={profileDetail?.email}
        />
      </FormControl>

      <FormControl fullWidth margin="normal" error={!!errors.password}>
        <OutlinedInput
          type={viewPassword ? 'text' : 'password'}
          name="password"
          placeholder="Enter password"
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={() => setviewPassword(!viewPassword)}>
                <i className={`fa fa-eye ${viewPassword ? 'text-success' : ''}`}></i>
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText>
          The password should contain at least 6 characters and include at least one uppercase letter, one lowercase letter, and one number
        </FormHelperText>
        {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth margin="normal" error={!!errors.confirmPassword}>
        <OutlinedInput
          type={viewConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Enter confirm password"
          onChange={handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={() => setviewConfirmPassword(!viewConfirmPassword)}>
                <i className={`fa fa-eye ${viewConfirmPassword ? 'text-success' : ''}`}></i>
              </IconButton>
            </InputAdornment>
          }
        />
        {errors.confirmPassword && <FormHelperText>{errors.confirmPassword}</FormHelperText>}
      </FormControl>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
        <Button
          type="reset"
          variant="outlined"
          color="primary"
          onClick={() => {
            resetForm();
            router.refresh();
          }}
          sx={{ marginRight: 2 }}
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          {loading?.updateUserAccount_LOADING ? ButtonLoader() : 'Save'}
        </Button>
      </div>
    </form>
  )}
</Formik>
      </Grid>
      </Grid>
      </Card>
</Container>

    </>
  );
}

export default memo(Index);
