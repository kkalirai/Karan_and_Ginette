import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import ExpandMoreTwoToneIcon from '@mui/icons-material/ExpandMoreTwoTone';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  Popover,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRef, useState } from 'react';

import { useContainerContext } from '@/Layout/Container/context';
import { logout } from '@/utils/helpers';
import { useRouter } from 'next/navigation';

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`,
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`,
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`,
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightLight};
        color: ${theme.palette.secondary.main};
        display: block;
`,
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`,
);

function HeaderUserbox() {
  const {
    state: { profileDetail },
  } = useContainerContext();
  const router = useRouter()
  const logoutUser = () =>{
    logout()
    router.push("/login")
  }

  const user = {
    name: profileDetail?.name,
    avatar: profileDetail?.profile_image ?? '',
  };

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar variant="rounded" alt={user.name} src={user.avatar} />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
            <UserBoxDescription variant="body2">Super Admin</UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar variant="rounded" alt={user.name} src={user.avatar} />
          <UserBoxText>
            <UserBoxLabel variant="body1">{user.name}</UserBoxLabel>
            <UserBoxDescription variant="body2">Super Admin</UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider />
        <Button color="primary" fullWidth onClick={logoutUser}>
          <LockOpenTwoToneIcon sx={{ mr: 1 }} />
          Sign out
        </Button>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
