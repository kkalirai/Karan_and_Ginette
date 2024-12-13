'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { Dropdown } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

import { useRequest } from '@/components/App';
import { confirmDialog } from '@/utils/helpers';
import styles from '@/styles/Components/Container/SubHeader.module.scss';
import { REQUEST } from '@/types/interfaces';

function ClientTabHeader(props: { clientFirstName?: string; clientLastName?: string; clientId?: string }) {
  const router = useRouter();
  const { request } = useRequest();
  const userId = props.clientId;

  const handleDropdownSelect = async (eventKey: string) => {
    let moduleName = '';
    switch (eventKey) {
      case 'action-1':
        moduleName = 'client-weights';

        break;
      case 'action-2':
        moduleName = 'client-completed-workouts';
        break;
      case 'action-3':
        moduleName = 'client-nutritions';
        break;
      default:
        break;
    }
    const confirm = await confirmDialog('Are you sure you want to export Table to CSV?');
    if (!confirm) return;
    (await request('exportTable', { moduleName, userId })) as REQUEST;
  };
  return (
    <>
      <div className={styles.SubHeadMainSettings}>
        <div className={styles.SubHead}>
          <div className={styles.CustomerCount} style={{ padding: '15px' }}>
            {props.clientFirstName} {props.clientLastName}
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
                <Dropdown.Item eventKey="action-1">Weights</Dropdown.Item>
                <Dropdown.Item eventKey="action-2">Completed Workouts</Dropdown.Item>
                <Dropdown.Item eventKey="action-3">Nutritions</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(ClientTabHeader);
