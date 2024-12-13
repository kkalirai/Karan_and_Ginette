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
  muscle_group: Yup.string().trim().min(2, 'Too Short!').required('Please provide Muscle Group.'),
  equipmentRequired: Yup.string().trim().min(2, 'Too Short!').required('Please provide Muscle Group.'),
  description: Yup.string().trim().min(2, 'Too Short!').max(500, 'Too Long!'),
  duration: Yup.number().min(1, 'Duration must be at least 1 minute').required('Please provide duration.'),
  intensity: Yup.string().required('Please select intensity.'),
  instructions: Yup.string().trim().min(2, 'Too Short!').max(500, 'Too Long!').required('Please provide instructions.'),
  workoutType: Yup.string().required('Please select workout type.'),
  fitness_level: Yup.string().required('Please select fitness level.'),
  goal: Yup.string().required('Please select a goal.'),
});

interface PROPS {
  state: {
    workoutDetail?: KEYPAIR;
    edit?: string;
    title?: string;
  };
  dispatch: React.Dispatch<KEYPAIR>;
  handleClose: () => void;
  edit: boolean;
}

function WorkoutForm(props: PROPS) {
  console.log("🚀 ~ WorkoutForm ~ props:", props.state.workoutDetail)
  const { request, loading } = useRequest();
  const { ButtonLoader } = useLoading();
  const { state, dispatch } = props;

  const handleSubmit = async (values: KEYPAIR) => {
    dispatch({ isEditLoading: true });
      const req = !state.edit
        ? ((await request('createWorkout', values)) as REQUEST)
        : ((await request('updateWorkout', { ...values, id: state?.workoutDetail?.id })) as REQUEST);
      if (req) {
        toastr(
          `The Workout has been successfully saved.`,
          'success',
          !state.edit ? `New Workout created` : `Workout updated`,
        );
        dispatch({ isEditLoading: false, rowSelected: [] });
        return props.handleClose();
      }
    dispatch({ isEditLoading: false });
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
            name: (state?.workoutDetail?.name || '') as string,
            description: (state?.workoutDetail?.description || '') as string,
            duration: (state?.workoutDetail?.duration || 0) as number,
            intensity: (state?.workoutDetail?.intensity || '') as string,
            instructions: (state?.workoutDetail?.instructions || '') as string,
            workoutType: (state?.workoutDetail?.workoutType || '') as string,
            fitness_level: (state?.workoutDetail?.fitness_level || '') as string,
            goal: (state?.workoutDetail?.goal || '') as string,
            muscle_group: (state?.workoutDetail?.muscle_group || '') as string,
            equipmentRequired: (state?.workoutDetail?.equipmentRequired || '') as string,
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
                      name="equipmentRequired"
                      label="Equipment Required"
                      fullWidth
                      error={touched.equipmentRequired && Boolean(errors.equipmentRequired)}
                      helperText={<ErrorMessage name="equipmentRequired" />}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl variant="outlined" sx={{ width: '100%' }} fullWidth>
                    <Field
                      as={TextField}
                      name="duration"
                      label="Duration (minutes)"
                      type="number"
                      fullWidth
                      error={touched.duration && Boolean(errors.duration)}
                      helperText={<ErrorMessage name="duration" />}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl variant="outlined" sx={{ width: '100%' }} fullWidth>
                    <Field
                      as={TextField}
                      name="muscle_group"
                      label="Target Muscle Group"
                      fullWidth
                      error={touched.muscle_group && Boolean(errors.muscle_group)}
                      helperText={<ErrorMessage name="muscle_group" />}
                    />
                  </FormControl>
                </Grid>



                <Grid item xs={12} sm={6}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel>Intensity</InputLabel>
                    <Field
                      as={Select}
                      name="intensity"
                      value={values.intensity || ''}
                      onChange={handleChange}
                      sx={{ width: "auto" }}
                      label="Intensity"
                      error={touched.intensity && Boolean(errors.intensity)}
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Field>
                    <ErrorMessage name="intensity" component="div" />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel>Workout Type</InputLabel>
                    <Field
                      as={Select}
                      name="workoutType"
                      value={values.workoutType || ''}
                      onChange={handleChange}
                      label="Workout Type"
                      error={touched.workoutType && Boolean(errors.workoutType)}
                    >
                      <MenuItem value="strength">Strength</MenuItem>
                      <MenuItem value="cardio">Cardio</MenuItem>
                      <MenuItem value="flexibility">Flexibility</MenuItem>
                    </Field>
                    <ErrorMessage name="workoutType" component="div" />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <FormControl variant="outlined" fullWidth>
                    <Field
                      as={TextField}
                      name="instructions"
                      label="Instructions"
                      multiline
                      rows={4}
                      fullWidth
                      error={touched.instructions && Boolean(errors.instructions)}
                      helperText={<ErrorMessage name="instructions" />}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel>Fitness Level</InputLabel>
                    <Field
                      as={Select}
                      name="fitness_level"
                      value={values.fitness_level || ''}
                      onChange={handleChange}
                      label="Fitness Level"
                      error={touched.fitness_level && Boolean(errors.fitness_level)}
                    >
                      <MenuItem value="beginner">Beginner</MenuItem>
                      <MenuItem value="intermediate">Intermediate</MenuItem>
                      <MenuItem value="advanced">Advanced</MenuItem>
                    </Field>
                    <ErrorMessage name="fitness_level" component="div" />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
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

export default memo(WorkoutForm);
