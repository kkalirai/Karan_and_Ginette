'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';

import { useRequest } from '@/components/App';
import styles from '@/styles/Components/Container/SubHeader.module.scss';
import { confirmDialog } from '@/utils/helpers';
import { REQUEST } from '@/types/interfaces';

function ClientHeader(props: { title: string; totalRecords: number }) {
  const router = useRouter();
  const { request } = useRequest();
  const exportToCSV = async () => {
    const moduleName = 'clients';
    const confirm = await confirmDialog('Are you sure you want to export Table to CSV?');
    if (!confirm) return;
    (await request('exportTable', { moduleName })) as REQUEST;
  };
  return (
    <>
      <div className={styles.SubHeadMainSettings}>
        <div className={`${styles.SubHead} d-flex justify-content-between align-items-center`}>
          <div className={`p-2 ${styles.CustomerCount}`}>
            {props.title} <span> {props.totalRecords} records</span>
          </div>

          <div className="p-2">
            <Button variant="outline-secondary" className="me-2 btn-sm" onClick={exportToCSV}>
              <Image alt="download" height={16} width={16} src="/assets/icons/download.svg" /> Export
            </Button>

            <span onClick={() => router.back()}>
              <Image alt="Client" height={15} width={15} src="/assets/icons/chevron-left.svg" /> Back
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(ClientHeader);
