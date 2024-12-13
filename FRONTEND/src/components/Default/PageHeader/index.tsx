import { Grid, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

interface PageHeaderProps {
  heading: string;
  content: ReactNode;
  action: ReactNode;
}

const PageHeader: FC<PageHeaderProps> = ({ heading, content, action }) => {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {heading}
        </Typography>
        {content}
      </Grid>
      <Grid item>{action}</Grid>
    </Grid>
  );
};

export default PageHeader;
