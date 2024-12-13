'use client';

import { Button, MenuItem, Card, Box, FormControl, Grid, TextField, Select, Typography, InputLabel } from '@mui/material';
import { ErrorMessage, Field, Form, Formik } from 'formik';

import React, { memo } from 'react';
import * as Yup from 'yup';

import { useLoading, useRequest } from '@/components/App';
import { KEYPAIR, REQUEST } from '@/types/interfaces';
import {  toastr } from '@/utils/helpers';

const FormikSchema = Yup.object().shape({
  name: Yup.string().trim().min(2, 'Too Short!').max(50, 'Too Long!').required('Please provide your name.'),
  description: Yup.string().trim().min(2, 'Too Short!').max(500, 'Too Long!'),
});

interface PROPS {
  state: {
    nutritionDetail?: KEYPAIR;
    edit?: string;
    title?: string;
  };
  dispatch: React.Dispatch<KEYPAIR>;
  handleClose: () => void;
  edit?: boolean;
}

function NutritionForm(props: PROPS) {
  const { request, loading } = useRequest();
  const { ButtonLoader } = useLoading();
  const { state, dispatch } = props;


  const handleSubmit = async (values: KEYPAIR) => {
    dispatch({ isEditLoading: true });

      const req = !state.edit
        ? ((await request('createNutrition', values)) as REQUEST)
        : ((await request('updateNutrition', { ...values, id: state?.nutritionDetail?.id })) as REQUEST);
      if (req) {
        toastr(
          `The Nutrition data has been successfully saved.`,
          'success',
          !state.edit ? `Nutrition data created` : `Nutrition data  updated`,
        );
        dispatch({ isEditLoading: false, rowSelected: [] });
        return props.handleClose();
      }
  };

  return (
 <>
    <Card sx={{ mt: 3, p: 4 }}>
      <Typography sx={{ mb: 3, fontSize: '20px' }}>
        Workout Details
      </Typography>

      <Formik
        enableReinitialize={true}
        initialValues={{
          name: (state?.nutritionDetail?.name || '') as string,
          description: (state?.nutritionDetail?.description || '') as string,
          carbs: (state?.nutritionDetail?.carbs || 0) as number,
          calories: (state?.nutritionDetail?.calories || 0) as number,
          fats: (state?.nutritionDetail?.fats || 0) as number,
          protein: (state?.nutritionDetail?.protein || 0) as number,
          mealType: (state?.nutritionDetail?.mealType || 0) as number,
          mealDescription: (state?.nutritionDetail?.mealDescription || 0) as number,
          goal: (state?.nutritionDetail?.goal || 0) as number,
          dietType: (state?.nutritionDetail?.dietType || 0) as number,
          planName: (state?.nutritionDetail?.planName || "") as number,
        }}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={FormikSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, handleChange, values, errors, touched }) => (
          <Form onSubmit={handleSubmit}>
            <Grid container spacing={2}>

              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" sx={{ width: '100%' }} fullWidth>
                  <Field
                    as={TextField}
                    name="name"
                    label="Name"
                    fullWidth
                    error={touched.name && Boolean(errors.name)}
                    helperText={<ErrorMessage name="name" />}
                  />
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" sx={{ width: '100%' }} fullWidth>
                  <Field
                    as={TextField}
                    name="planName"
                    label="Plan Name"
                    fullWidth
                    error={touched.planName && Boolean(errors.planName)}
                    helperText={<ErrorMessage name="planName" />}
                  />
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" sx={{ width: '100%' }} fullWidth>
                  <Field
                    as={TextField}
                    name="calories"
                    label="Calories"
                    fullWidth
                    error={touched.calories && Boolean(errors.calories)}
                    helperText={<ErrorMessage name="calories" />}
                  />
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" sx={{ width: '100%' }} fullWidth>
                  <Field
                    as={TextField}
                    name="carbs"
                    label="Carbs"
                    fullWidth
                    error={touched.carbs && Boolean(errors.carbs)}
                    helperText={<ErrorMessage name="carbs" />}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" sx={{ width: '100%' }} fullWidth>
                  <Field
                    as={TextField}
                    name="fats"
                    label="Fat"
                    fullWidth
                    error={touched.fats && Boolean(errors.fats)}
                    helperText={<ErrorMessage name="fats" />}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl variant="outlined" sx={{ width: '100%' }} fullWidth>
                  <Field
                    as={TextField}
                    name="protein"
                    label="Protein"
                    fullWidth
                    error={touched.protein && Boolean(errors.protein)}
                    helperText={<ErrorMessage name="protein" />}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Goal</InputLabel>
                  <Field
                    as={Select}
                    name="goal"
                    value={values.goal || ''}
                    onChange={handleChange}
                    label="Goal"
                    error={touched.goal && Boolean(errors.goal)}
                  >
                    <MenuItem value="Build muscle">Build Muscle</MenuItem>
                    <MenuItem value="Increase flexibility">Increase Flexibility</MenuItem>
                    <MenuItem value="Lose weight">Lose Weight</MenuItem>
                    <MenuItem value="General fitness">General Fitness</MenuItem>
                    <MenuItem value="Improve endurance">Improve Endurance</MenuItem>
                  </Field>
                  <ErrorMessage name="goal" component="div" />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
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

              <Grid item xs={12} sm={4}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Meal Type</InputLabel>
                  <Field
                    as={Select}
                    name="mealType"
                    value={values.mealType || ''}
                    onChange={handleChange}
                    label="Meal Type"
                    error={touched.mealType && Boolean(errors.mealType)}
                  >
                    <MenuItem value="Breakfast">Breakfast</MenuItem>
                    <MenuItem value="Lunch">Lunch</MenuItem>
                    <MenuItem value="Snack">Snack</MenuItem>
                    <MenuItem value="Dinner">Dinner</MenuItem>
                  </Field>
                  <ErrorMessage name="mealType" component="div" />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={12}>
                <FormControl variant="outlined" fullWidth>
                  <Field
                    as={TextField}
                    name="description"
                    label="Description"
                    multiline
                    rows={4}
                    fullWidth
                    error={touched.description && Boolean(errors.description)}
                    helperText={<ErrorMessage name="description" />}
                  />
                </FormControl>
              </Grid>

              
              <Grid item xs={12} sm={12}>
                <FormControl variant="outlined" fullWidth>
                  <Field
                    as={TextField}
                    name="mealDescription"
                    label="Meal Description"
                    multiline
                    rows={4}
                    fullWidth
                    error={touched.mealDescription && Boolean(errors.mealDescription)}
                    helperText={<ErrorMessage name="mealDescription" />}
                  />
                </FormControl>
              </Grid>

              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button
                  size="medium"
                  sx={{ margin: 2, mr: 0, float: 'right' }}
                  variant="contained"
                  color="error"
                  onClick={props.handleClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="medium"
                  sx={{ margin: 2, mr: 0, float: 'right' }}
                  variant="contained"
                >
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

export default memo(NutritionForm);
