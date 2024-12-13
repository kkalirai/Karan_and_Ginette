'use client';

import Image from 'next/image';
import React, { memo } from 'react';
import { Button } from 'react-bootstrap';

import { useRequest } from '@/components/App';
import styles from '@/styles/Components/Container/SubHeader.module.scss';
import { REQUEST } from '@/types/interfaces';
import { confirmDialog } from '@/utils/helpers';

function PageHeader(props: { title: string; totalRecords: number; handleOpen: () => void }) {
  const { request } = useRequest();
  const exportToCSV = async () => {
    const confirm = await confirmDialog('Are you sure you want to export Table to CSV?');
    if (!confirm) return;
    (await request('exportUsersTable')) as REQUEST;
  };

  return (
    <>
      <div className={styles.SubHeadMainSettings}>
        <div className={styles.SubHead}>
          <div className={styles.CustomerCount}>
            {props.title} <span> {props.totalRecords} records</span>
          </div>
          <div>
            <Button className="OutlineBtn SmBtn" onClick={exportToCSV}>
              <Image alt="download" height={16} width={16} src="/assets/icons/download.svg" /> Export
            </Button>{' '}
            <Button className="customBtn SmBtn" onClick={() => props.handleOpen()}>
              <Image alt="add" height={16} width={16} src="/assets/icons/add.svg" /> Add a new page
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(PageHeader);
