import { ACTION, API_ERROR, KEYPAIR } from '@/types/interfaces';
import { api } from '@/utils/axiosInterceptor';
import { formatDate, handleErrors } from '@/utils/helpers';

export async function getUsersList(action: ACTION): Promise<any> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const searchKey = payload.keyword || '';
    const sortOrder = payload.sortOrder || 'asc';
    const sortKey = payload.sortKey || 'id';
    const pageNumber = payload.pageNumber || 1;
    const pageLength = payload.pageLength || 10;

    const url = `/api/administrator/admin-list`;
    const options = {
      params: {
        searchKey,
        sortOrder,
        sortKey,
        pageNumber,
        pageLength,
        role: 2
      },
    } as any;

    const res = (await api(url, 'GET', options)) as any;
    return res.data;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function createUser(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const url = `/api/administrator/create-admin`;

    const res = (await api(url, 'POST', {data: {...payload, role: 2}})) as any;
    return res.data;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function updateUser(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const res: ReturnType<any> = await api(`/api/administrator/update-admin/${payload?.id}`, 'POST', { data: payload });
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function removeUserFromList(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action as any;
    const res: ReturnType<any> = await api(`/api/administrator/delete-admin/${payload?.id}`, 'DELETE', { data: payload });
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function getUserDetailById(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const res: ReturnType<any> = await api(`/api/administrator/get-details/${payload?.id}`);
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function exportUsersTable(): Promise<unknown> {
  try {
    const res: ReturnType<any> = (await api(`/api/user/export-user`, 'GET', {
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

export async function getClientList(action: ACTION): Promise<any> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const searchKey = payload.keyword || '';
    const sortOrder = payload.sortOrder || 'asc';
    const sortKey = payload.sortKey || 'id';
    const pageNumber = payload.pageNumber || 1;
    const pageLength = payload.pageLength || 10;

    const url = `/api/administrator/admin-list`;
    const options = {
      params: {
        searchKey,
        sortOrder,
        sortKey,
        pageNumber,
        pageLength,
        role: 4
      },
    } as any;

    const res = (await api(url, 'GET', options)) as any;
    return res.data;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function createClient(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const url = `/api/administrator/create-admin`;
    const res = (await api(url, 'POST', {data: {...payload, role: 4}})) as any;
    return res.data;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function updateClient(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const res: ReturnType<any> = await api(`/api/administrator/update-admin/${payload?.id}`, 'PUT', { data: payload });
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function removeClientFromList(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action as any;
    const res: ReturnType<any> = await api(`/api/administrator/delete-admin/${payload?.id}`, 'DELETE', { data: payload });
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function getClientDetailById(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const res: ReturnType<any> = await api(`/api/administrator/get-details/${payload?.id}`);
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function exportClientsTable(): Promise<unknown> {
  try {
    const res: ReturnType<any> = (await api(`/api/user/export-user`, 'GET', {
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
