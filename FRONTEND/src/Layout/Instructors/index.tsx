'use client';

import React, { memo, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useCommonReducer } from '@/components/App/reducer';
import DefaultTable from '@/components/Default/Table';
import { useContainerContext } from '@/Layout/Container/context';

import InstructorHeader from './Components/InstructorHeader';

interface INSTRUCTOR {
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

  const getInstructorsList = useMemo(
    () =>
      globalState?.getInstructorsList?.result
        ? globalState?.getInstructorsList?.result?.map((instructors: INSTRUCTOR, index: number) => ({
            serial: index + 1,
            firstName: instructors.firstName,
            lastName: instructors.lastName,
            email: instructors.email,
            isActive:
              instructors.isActive === 1 ? (
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
                    `/instructorDetails?instructorFirstName=${instructors.firstName}&instructorLastName=${instructors.lastName}&instructorId=${instructors.id}`,
                  )
                }
              >
                Details
              </Button>
            ),
          }))
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [globalState?.getInstructorsList?.result],
  );

  // /* Loading /
  const isLoading = useMemo(() => state?.isEditLoading, [state?.isEditLoading]);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <InstructorHeader
              {...{
                title: 'Instructors',
                totalRecords: globalState?.getInstructorsList?.total,
              }}
            />
            <DefaultTable
              api={{
                url: 'getInstructorsList',
              }}
              search={false}
              columns={columns}
              data={getInstructorsList}
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
