import { api } from '@/utils/axiosInterceptor';
import { handleErrors } from '@/utils/helpers';
import { ACTION, API_ERROR, KEYPAIR } from '@/types/interfaces';

export async function getWeightsList(action: ACTION): Promise<any> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const { filter } = payload as any;

    const userID = filter.clientId || 87;
    const sortOrder = payload.sortOrder || 'asc';

    const sortKey = payload.sortKey || 'id';

    const pageNumber = payload.pageNumber;

    const pageLength = payload.pageLength;

    const url = `/api/instructor/user-weight-data-admin-panel`;
    const options = {
      params: {
        userID,
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

export async function getExercisesList(action: ACTION): Promise<any> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const { filter } = payload as any;
    const userID = filter.clientId || 13;
    const startDate = filter.startDate;

    const endDate = filter.endDate;

    const sortOrder = payload.sortOrder || 'asc';

    const sortKey = payload.sortKey || 'id';

    const pageNumber = payload.pageNumber;

    const pageLength = payload.pageLength;

    const url = `/api/administrator/user/get-completed-workouts`;
    const options = {
      params: {
        userID,
        startDate,
        endDate,
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

export async function getNutritiontypesList(action: ACTION): Promise<any> {
  try {
    const { payload } = action as { payload: KEYPAIR };

    const { filter } = payload as any;
    const userID = filter.clientId || 13;

    const sortOrder = payload.sortOrder || 'asc';

    const sortKey = payload.sortKey || 'id';

    const category = filter.selectedCategory || 'Breakfast';

    const pageNumber = payload.pageNumber;

    const pageLength = payload.pageLength;

    const url = `/api/administrator/user/get-nutrition`;
    const options = {
      params: {
        userID,
        category,
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

export async function getCategories(): Promise<unknown> {
  try {
    const res: ReturnType<any> = await api(`/api/instructor/get-nutrition-types`, 'GET');

    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}
