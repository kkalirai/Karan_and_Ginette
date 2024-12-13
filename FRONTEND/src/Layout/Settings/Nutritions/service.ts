import { ACTION, API_ERROR, KEYPAIR } from '@/types/interfaces';
import { api } from '@/utils/axiosInterceptor';
import { formatDate, handleErrors } from '@/utils/helpers';

export async function getNutritionsList(action: ACTION): Promise<any> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const searchKey = payload.keyword || '';
    const sortOrder = payload.sortOrder || 'asc';
    const sortKey = payload.sortKey || 'id';
    const pageNumber = payload.pageNumber || 1;
    const pageLength = payload.pageLength || 10;

    const url = `/api/administrator/nutritions`;
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

export async function createNutrition(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action;

    const res: ReturnType<any> = await api(`/api/administrator/nutritions`, 'POST', { data: payload });

    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function updateNutrition(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const res: ReturnType<any> = await api(`/api/administrator/nutritions/${payload?.id}`, 'PUT', { data: payload });
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function removeNutritionFromList(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const res: ReturnType<any> = await api(`/api/administrator/nutritions/${payload?.id}`, 'DELETE', {
      data: payload,
    });
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function getNutritionDetailById(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const res: ReturnType<any> = await api(`/api/administrator/nutritions/${payload?.id}`);
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

// export async function exportNutritionTable(): Promise<unknown> {
//   try {
//     const res: ReturnType<any> = (await api(`/api/administrator/get-csv-data`, 'GET', {
//       responseType: 'blob',
//     })) as any;

//     const href = window.URL.createObjectURL(res);
//     const link = document.createElement('a');
//     link.href = href;
//     link.setAttribute('download', `Table_${formatDate(new Date())}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     window.URL.revokeObjectURL(href);
//   } catch (error) {
//     return handleErrors(error as API_ERROR);
//   }
// }

export async function exportTable(action: ACTION): Promise<unknown> {
  const { payload } = action as { payload: KEYPAIR };
  const { moduleName } = payload as any;
  const { userId } = payload as any;
  const { administratorId } = payload as any;

  const options = {
    responseType: 'blob',
    params: {
      moduleName,
      userId,
      administratorId,
    },
  } as any;

  try {
    const res: ReturnType<any> = (await api(`/api/administrator/get-data`, 'GET', options)) as any;

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
