import { ACTION, API_ERROR, KEYPAIR } from '@/types/interfaces';
import { api } from '@/utils/axiosInterceptor';
import { handleErrors, setHeader, toastr } from '@/utils/helpers';

/* Login User */
export async function LoginUser(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action;
    const res: ReturnType<any> = await api('/api/auth/login', 'POST', { data: payload });

    if (res?.data?.token) {
      toastr('Login Successful', 'success', 'Login');
      setHeader(res.data.token, 'accessToken');
    }
    if (res?.data?.sessionId) {
      setHeader(res.data.sessionId?.toString(), 'sessionId');
    }
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function RegisterUser(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action;
    const res: ReturnType<any> = await api('/api/auth/register-user', 'POST', { data: payload });

    if (res?.data?.token) {
      toastr('Registration Successful', 'success', 'Login');
      setHeader(res.data.token, 'accessToken');
    }
    if (res?.data?.sessionId) {
      setHeader(res.data.sessionId?.toString(), 'sessionId');
    }
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}



export async function forgotPassword(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action;
    const res: ReturnType<any> = await api('/api/auth/forgot-password', 'POST', { data: payload });
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function resetPassword(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action;
    const { token, ...other } = payload as KEYPAIR;
    const res: ReturnType<any> = await api('/api/auth/reset-password', 'POST', {
      data: other,
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    });
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function verifyOTP(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action;
    const res: ReturnType<any> = await api('/api/auth/verify-otp', 'POST', { data: payload });
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}
