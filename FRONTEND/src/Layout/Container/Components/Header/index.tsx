import { alpha, Box, Divider, IconButton, lighten, Stack, styled, Tooltip, useTheme } from '@mui/material';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';

import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import { useContainerContext } from '@/Layout/Container/context';

import HeaderButtons from './Buttons';
import HeaderMenu from './Menu';
import HeaderUserbox from './Userbox';

const HeaderWrapper = styled(Box)(({ theme }) => ({
  height: theme.header.height,
  color: theme.header.textColor,
  padding: theme.spacing(0, 2),
  right: 0,
  zIndex: 6,
  backgroundColor: theme.header.background,
  backdropFilter: 'blur(3px)',
  position: 'fixed',
  justifyContent: 'space-between',
  width: `calc(100% - ${theme.sidebar.width})`,
  left: theme.sidebar.width,
  '@media (min-width: ${theme.breakpoints.values.lg}px)': {
    left: theme.sidebar.width,
    width: `calc(100% - ${theme.sidebar.width})`,
  },
  '@media (max-width: ${theme.breakpoints.values.lg - 1}px)': {
    left: 0,
    width: '100%',
  },
}));

function Header() {
  const { sidebarToggle, toggleSidebar, largeScreen } = useContainerContext();
  const theme = useTheme();

  return (
    <HeaderWrapper
      display="flex"
      alignItems="center"
      sx={{
        width: !sidebarToggle ? `calc(100% - ${theme.sidebar.width})` : '100%',
        left: !sidebarToggle ? theme.sidebar.width : 0,
        boxShadow:
          theme.palette.mode === 'dark'
            ? `0 1px 0 ${alpha(
                lighten(theme.palette.primary.main, 0.7),
                0.15,
              )}, 0px 2px 8px -3px rgba(0, 0, 0, 0.2), 0px 5px 22px -4px rgba(0, 0, 0, 0.1)`
            : `0px 2px 8px -3px ${alpha(theme.palette.grey[100], 0.2)}, 0px 5px 22px -4px ${alpha(
                theme.palette.grey[100],
                0.1,
              )}`,
      }}
    >
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} alignItems="center" spacing={2}>
        <HeaderMenu />
      </Stack>
      <Box display="flex" alignItems="center">
        <HeaderUserbox />

        <Box
          component="span"
          sx={{
            ml: 2,
            display: 'inline-block',
          }}
        >
          {!largeScreen ? (
            <Tooltip arrow title="Toggle Menu">
              <IconButton color="primary" onClick={toggleSidebar}>
                {sidebarToggle ? <MenuTwoToneIcon fontSize="small" /> : <CloseTwoToneIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          ) : (
            <IconButton color="primary" onClick={toggleSidebar}>
              {sidebarToggle && <MenuTwoToneIcon fontSize="small" />}
            </IconButton>
          )}
        </Box>
      </Box>
    </HeaderWrapper>
  );
}

export default Header;
