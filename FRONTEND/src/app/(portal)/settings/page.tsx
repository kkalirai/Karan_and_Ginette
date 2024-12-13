// Components
import { Metadata } from 'next';
import { cookies } from 'next/headers';

import { USER } from '@/Layout/Settings/Accounts';
import Accounts from '@/Layout/Settings/Accounts/';
import { getProfileDetail } from '@/Layout/Settings/service';
import { getDecodedToken } from '@/utils/helpers';

export const metadata: Metadata = {
  title: 'Settings - Accounts',
  description: 'Settings',
};

async function fetchSettings() {
  const cookieStore = cookies();
  const token = cookieStore.get('accessToken');
  const { decoded, isValid } = getDecodedToken(token?.value as unknown as string);
  if (!isValid) return;

  const profileDetail = (await getProfileDetail(
    {
      payload: {
        id: decoded.userID,
      },
    },
    token?.value as string,
  )) as USER;

  return profileDetail;
}

async function Index() {
  const profileDetail = await fetchSettings();
  if (!profileDetail) return;
  return (
    <>
      <Accounts profileDetail={profileDetail} />
    </>
  );
}

export default Index;
