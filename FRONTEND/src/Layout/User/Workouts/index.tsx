'use state'
import {  Card, CardContent, Typography, Container, Grid, Drawer, Box, IconButton, useTheme, Tooltip } from '@mui/material';

import React from 'react';
import PageHeader from '@/components/Default/PageHeader';
import PageTitleWrapper from '@/components/Default/PageTitleWrapper';
import Head from 'next/head';
const workouts = [
    { id: 1, title: 'Yoga', description: 'Relax and improve flexibility.', image: '/images/yoga.jpg' },
    { id: 2, title: 'Cardio', description: 'Boost your endurance.', image: '/images/cardio.jpg' },
    { id: 3, title: 'Strength Training', description: 'Build muscle and strength.', image: '/images/strength.jpg' },
    { id: 4, title: 'Pilates', description: 'Enhance core strength.', image: '/images/pilates.jpg' },
    { id: 5, title: 'HIIT', description: 'High-intensity interval training.', image: '/images/hiit.jpg' },
    { id: 6, title: 'Cycling', description: 'Improve cardiovascular health.', image: '/images/cycling.jpg' },
    { id: 7, title: 'Running', description: 'Boost stamina and endurance.', image: '/images/running.jpg' },
    { id: 8, title: 'Swimming', description: 'Low-impact full-body workout.', image: '/images/swimming.jpg' },
    { id: 9, title: 'Dance', description: 'Fun way to stay fit.', image: '/images/dance.jpg' },
    { id: 10, title: 'Boxing', description: 'Improve strength and agility.', image: '/images/boxing.jpg' },
  ];

function Index(){
    return <>
    <Head>
        <title>Security Questions - Applications</title>
    </Head>
    <PageTitleWrapper>
    <PageHeader
        heading="Your Workouts"
        content={<Typography variant="subtitle2">See your workout Preference</Typography>}
        action={
        <>
        </>
        }
    />
    </PageTitleWrapper>
    <Container maxWidth="lg">
        
        <Grid container direction="row" justifyContent="center" alignItems="stretch" spacing={3}>
        {workouts.map((workout) => (
          <Grid item xs={12}>
          <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                {workout.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                {workout.description}
                </Typography>
            </CardContent>
            </Card>
          </Grid>
        ))}
        </Grid>
    </Container>
    </>
}

export default Index