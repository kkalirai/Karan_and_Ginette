import Image from 'next/image';
import React, { memo } from 'react';
import { Button, Dropdown } from 'react-bootstrap';

import { formatDate } from '@/utils/helpers';

import { PREVIEW } from '../interfaces';

interface PROPS {
  nutritionDetail: PREVIEW;
  handleEdit: () => void;
  onDelete: () => void;
}

function NutritionPreview(props: PROPS) {
  const { nutritionDetail } = props;
  return (
    <div className="canvasData">
      <div className="inner">
        <div className="topSection">
          <div className="head d-flex justify-content-between align-items-center p24 offcanvas-header">
            <div>
              <h2>{nutritionDetail.name}</h2>
            </div>
            <div>
              <Dropdown className="ActionDropDown">
                <Dropdown.Toggle id="dropdown-basic">Actions</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={event => {
                      event.preventDefault();
                      props.onDelete();
                    }}
                  >
                    <span className="menuIcon">
                      <Image alt="delete" height={16} width={16} src="/assets/icons/delete.svg" />
                    </span>
                    Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <div className="mt-3">
            <div>
              <div className="customerInfo">
                <ul>
                  <li>
                    <span>Description</span>
                    <p>{nutritionDetail.description}</p>
                  </li>
                  <li>
                    <span>Date Added</span>
                    <p>{formatDate(nutritionDetail.createdAt ?? '')}</p>
                  </li>
                  <li>
                    <span>Last Updated</span>
                    <p>{formatDate(nutritionDetail.updatedAt ?? '')}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="plr24 canvasFooter">
          <Button className="OutlineBtn" onClick={() => props.handleEdit()}>
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(NutritionPreview);
