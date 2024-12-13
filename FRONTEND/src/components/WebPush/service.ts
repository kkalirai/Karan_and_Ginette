import { ACTION } from '@/types/interfaces';
import { api } from '@/utils/axiosInterceptor';
import { handleErrors } from '@/utils/helpers';

/* Create Fleet  User Address */
export async function sendPushNotification(action: ACTION): Promise<unknown> {
  const { payload } = action;
  const res: ReturnType<any> = await api('/v1/api/subscribe', 'POST', { data: payload });
  if (res.status) {
    return res;
  } else {
    // Handle Errors
    if (res.errors) return handleErrors(res.errors);
  }
}
