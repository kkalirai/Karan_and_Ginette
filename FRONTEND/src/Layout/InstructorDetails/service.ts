import { ACTION, API_ERROR, KEYPAIR } from '@/types/interfaces';
import { api } from '@/utils/axiosInterceptor';
import { handleErrors } from '@/utils/helpers';

export async function getClientsList(action: ACTION): Promise<any> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const searchKey = payload.keyword || '';
    const sortOrder = payload.sortOrder || 'asc';
    const sortKey = payload.sortKey || 'id';
    const pageNumber = payload.pageNumber || 1;
    const pageLength = payload.pageLength || 10;

    const url = `/api/administrator/user-list`;
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

export async function getInstructorNutritionList(action: ACTION): Promise<any> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const { filter } = payload as any;
    const searchKey = payload.keyword || '';
    const sortOrder = payload.sortOrder || 'asc';
    const sortKey = payload.sortKey || 'id';
    const pageNumber = payload.pageNumber || 1;
    const pageLength = payload.pageLength || 10;
    const instructorID = filter.instructorId || 88;

    const url = `/api/administrator/instructor/get-created-nutritions`;
    const options = {
      params: {
        searchKey,
        sortOrder,
        sortKey,
        pageNumber,
        pageLength,
        instructorID,
      },
    } as any;

    const res = (await api(url, 'GET', options)) as any;

    return res.data;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function getInstructorWorkoutList(action: ACTION): Promise<any> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const { filter } = payload as any;
    const searchKey = payload.keyword || '';
    const sortOrder = payload.sortOrder || 'asc';
    const sortKey = payload.sortKey || 'count';
    const pageNumber = payload.pageNumber || 1;
    const pageLength = payload.pageLength || 10;
    const instructorID = filter.instructorId || 88;

    const url = `/api/administrator/instructor/get-created-workouts`;
    const options = {
      params: {
        searchKey,
        sortOrder,
        sortKey,
        pageNumber,
        pageLength,
        instructorID,
      },
    } as any;

    const res = (await api(url, 'GET', options)) as any;

    return res.data;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}
