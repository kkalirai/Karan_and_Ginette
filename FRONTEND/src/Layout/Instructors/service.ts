import { ACTION, API_ERROR, KEYPAIR } from '@/types/interfaces';
import { api } from '@/utils/axiosInterceptor';
import { handleErrors } from '@/utils/helpers';

export async function getInstructorsList(action: ACTION): Promise<any> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const searchKey = payload.keyword || '';
    const sortOrder = payload.sortOrder || 'asc';
    const sortKey = payload.sortKey || 'id';
    const pageNumber = payload.pageNumber || 1;
    const pageLength = payload.pageLength || 10;

    const url = `/api/administrator/instructors-list`;
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
