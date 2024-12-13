import { ACTION, API_ERROR } from '@/types/interfaces';
import { api } from '@/utils/axiosInterceptor';
import { handleErrors } from '@/utils/helpers';

export async function getColumns(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action;
    const res: ReturnType<any> = await api(`/api/table-column/get-details/${payload?.model}`, 'GET');
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function editColumns(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action;
    const res: ReturnType<any> = await api(`/api/table-column/add-update`, 'POST', { data: payload });
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}
