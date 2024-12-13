import Image from 'next/image';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

import { useCommonReducer } from '@/components/App/reducer';
import Checkbox from '@/components/Default/Checkbox';
import styles from '@/styles/Components/Customer/Customer.module.scss';
import { KEYPAIR } from '@/types/interfaces';

export interface COLUMN {
  name: string;
  label: string;
}

interface PROPS {
  model: string;
  state: {
    columns?: {
      selected: COLUMN[];
      view: COLUMN[];
    };
  };
  dispatch: React.Dispatch<KEYPAIR>;
  onClose: () => void;
  onSave: (data: { selected: COLUMN[]; view: COLUMN[] }) => void;
}

const EditColumns = (props: PROPS) => {
  const { state, dispatch } = useCommonReducer({});
  const { state: columnState } = props;

  useEffect(() => {
    dispatch({ columns: columnState.columns });
  }, []);

  const searchColumnName = (event: React.ChangeEvent) => {
    const { value } = event.target as HTMLInputElement;
    if (!columnState.columns?.view?.length) return;
    const viewColumns = columnState.columns?.view;
    console.log('klg-39', viewColumns, value);
    dispatch({
      columns: {
        view: viewColumns?.filter((fr: { label: string }) => fr.label?.toLowerCase().includes(value?.toLowerCase())),
        selected: state.columns.selected,
      },
    });
  };

  const drop = useCallback(
    (event: any, col: COLUMN, type?: string) => {
      const checked = event.target as HTMLInputElement;
      if (checked) {
        const updatedViewCol = state?.columns?.view?.filter((vr: { name: string }) => vr.name !== col.name);
        const updatedSelectedCol = [...(state?.columns?.selected || []), col];
        dispatch({ columns: { view: updatedViewCol, selected: updatedSelectedCol } });
      }
      if (type === 'selected') {
        const updatedSelectedCol = state?.columns?.selected?.filter((vr: { name: string }) => vr.name !== col.name);
        const updatedViewCol = [...(state?.columns?.view || []), col];
        dispatch({ columns: { view: updatedViewCol, selected: updatedSelectedCol } });
      }
    },
    [state?.columns?.view, state?.columns?.selected],
  );

  const onClose = () => {
    dispatch({ columns: columnState?.columns });
    if (props?.onClose) props?.onClose();
  };

  const handleDragStart = (event: React.DragEvent, colName: any, colType: string) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ colName, colType }));
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = useCallback(
    (event: React.DragEvent, targetColType: string) => {
      event.preventDefault();
      const data = event.dataTransfer.getData('text/plain');
      if (data.trim() === '') {
        return;
      }
      const droppedData = JSON.parse(data);
      const dropZoneRect = event.currentTarget.getBoundingClientRect();
      const dropPosition = event.clientY - dropZoneRect.top;

      const updatedCols = {
        ...state.columns,
      };

      if (droppedData.colType !== targetColType) {
        const sourceCols = state.columns[droppedData.colType].filter(
          (col: COLUMN) => col.name !== droppedData.colName.name,
        );
        const targetCols = [...state.columns[targetColType]];
        const insertionIndex =
          targetColType === 'view' ? Math.floor(dropPosition / 46) + 1 : Math.floor(dropPosition / 46) - 1;
        targetCols.splice(insertionIndex, 0, droppedData.colName);
        updatedCols[droppedData.colType] = sourceCols;
        updatedCols[targetColType] = targetCols;
      } else {
        const targetCols = [...state.columns[targetColType]];
        const draggedCol = targetCols.find((col: COLUMN) => col.name === droppedData.colName.name);
        const draggedIndex = targetCols.indexOf(draggedCol);
        targetCols.splice(draggedIndex, 1);
        const insertionIndex =
          targetColType === 'view' ? Math.floor(dropPosition / 46) : Math.floor(dropPosition / 46) - 1;
        targetCols.splice(insertionIndex, 0, draggedCol);
        updatedCols[targetColType] = targetCols;
      }
      dispatch({ columns: updatedCols });
    },
    [state?.columns],
  );

  // console.log(state, columnState);

  return (
    <div>
      {/* Left panel */}
      <div className={styles.customerModel} style={{ marginBottom: '20px' }}>
        <div className={styles.LeftPannel}>
          <div className={`${styles.custSearch} searchArea `}>
            <div className="searchInput ModelSearch">
              <Image alt="search" height={24} width={24} src="/assets/images/search.svg" />
              <Form.Control onChange={searchColumnName} type="text" placeholder="Search column name" />
            </div>
          </div>
          <div className={styles.ColumnsList}>
            <h3>Columns</h3>
            <ul data-col="view" onDragOver={handleDragOver} onDrop={event => handleDrop(event, 'view')}>
              {state?.columns?.view?.map((pr: COLUMN, index: number) => (
                <li
                  key={index}
                  onDragEnd={event => handleDrop(event, 'view')}
                  draggable
                  onDragStart={event => handleDragStart(event, pr, 'view')}
                >
                  <span>
                    <Checkbox
                      checked={state?.columns?.selected.includes(pr.name)}
                      name={'column' + pr.name}
                      onChange={event => drop(event, pr)}
                    />
                  </span>{' '}
                  {pr.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Right panel */}
        <div
          className={styles.RightPannel}
          data-col="selected"
          onDragOver={handleDragOver}
          onDrop={event => handleDrop(event, 'selected')}
        >
          <h3>Selected columns</h3>

          {state?.columns?.selected?.map((pr: COLUMN, index: number) => (
            <div
              className={styles.selectedCol}
              key={index}
              onDragEnd={event => handleDrop(event, 'selected')}
              draggable
              onDragStart={event => handleDragStart(event, pr, 'selected')}
            >
              <div>
                <span className={styles.ListIcon}>
                  <Image alt="listIcon" height={24} width={24} src="/assets/images/listIcon.svg" />
                </span>
                <span>{pr.label}</span>
              </div>
              <div className={styles.closeIcon} onClick={event => drop(event, pr, 'selected')}>
                {' '}
                <Image alt="close" height={24} width={24} src="/assets/images/close.svg" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="modal-footer edit-column-footer">
        <Button className="OutlineBtn" onClick={onClose}>
          Cancel
        </Button>
        <Button className="customBtn" onClick={() => props?.onSave(state?.columns)}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default memo(EditColumns);
