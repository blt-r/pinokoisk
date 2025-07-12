import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import ExploreOutlined from '@mui/icons-material/ExploreOutlined';
import Box from '@mui/material/Box';
import { Link, Outlet, useLocation } from 'react-router-dom';

const RootLayout: React.FC = () => {
  const location = useLocation();

  const tab = ['/', '/favorites'].includes(location.pathname)
    ? location.pathname
    : false;

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} component="nav">
        <Container>
          <Tabs value={tab}>
            <Tab
              component={Link}
              to="/"
              label="Movies"
              value="/"
              icon={<ExploreOutlined />}
              iconPosition="start"
            />
            <Tab
              component={Link}
              to="/favorites"
              label="Favorites"
              value="/favorites"
              icon={<FavoriteBorderOutlined />}
              iconPosition="start"
            />
          </Tabs>
        </Container>
      </Box>

      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default RootLayout;
