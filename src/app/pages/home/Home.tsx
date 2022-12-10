import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h5" component="h2" color="primary.main">
        Welcome
      </Typography>
      <Box mb={3}>
        <Button onClick={() => navigate('/data')} variant="contained" color="secondary">
          Prepare data
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
