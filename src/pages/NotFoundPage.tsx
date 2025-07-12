import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const NotFoundPage: React.FC = () => {
  return (
    <Stack my={2} gap={2}>
      <Typography variant="h1" fontSize="4rem">
        404 Page not found
      </Typography>
      <Typography fontSize="1.5rem">
        I don't know what you are looking for, but it is not here.
      </Typography>
    </Stack>
  );
};

export default NotFoundPage;
