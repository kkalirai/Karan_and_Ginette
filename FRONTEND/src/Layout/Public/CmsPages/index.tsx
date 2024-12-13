'use client';
import { usePathname, useRouter } from 'next/navigation';
import React, { memo, useEffect, useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { useRequest } from '@/components/App';
import { handleErrors } from '@/utils/helpers';
import { API_ERROR } from '@/types/interfaces';

interface Pages {
  id: number; // Change type to number
  title: string;
  slug: string;
  status: boolean;
  content: string;
  subTitle: string;
  metaTitle: string;
  metaKeyword: string;
  shortDescription: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

type PROPS = {
  pageDetail: Pages;
};

function Index({ pageDetail }: PROPS) {
  const { request } = useRequest();

  const router = useRouter();
  const asPath = usePathname();
  const [titles, setTitles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | number>('');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData() {
    try {
      const response = (await request('getTitlesList')) as any;
      const fetchedtitles = response.data.result;
      setTitles(fetchedtitles);
      setActiveTab(getActiveKeyFromPath(asPath));
    } catch (error) {
      return handleErrors(error as API_ERROR);
    }
  }

  function getActiveKeyFromPath(pathname: string): string {
    const tabs = pathname.split('/');
    return tabs[tabs.length - 1];
  }

  const handleTabSelect = (eventKey: string | null) => {
    if (eventKey !== null) {
      setActiveTab(eventKey);
      router.push(`/${eventKey}`);
    }
  };

  const handleButtonClick = () => {
    router.back();
  };

  // Conditionally render the button only on the client-side
  useEffect(() => {
    const showButton = () => {
      const button = document.getElementById('understandButton');
      if (button) {
        button.style.display = 'block';
      }
    };
    showButton();
  }, []);
  return (
    <Container>
      <Row>
        <Col>
          <div className="rightPannel">
            <div className="CustomTab" style={{ minHeight: '100px' }}>
              <Tabs activeKey={activeTab} onSelect={handleTabSelect}>
                {titles.map((title, index) => (
                  <Tab key={index} eventKey={title} title={<span style={{ fontSize: '1.4rem' }}>{title}</span>}></Tab>
                ))}
              </Tabs>
            </div>
          </div>
        </Col>
      </Row>
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="border border-3 border-muted rounded p-4 shadow">
              <div className="text-center pb-5 mb-1">
                <div className="fw-bold fs-1 pb-4">{pageDetail?.title}</div>
                <div className="text-center fs-5" dangerouslySetInnerHTML={{ __html: pageDetail?.content }} />
              </div>
              <div className="d-flex justify-content-center pb-5">
                <button
                  id="understandButton"
                  onClick={handleButtonClick}
                  type="button"
                  className="btn btn-warning"
                  style={{ display: 'none' }}
                >
                  I'm Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4"></div>
    </Container>
  );
}

export default memo(Index);
