'use client';
import {
  Button,
  Card,
  Container,
  Box,
  Divider,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Typography,
} from '@mui/material';
import Head from 'next/head';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';

const Index = () => {
  return (
    <>
      <Head>
        <title>Status - 404</title>
      </Head>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <img alt="404" height={180} src="/404.svg" />
            <Typography variant="h6" sx={{ my: 2 }}>
              The page you were looking for doesn't exist.
            </Typography>
          </Box>
          <Container sx={{ textAlign: 'center', p: 4 }} maxWidth="sm">
            <Button href="/settings/account" variant="outlined">
              Go to homepage
            </Button>
          </Container>
        </Container>
      </Box>
    </>
  );
};

export default Index;
