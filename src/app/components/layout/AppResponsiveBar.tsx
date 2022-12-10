import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import Logo from '../../static/msftLogo.png';
import { AppRoute, UseRoutes, iterateThroughRoutes, AppRouteGroup } from 'app/components/AppRoutes';
import { useNavigate } from 'react-router-dom';
import AppWrapper from './AppWrapper';

const AppResponsiveBar = () => {
  // Component behaviour
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" color="primary">
      <AppWrapper py={1}>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => navigate(UseRoutes[AppRoute.Default].path)}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <img alt="logo" src={Logo} style={{ maxWidth: 100 }} />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {iterateThroughRoutes()
                .filter((r) => UseRoutes[r].group === AppRouteGroup.Default && UseRoutes[r].inMenu)
                .map((route) => (
                  <MenuItem
                    key={route}
                    onClick={() => {
                      handleCloseNavMenu();
                      navigate(UseRoutes[route].path);
                    }}
                  >
                    <Typography textAlign="center">{UseRoutes[route].menuTitle}</Typography>
                  </MenuItem>
                ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <img alt="logo" src={Logo} style={{ maxWidth: 100 }} />
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {iterateThroughRoutes()
              .filter((r) => UseRoutes[r].group === AppRouteGroup.Default && UseRoutes[r].inMenu)
              .map((route) => (
                <Button
                  key={route}
                  onClick={() => {
                    handleCloseNavMenu();
                    navigate(UseRoutes[route].path);
                  }}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {UseRoutes[route].menuTitle}
                </Button>
              ))}
          </Box>
        </Toolbar>
      </AppWrapper>
    </AppBar>
  );
};

export default AppResponsiveBar;
