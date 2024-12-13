import { alpha, Box, Button, List, ListItem, ListSubheader, styled } from '@mui/material';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';

import { menuConfig } from '@/config/sidebar.config';
import { useContainerContext } from '@/Layout/Container/context';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    font-weight: 300;
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[100]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
      font-weight: 300;
    }
`,
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          font-weight: 300;
          display: flex;
          color: ${theme.colors.alpha.trueWhite[100]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[100]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[100]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(100)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create(['transform', 'opacity'])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`,
);

function SidebarMenu() {
  const { closeSidebar } = useContainerContext();
  const pathname = usePathname();

  return (
    <>
      <MenuWrapper>
        {menuConfig.map(section => (
          <List
            key={section.header}
            component="div"
            subheader={
              <ListSubheader component="div" disableSticky>
                {section.header}
              </ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component="div">
                {section.items.map(item => (
                  <ListItem key={item.href} component="div">
                    <NextLink href={item.href} passHref>
                      <Button
                        className={item.href !== '/' && pathname.startsWith(item.href) ? 'active' : ''}
                        disableRipple
                        component="a"
                        onClick={closeSidebar}
                        startIcon={item.icon}
                      >
                        {item.label}
                      </Button>
                    </NextLink>
                  </ListItem>
                ))}
              </List>
            </SubMenuWrapper>
          </List>
        ))}
      </MenuWrapper>
    </>
  );
}

export default SidebarMenu;
