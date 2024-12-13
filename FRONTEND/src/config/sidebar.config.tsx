import React from 'react';

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permissions: string[];
}

interface MenuSection {
  header: string;
  items: MenuItem[];
}

export type MenuConfig = MenuSection[];

export const menuConfig: MenuConfig = [
  {
    header: '',
    items: [
      {
        label: 'Overview',
        href: '/',
        permissions: ['admin', 'user'],
        icon: undefined
      },
    ],
  },
  {
    header: 'Management',
    items: [
      {
        label: 'Users',
        href: '/settings/users',
        permissions: ['admin', "superadmin"],
        icon: undefined
      },
      {
        label: 'Clients',
        href: '/settings/clients',
        permissions: ['admin', "superadmin"],
        icon: undefined
      },
      {
        label: 'Workouts',
        href: '/settings/workouts',
        permissions: ['admin', "superadmin"],
        icon: undefined
      },
      {
        label: 'Nutritions',
        href: '/settings/nutritions',
        permissions: ['admin', "superadmin"],
        icon: undefined
      },
    ],
  },
  {
    header: 'Accounts',
    items: [
      {
        label: 'Account Settings',
        href: '/settings/accounts',
        permissions: ['user', 'admin', ],
        icon: undefined
      },
      {
        label: 'Preferences',
        href: '/settings/preferences',
        permissions: ['user', 'admin'],
        icon: undefined
      },
    ],

  },
];
