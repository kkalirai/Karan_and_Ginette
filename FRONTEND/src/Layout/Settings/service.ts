import { ACTION, KEYPAIR } from '@/types/interfaces';

// Server Side Rendering
/**
 *
 * @param action Request payload
 * @returns Users List
 */
export async function getProfileDetail(action: ACTION, token: string): Promise<unknown> {
  const { payload } = action as { payload: KEYPAIR };
  const res: ReturnType<any> = await fetch(`${process.env.BACKEND}/v1/api/administrator/get-details/${payload?.id}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  return res?.json();
}

export async function serverGetPageDetailByTitle(action: ACTION, token: string): Promise<unknown> {
  const { payload } = action as { payload: KEYPAIR };
  const res: ReturnType<any> = await fetch(`${process.env.BACKEND}/v1/api/administrator/cms/view/${payload?.slug}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  return res?.json();
}

export async function getCMSPageDetailBySlug(action: ACTION): Promise<unknown> {
  const { payload } = action as { payload: KEYPAIR };
  const res: ReturnType<any> = await fetch(
    `${process.env.BACKEND}/v1/api/administrator/cms/view/public/${payload?.slug}`,
    {
      method: 'GET',
    },
  );
  return res?.json();
}
/**
 *
 * @param action Request payload
 * @returns Users List
 */
export async function getSettingsDetail(action: ACTION, token: string): Promise<unknown> {
  const { payload } = action as { payload: KEYPAIR };
  const res: ReturnType<any> = await fetch(`${process.env.BACKEND}/v1/api/settings/get-details/${payload?.model}`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  return res?.json();
}

/**
 *
 * @param action Request payload
 * @returns Users List
 */
export async function getGlobalBranding(): Promise<unknown> {
  const res: ReturnType<any> = await fetch(`${process.env.BACKEND}/v1/api/administrator/get-settings/branding`, {
    method: 'GET',
    cache: 'no-store',
  });

  return res?.json();
}
