import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';

const Spinner: React.FC = () => {
  return (
    <Grid sx={{ placeContent: 'center', padding: 10 }} container>
      <CircularProgress disableShrink />
    </Grid>
  );
};

export default Spinner;
