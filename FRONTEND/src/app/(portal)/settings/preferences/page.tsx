// Components
import { Metadata } from 'next';
import { cookies } from 'next/headers';

import Accounts from '@/Layout/Settings/Preferences';
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
  )) as any;

  return profileDetail?.data;
}

async function Index() {
  const profileDetail = await fetchSettings();

  return (
    <>
      <Accounts profileDetail={profileDetail as any} />
    </>
  );
}

export default Index;
