import { ACTION, API_ERROR, KEYPAIR } from '@/types/interfaces';
import { api } from '@/utils/axiosInterceptor';
import { formatDate, handleErrors } from '@/utils/helpers';

export async function getWorkoutsList(action: ACTION): Promise<any> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const searchKey = payload.keyword || '';
    const sortOrder = payload.sortOrder || 'asc';
    const sortKey = payload.sortKey || 'id';
    const pageNumber = payload.pageNumber || 1;
    const pageLength = payload.pageLength || 10;

    const url = `/api/administrator/workouts`;
    const options = {
      params: {
        searchKey,
        sortOrder,
        sortKey,
        pageNumber,
        pageLength,
      },
    } as any;

    const res = (await api(url, 'GET', options)) as any;

    return res.data;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function createWorkout(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action;
    const res: ReturnType<any> = await api(`/api/administrator/workouts`, 'POST', { data: payload });
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function updateWorkout(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const res: ReturnType<any> = await api(`/api/administrator/workouts/${payload?.id}`, 'PUT', { data: payload });
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function removeWorkoutFromList(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const res: ReturnType<any> = await api(`/api/administrator/workouts/${payload?.id}`, 'DELETE', { data: payload });
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function getWorkoutDetailById(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const res: ReturnType<any> = await api(`/api/administrator/workout/${payload?.id}`);
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function exportWorkoutTable(): Promise<unknown> {
  try {
    const res: ReturnType<any> = (await api(`/api/administrator/get-csv-data`, 'GET', {
      responseType: 'blob',
    })) as any;

    const href = window.URL.createObjectURL(res);
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', `Table_${formatDate(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(href);
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}
