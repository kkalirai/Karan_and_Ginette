'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Dropdown } from 'react-bootstrap';

import styles from '@/styles/Components/Container/SubHeader.module.scss';
import { useRequest } from '@/components/App';
import { confirmDialog } from '@/utils/helpers';
import { REQUEST } from '@/types/interfaces';

function InstructorTabHeader(props: {
  instructorFirstName?: string;
  instructorLastName?: string;
  instructorId?: string;
}) {
  const instructorId = props.instructorId;

  const router = useRouter();
  const { request } = useRequest();

  const handleDropdownSelect = async (eventKey: string) => {
    let moduleName = '';
    switch (eventKey) {
      case 'action-1':
        moduleName = 'clients';

        break;
      case 'action-2':
        moduleName = 'instructor-created-nutritions';
        break;
      case 'action-3':
        moduleName = 'instructor-created-workouts';
        break;
      default:
        break;
    }

    const confirm = await confirmDialog('Are you sure you want to export Table to CSV?');
    if (!confirm) return;
    (await request('exportTable', { moduleName, instructorId })) as REQUEST;
  };
  return (
    <>
      <div className={styles.SubHeadMainSettings}>
        <div className={styles.SubHead}>
          <div className={styles.CustomerCount} style={{ padding: '15px' }}>
            {props.instructorFirstName} {props.instructorLastName}
          </div>
          <div className="row">
            <span className="p-2" onClick={() => router.back()}>
              <Image alt="Client" height={15} width={15} src="/assets/icons/chevron-left.svg" /> Back
            </span>
            <Dropdown
              className="ActionDropDown me-2 "
              onSelect={(eventKey: string | null) => {
                if (eventKey !== null) {
                  handleDropdownSelect(eventKey);
                }
              }}
            >
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Export Table
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="action-1">Clients</Dropdown.Item>
                <Dropdown.Item eventKey="action-2">Nutritions</Dropdown.Item>
                <Dropdown.Item eventKey="action-3">Workouts</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(InstructorTabHeader);
