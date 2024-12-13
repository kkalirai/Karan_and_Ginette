'use client';
import Head from 'next/head';
import { Button, Select, MenuItem, TextField, Typography, Container, InputAdornment, IconButton, FormControl, FormHelperText, InputLabel, OutlinedInput, Grid, Card } from '@mui/material';
import PageHeader from '@/components/Default/PageHeader';
import PageTitleWrapper from '@/components/Default/PageTitleWrapper';
import { Formik, ErrorMessage, Field } from 'formik';
import { useRouter } from 'next/navigation';
import React, { memo } from 'react';
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
  profileDetail: any;
}

const FormikSchema = Yup.object().shape({
  fitnessGoal: Yup.string()
    .required('Please select your fitness goal.')
    .oneOf(
      ['Build muscle', 'Increase flexibility', 'Lose weight', 'General fitness', 'Improve endurance'],
      'Invalid goal selected'
    ),

  preferredIntensity: Yup.string()
    .required('Please select your preferred workout intensity.')
    .oneOf(['low', 'medium', 'high'], 'Invalid intensity selected'),

  nutritionGoal: Yup.string()
    .required('Please select your nutrition goal.')
    .oneOf(
      ['Build muscle', 'Increase flexibility', 'Lose weight', 'General fitness', 'Improve endurance'],
      'Invalid goal selected'
    ),

  dietType: Yup.string()
    .required('Please select your diet type.')
    .oneOf(['Vegan', 'Non-Vegan'], 'Invalid diet type selected'),

  calorieRange: Yup.string().required('Please select your calorie range.')
});

function Index(props: PROPS) {
  const { request, loading } = useRequest();
  const { ButtonLoader } = useLoading();
  const { profileDetail } = props;
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Account Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          heading="Account Management"
          content={<Typography variant="subtitle2">Manage Your Preferences Here</Typography>}
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
                  fitnessGoal: profileDetail.fitnessGoal,
                  preferredIntensity: profileDetail.preferredIntensity,
                  preferredWorkoutDuration: profileDetail.preferredWorkoutDuration,
                  nutritionGoal: profileDetail.nutritionGoal,
                  dietType: profileDetail.dietType,
                  calorieRange: profileDetail.calorieRange,  // Added calorieRange to initialValues
                }}
                validateOnChange={false}
                validateOnBlur={false}
                validationSchema={FormikSchema}
                onSubmit={async (values: KEYPAIR, { resetForm }) => {
                  console.log("🚀 ~ onSubmit={ ~ values:", values)
                  const req = (await request('updateUserAccount', {
                    id: profileDetail.id,
                    fitnessGoal: values.fitnessGoal,
                    preferredIntensity: values.preferredIntensity,
                    preferredWorkoutDuration: values.preferredWorkoutDuration,
                    nutritionGoal: values.nutritionGoal,
                    dietType: values.dietType,
                    calorieRange: values.calorieRange,  
                  })) as REQUEST;
                  if (req) {
                    toastr('The user has been successfully saved.', 'success');
                    resetForm();
                    router.refresh();
                  }
                }}
              >
                {({ handleSubmit, handleChange, values, errors, touched, resetForm }) => (
                  <form noValidate onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel>Preferred Workout Intensity</InputLabel>
                          <Field
                            as={Select}
                            name="preferredIntensity"  // Fixed the name here to match the Formik initialValues
                            value={values.preferredIntensity || ''}
                            onChange={handleChange}
                            sx={{ width: 'auto' }}
                            error={touched.preferredIntensity && Boolean(errors.preferredIntensity)}
                          >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                          </Field>
                          <ErrorMessage name="preferredIntensity" component="div" />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        <FormControl variant="outlined" sx={{ width: '100%' }} fullWidth>
                          <Field
                            as={TextField}
                            name="preferredWorkoutDuration"
                            label="Preferred Workout Duration (minutes)"
                            type="number"
                            fullWidth
                            error={touched.preferredWorkoutDuration && Boolean(errors.preferredWorkoutDuration)}
                            helperText={<ErrorMessage name="preferredWorkoutDuration" />}
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel>Fitness Goal</InputLabel>
                          <Field
                            as={Select}
                            name="fitnessGoal"
                            value={values.fitnessGoal || ''}
                            onChange={handleChange}
                            label="Goal"
                            error={touched.fitnessGoal && Boolean(errors.fitnessGoal)}
                          >
                            <MenuItem value="Build muscle">Build Muscle</MenuItem>
                            <MenuItem value="Increase flexibility">Increase Flexibility</MenuItem>
                            <MenuItem value="Lose weight">Lose Weight</MenuItem>
                            <MenuItem value="General fitness">General Fitness</MenuItem>
                            <MenuItem value="Improve endurance">Improve Endurance</MenuItem>
                          </Field>
                          <ErrorMessage name="fitnessGoal" component="div" />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel>Nutrition Goal</InputLabel>
                          <Field
                            as={Select}
                            name="nutritionGoal"
                            value={values.nutritionGoal || ''}
                            onChange={handleChange}
                            label="Goal"
                            error={touched.nutritionGoal && Boolean(errors.nutritionGoal)}
                          >
                            <MenuItem value="Build muscle">Build Muscle</MenuItem>
                            <MenuItem value="Increase flexibility">Increase Flexibility</MenuItem>
                            <MenuItem value="Lose weight">Lose Weight</MenuItem>
                            <MenuItem value="General fitness">General Fitness</MenuItem>
                            <MenuItem value="Improve endurance">Improve Endurance</MenuItem>
                          </Field>
                          <ErrorMessage name="nutritionGoal" component="div" />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel>Diet Type</InputLabel>
                          <Field
                            as={Select}
                            name="dietType"
                            value={values.dietType || ''}
                            onChange={handleChange}
                            label="Diet Type"
                            error={touched.dietType && Boolean(errors.dietType)}
                          >
                            <MenuItem value="Vegan">Vegan</MenuItem>
                            <MenuItem value="Non-Vegan">Non-Vegan</MenuItem>
                          </Field>
                          <ErrorMessage name="dietType" component="div" />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={12}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel>Calorie Range</InputLabel>
                          <Field
                            as={Select}
                            name="calorieRange"
                            value={values.calorieRange || ''}
                            onChange={handleChange}
                            label="Calorie Range"
                            error={touched.calorieRange && Boolean(errors.calorieRange)}
                          >
                            <MenuItem value="1500-2000">1500-2000</MenuItem>
                            <MenuItem value="2000-2500">2000-2500</MenuItem>
                            <MenuItem value="2500-3000">2500-3000</MenuItem>
                            <MenuItem value="3000+">3000+</MenuItem>
                          </Field>
                          <ErrorMessage name="calorieRange" component="div" />
                        </FormControl>
                      </Grid>
                    </Grid>

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
                      <Button type="submit" variant="contained" color="primary" onClick={() => handleSubmit()}>
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
