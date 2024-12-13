'use client';
import React, { memo, useMemo } from 'react';
import Button from 'react-bootstrap/Button';
import { useRouter } from 'next/navigation';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useCommonReducer } from '@/components/App/reducer';
import DefaultTable from '@/components/Default/Table';
import { useContainerContext } from '@/Layout/Container/context';

import ClientHeader from './Components/ClientHeader';

interface CLIENT {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: number;
  manage: string;
}

function Index() {
  const router = useRouter();
  const { state: globalState } = useContainerContext();
  const { state } = useCommonReducer({
    columns: {
      view: [],
      selected: [],
    },
  });

  const columns = [
    {
      dataField: 'serial',
      text: '#',
      sort: true,
    },
    {
      dataField: 'firstName',
      text: 'First Name',
      sort: true,
    },
    {
      dataField: 'lastName',
      text: 'Last Name',
      sort: true,
    },
    {
      dataField: 'email',
      text: 'Email',
      sort: true,
    },
    {
      dataField: 'isActive',
      text: 'isActive',
      sort: false,
    },
    {
      dataField: 'manage',
      text: 'Manage',
      sort: false,
    },
  ];

  const getClientsList = useMemo(
    () =>
      globalState?.getClientsList?.result
        ? globalState?.getClientsList?.result?.map((clients: CLIENT, index: number) => ({
            serial: index + 1,
            firstName: clients.firstName,
            lastName: clients.lastName,
            email: clients.email,
            isActive:
              clients.isActive === 1 ? (
                <Button className="customBtn SmBtn" variant="success">
                  Active
                </Button>
              ) : (
                <Button className="customBtn SmBtn" variant="danger">
                  Inactive
                </Button>
              ),
            manage: (
              <Button
                className="customBtn SmBtn"
                variant="info"
                onClick={() =>
                  router.push(
                    `/clientDetails?clientFirstName=${clients.firstName}&clientLastName=${clients.lastName}&clientId=${clients.id}`,
                  )
                }
              >
                Details
              </Button>
            ),
          }))
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [globalState?.getClientsList?.result],
  );

  // Loading
  const isLoading = useMemo(() => state?.isEditLoading, [state?.isEditLoading]);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <ClientHeader
              {...{
                title: 'Clients',
                totalRecords: globalState?.getClientsList?.total,
              }}
            />
            <DefaultTable
              api={{
                url: 'getClientsList',
              }}
              search={false}
              columns={columns}
              data={getClientsList}
              loading={Boolean(isLoading)}
              title=""
              placeholder="Search by Name or Email"
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default memo(Index);
