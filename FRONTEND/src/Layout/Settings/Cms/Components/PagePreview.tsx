import Image from 'next/image';
import React, { memo } from 'react';
import { Button, Dropdown } from 'react-bootstrap';

import { formatDate } from '@/utils/helpers';

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
}

interface PROPS {
  pageDetail: CMS;
  handleEdit: () => void;
  onDelete: () => void;
}

function PagePreview(props: PROPS) {
  const { pageDetail } = props;
  console.log('status : ', status);
  return (
    <div className="canvasData">
      <div className="inner">
        <div className="topSection">
          <div className="head d-flex justify-content-between align-items-center p24 offcanvas-header">
            <div>
              <h2>{pageDetail.title}</h2>
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
                    </span>{' '}
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
                    <span className="fw-bold">Title</span>
                    <p>{pageDetail.title}</p>
                  </li>
                  <li>
                    <span className="fw-bold">Slug</span>
                    <p>{pageDetail.slug}</p>
                  </li>
                  <li>
                    <span className="fw-bold">Sub Title</span>
                    <p>{pageDetail.subTitle}</p>
                  </li>
                  <li>
                    <span className="fw-bold">Meta Title</span>
                    <p>{pageDetail.metaTitle}</p>
                  </li>
                  <li>
                    <span className="fw-bold">Meta Keyword</span>
                    <p>{pageDetail.metaKeyword}</p>
                  </li>
                  <li>
                    <span className="fw-bold">Short Description</span>
                    <p>{pageDetail.shortDescription}</p>
                  </li>
                  <li>
                    <span className="fw-bold">Meta Description</span>
                    <p>{pageDetail.metaDescription}</p>
                  </li>
                  <li>
                    <span className="fw-bold">Content</span>

                    <div dangerouslySetInnerHTML={{ __html: pageDetail?.content }} />
                  </li>
                  <li>
                    <span className="fw-bold">Date Added</span>
                    <p>{formatDate(pageDetail.createdAt ?? '')}</p>
                  </li>
                  <li>
                    <span className="fw-bold">Last Updated</span>
                    <p>{formatDate(pageDetail.updatedAt ?? '')}</p>
                  </li>
                </ul>
              </div>
              <div className="p-4"></div>
            </div>
          </div>
        </div>
        <div className="plr24 canvasFooter">
          <Button className="OutlineBtn" onClick={() => props.handleEdit()}>
            Edit
          </Button>{' '}
        </div>
      </div>
    </div>
  );
}

export default memo(PagePreview);
