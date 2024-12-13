'use client';

import React, { memo, useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import { Dropdown, Image } from 'react-bootstrap';
//import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { useRequest } from '@/components/App';
import { useCommonReducer } from '@/components/App/reducer';
import Modal from '@/components/Default/Modal';
import DefaultTable from '@/components/Default/Table';
import { useContainerContext } from '@/Layout/Container/context';
import { REQUEST } from '@/types/interfaces';
import { deleteDialog, toastr } from '@/utils/helpers';
import PagePreview from '@/Layout/Settings/Cms/Components/PagePreview';

import PageHeader from './Components/PageHeader';
import PageForm from './Components/PageForm';

interface CMS {
  id: string;
  title: string;
  slug: string;
  content: string;
  subTitle: string;
  metaTitle: string;
  metaKeyword: string;
  shortDescription: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
  status: number;
  action: JSX.Element;
}

function Index() {
  //const router = useRouter();
  const { request, loading } = useRequest();
  const { state: globalState } = useContainerContext();
  const { state, dispatch } = useCommonReducer({
    columns: {
      view: [],
      selected: [],
    },
  });

  const removePage = async (id: string | string[]) => {
    if (!id?.length) return;
    const confirm = await deleteDialog('Are you sure you want to delete the page/pages?', 'Delete Page');
    if (confirm) {
      const res = (await request('removePageFromList', { id: id })) as REQUEST;
      if (res) toastr('The page has been successfully removed.', 'success', 'Page removed');
      dispatch({ pageDetail: {}, multirecordSelected: false, viewPagePreviewModal: false });
    }
  };

  // const viewPage = async (slug: string | string[]) => {
  //   if (!slug?.length) return;
  //   router.push(`/${slug}`);
  // };

  const openModal = () => {
    dispatch({ viewCustomerModal: true, edit: false, CustomerModalTitle: 'Add new page', pageDetail: null });
  };

  const openEditModal = (data: CMS) => {
    dispatch({ viewCustomerModal: true, edit: true, CustomerModalTitle: `Edit ${data.title}`, pageDetail: data });
  };

  const closeModal = (key: string) => {
    dispatch({ [key]: false, pageDetail: null, columns: state?.columns, CustomerModalTitle: '' });
  };

  const openPreviewModal = (data: CMS) => {
    dispatch({ viewPagePreviewModal: true, pageDetail: data });
  };

  const editPreviewModal = (data: CMS) => {
    dispatch({
      viewPagePreviewModal: false,
      viewCustomerModal: true,
      edit: true,
      pageDetail: data,
      CustomerModalTitle: `Edit ${data.title}`,
    });
  };

  const columns = [
    {
      dataField: 'serial',
      text: '#',
      sort: true,
    },
    {
      dataField: 'title',
      text: 'Title',
      sort: true,
    },
    {
      dataField: 'slug',
      text: 'Slug',
      sort: true,
    },

    {
      dataField: 'status',
      text: 'Status',
      sort: false,
    },
    {
      dataField: 'updatedAt',
      text: 'Updated',
      sort: false,
    },
    {
      dataField: 'action',
      text: 'Action',
    },
  ];

  const getPagesList = useMemo(
    () =>
      globalState?.getPagesList?.result
        ? globalState?.getPagesList?.result?.map((page: CMS, index: number) => ({
            serial: index + 1,
            title: (
              <div className="usr-preview">
                <span>{page.title}</span>
                <button onClick={() => openPreviewModal(page)}>Preview</button>
              </div>
            ),
            slug: page.slug,
            status:
              page.status === 1 ? (
                <Button className="customBtn SmBtn" variant="success">
                  Active
                </Button>
              ) : (
                <Button className="customBtn SmBtn" variant="danger">
                  Inactive
                </Button>
              ),
            updatedAt: page.updatedAt,
            action: (
              <>
                <Dropdown className="actionDropDown">
                  <Dropdown.Toggle id="dropdown-basic">
                    <Image alt="menu" height={20} width={20} src="/assets/images/menu.svg" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => openEditModal(page)}>
                      <Image alt="editIcon" height={16} width={16} src="/assets/images/edit.svg" /> Edit details
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => removePage([page.id])}>
                      <Image alt="deleteIcon" height={16} width={16} src="/assets/images/delete.svg" /> Delete
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} href={`/${page.slug}`} target="_blank">
                      <Image alt="viewIcon" height={16} width={16} src="/assets/images/view.svg" /> Web View
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => openPreviewModal(page)}>
                      <Image alt="viewIcon" height={16} width={16} src="/assets/images/preview.svg" /> View
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ),
          }))
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [globalState?.getPagesList?.result],
  );

  // /* Loading /
  const isLoading = useMemo(
    () => loading?.removePageFromList_LOADING || state?.isEditLoading,
    [loading, state?.isEditLoading],
  );

  return (
    <>
      <PageHeader
        {...{
          title: 'Pages',
          totalRecords: globalState?.getPagesList?.total,
          handleOpen: openModal,
        }}
      />
      <DefaultTable
        api={{
          url: 'getPagesList',
        }}
        search={false}
        columns={columns}
        data={getPagesList}
        loading={Boolean(isLoading)}
        title=""
        placeholder="Search by Title or Slug"
      />

      <Modal
        id={'Customer' + '_modal'}
        title={state?.CustomerModalTitle}
        show={state.viewCustomerModal}
        width="80%"
        onClose={() => closeModal('viewCustomerModal')}
      >
        <PageForm {...{ state, dispatch }} handleClose={() => closeModal('viewCustomerModal')} />
      </Modal>
      {state.viewPagePreviewModal && state.pageDetail && (
        <Modal
          id={'PagePreview' + '_modal'}
          title={state?.CustomerModalTitle}
          show={true}
          // width="80%"
          onClose={() => closeModal('viewPagePreviewModal')}
        >
          <PagePreview
            pageDetail={state.pageDetail}
            handleEdit={() => editPreviewModal(state.pageDetail)}
            onDelete={() => removePage([state.pageDetail.id])}
          />
        </Modal>
      )}
    </>
  );
}

export default memo(Index);
