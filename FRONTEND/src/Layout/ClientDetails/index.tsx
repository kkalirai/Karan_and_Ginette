'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { memo } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ClientTabHeader from './Components/ClientTabHeader';

type PROPS = {
  children: React.ReactNode;
};

function Index(props: PROPS) {
  const router = useRouter();
  const asPath = usePathname();

  function getActiveKeyFromPath(pathname: string): string {
    const tabs = pathname.split('/');
    return tabs[tabs.length - 1];
  }

  const activeTab = getActiveKeyFromPath(asPath);

  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');
  const clientFirstName = searchParams.get('clientFirstName');
  const clientLastName = searchParams.get('clientLastName');

  return (
    <Container>
      <Row>
        <Col>
          <ClientTabHeader
            clientFirstName={clientFirstName as string}
            clientLastName={clientLastName as string}
            clientId={clientId as string}
          />
          <div className="rightPannel">
            <div className="CustomTab">
              <Tabs
                activeKey={activeTab === 'clientDetails' ? 'weighttab' : activeTab}
                onSelect={e => router.push(`/clientDetails/${e}?clientId=${clientId}`)}
              >
                <Tab eventKey="weighttab" title="Weights">
                  {props?.children}
                </Tab>
                <Tab eventKey="workouttab" title="Completed Workouts">
                  {props?.children}
                </Tab>
                <Tab eventKey="nutritiontab" title="Nutritions">
                  {props?.children}
                </Tab>
              </Tabs>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default memo(Index);
