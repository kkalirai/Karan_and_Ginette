export const settings = {
  name: 'Fitness',
  logo: '',
  loginCoverImage: '',
  primaryColor: '#009d33',
  secondaryColor: '#101828',
  backendURL: process.env.NEXT_PUBLIC_BACKEND_URL,
};

export const permissions = [
  {
    pathname: '/settings',
    userRole: ['superadmin', 'admin'],
  },
  {
    pathname: '/dashboard',
    userRole: ['superadmin', 'admin', 'user'],
  },
  {
    pathname: '/posts',
    userRole: ['superadmin', 'admin', 'user'],
  },
];
