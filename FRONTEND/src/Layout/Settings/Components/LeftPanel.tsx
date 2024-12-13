'use-client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { memo } from 'react';

import { useContainerContext } from '@/Layout/Container/context';

function LeftPanel() {
  const router = useRouter();
  const asPath = usePathname();
  const { state: globalState } = useContainerContext();

  return (
    <div className="leftPannel plr0">
      <div className="DtlleftTop plr24 mb24">
        <div>
          <span role="button" onClick={() => router.back()}>
            <Image alt="LeftPanle" height={15} width={15} src="/assets/icons/chevron-left.svg" /> Back
          </span>
        </div>
      </div>
      <div className="settings">
        <h2>Settings</h2>
      </div>
      <div className="preferences">
        <h3>Preferences</h3>
        <ul>
          <li>
            <Link className={asPath.includes('accounts') ? 'preference-selected' : ''} href="/settings/accounts">
              Account
            </Link>
          </li>
          <li>
            <Link className={asPath.includes('branding') ? 'preference-selected' : ''} href="/settings/branding">
              Branding
            </Link>
          </li>
        </ul>
        {globalState?.profileDetail?.role !== 'USER' ? (
          <>
            <h3 className="mt-4">User management</h3>
            <ul>
              <li>
                <Link className={asPath.includes('users') ? 'preference-selected' : ''} href="/settings/users">
                  Users
                </Link>
              </li>
            </ul>
          </>
        ) : null}

        <h3 className="mt-4">Cms management</h3>
        <ul>
          <li>
            <Link className={asPath.includes('cms') ? 'preference-selected' : ''} href="/settings/cms">
              Cms
            </Link>
          </li>
        </ul>

        <h3 className="mt-4">Integrations</h3>
        <ul>
          <li>
            <Link className={asPath.includes('nutritions') ? 'preference-selected' : ''} href="/settings/nutritions">
              Nutritions
            </Link>
          </li>
          <li>
            <Link className={asPath.includes('workouts') ? 'preference-selected' : ''} href="/settings/workouts">
              Workouts
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default memo(LeftPanel);
