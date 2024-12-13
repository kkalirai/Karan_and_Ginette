import { alpha, Box, darken, Divider, Drawer, IconButton, lighten, styled, useTheme } from '@mui/material';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';


import Logo from '@/components/Default/LogoSign';
import Scrollbar from '@/components/Default/Scrollbar';
import { useContainerContext } from '@/Layout/Container/context';

import SidebarMenu from './SidebarMenu';

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
        width: ${theme.sidebar.width};
        min-width: ${theme.sidebar.width};
        color: ${theme.colors.alpha.white[100]};
        position: relative;
        z-index: 7;
        height: 100%;
        padding-bottom: 68px;
`,
);

function Sidebar() {
  const { sidebarToggle, toggleSidebar, largeScreen } = useContainerContext();
  const closeSidebar = () => toggleSidebar();
  const theme = useTheme();

  return (
    <>
      {largeScreen ? (
        <SidebarWrapper
          sx={{
            display: {
              xs: 'none',
              lg: 'inline-block',
            },
            position: 'fixed',
            left: 0,
            top: 0,
            width: sidebarToggle ? 0 : theme.sidebar.width,
            minWidth: sidebarToggle ? 0 : theme.sidebar.width,
            transition: 'width 0.3s, min-width 0.3s, left 0.3s',
            background:
              theme.palette.mode === 'dark'
                ? alpha(lighten(theme.header.background as string, 0.1), 1)
                : darken(theme.colors.alpha.black[100], 0.5),
            boxShadow: theme.palette.mode === 'dark' ? theme.sidebar.boxShadow : 'none',
          }}
        >
          <Scrollbar>
            <Box mt={3}>
              <Box
                mx={2}
                sx={{
                  width: '86%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: theme.spacing(1),
                  cursor: 'pointer',
                }}
              >
                <Logo />
                <IconButton onClick={toggleSidebar}>
                  <CloseTwoToneIcon color="primary" />
                </IconButton>
              </Box>
            </Box>
            <Divider
              sx={{
                mt: theme.spacing(3),
                mx: theme.spacing(2),
                background: theme.colors.alpha.trueWhite[50],
              }}
            />
            <SidebarMenu />
          </Scrollbar>
          <Divider
            sx={{
              background: theme.colors.alpha.trueWhite[50],
            }}
          />
          {/* <Box p={2}>
          <Button
            href="https://bloomui.com"
            target="_blank"
            rel="noopener noreferrer"
            variant="contained"
            size="small"
            fullWidth
          >
            Settings
          </Button>
        </Box> */}
        </SidebarWrapper>
      ) : (
        <Drawer
          sx={{
            boxShadow: `${theme.sidebar.boxShadow}`,
          }}
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={!sidebarToggle}
          onClose={closeSidebar}
          variant="temporary"
          elevation={9}
        >
          <SidebarWrapper
            sx={{
              background:
                theme.palette.mode === 'dark'
                  ? theme.colors.alpha.white[100]
                  : darken(theme.colors.alpha.black[100], 0.5),
            }}
          >
            <Scrollbar>
              <Box mt={3}>
                <Box
                  mx={2}
                  sx={{
                    width: 52,
                  }}
                >
                  <Logo />
                </Box>
              </Box>
              <Divider
                sx={{
                  mt: theme.spacing(3),
                  mx: theme.spacing(2),
                  background: theme.colors.alpha.trueWhite[50],
                }}
              />
              <SidebarMenu />
            </Scrollbar>
          </SidebarWrapper>
        </Drawer>
      )}
    </>
  );
}

export default Sidebar;
