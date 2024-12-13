import { ACTION, API_ERROR, KEYPAIR } from '@/types/interfaces';
import { api } from '@/utils/axiosInterceptor';
import { formatDate, handleErrors } from '@/utils/helpers';

export async function getPagesList(action: ACTION): Promise<any> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const searchKey = payload.keyword || '';
    const sortOrder = payload.sortOrder || 'asc';
    const sortKey = payload.sortKey || 'id';
    const pageNumber = payload.pageNumber || 1;
    const pageLength = payload.pageLength || 10;

    const url = `/api/administrator/cms-list`;
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

export async function getTitlesList(): Promise<any> {
  try {
    const res: ReturnType<any> = await api('/api/administrator/cms/page-titles', 'GET');
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}
//createUser
export async function createPage(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action;
    const res: ReturnType<any> = await api(`/api/administrator/cms/add-new-page`, 'POST', { data: payload });
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function updatePage(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const res: ReturnType<any> = await api(`/api/administrator/cms/edit/${payload?.id}`, 'POST', { data: payload });
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function removePageFromList(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const res: ReturnType<any> = await api(`/api/administrator/cms/delete-page/${payload?.id}`, 'DELETE', {
      data: payload,
    });
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
}

export async function getPageDetailByTitle(action: ACTION): Promise<unknown> {
  try {
    const { payload } = action as { payload: KEYPAIR };
    const res: ReturnType<any> = await api(`/api/administrator/cms/view/${payload?.id}`);
    return res.pageData;
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
