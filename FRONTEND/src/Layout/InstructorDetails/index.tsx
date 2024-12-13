'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { memo } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import InstructorTabHeader from './Components/InstructorTabHeader';

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
  const instructorId = searchParams.get('instructorId');
  const instructorFirstName = searchParams.get('instructorFirstName');
  const instructorLastName = searchParams.get('instructorLastName');

  return (
    <Container>
      <Row>
        <Col>
          <InstructorTabHeader
            instructorFirstName={instructorFirstName as string}
            instructorLastName={instructorLastName as string}
            instructorId={instructorId as string}
          />
          <div className="rightPannel">
            <div className="CustomTab">
              <Tabs
                activeKey={activeTab === 'instructorDetails' ? 'clienttabi' : activeTab}
                onSelect={e => router.push(`/instructorDetails/${e}?instructorId=${instructorId}`)}
              >
                <Tab eventKey="clienttabi" title="Clients">
                  {props?.children}
                </Tab>
                <Tab eventKey="nutritiontabi" title="Nutritions">
                  {props?.children}
                </Tab>
                <Tab eventKey="workouttabi" title="Workouts">
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
