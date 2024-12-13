'use client';

import { Formik } from 'formik';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import * as Yup from 'yup';

import { useApp, useLoading, useRequest } from '@/components/App';
import { SuspenseLoader } from '@/components/App/Loader';
import { KEYPAIR, REQUEST } from '@/types/interfaces';
import { validateAuthentication } from '@/utils/helpers';
import NImage from '@/components/Default/Image';

const initialValues = {
  email: '',
  password: '',
  rememberme: false,
};

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too Short!').max(100, 'Too Long!').required('Required'),
});

function Index() {
  const router = useRouter();
  const { getGlobalSettings } = useApp();
  const { request, loading } = useRequest();
  const { ButtonLoader } = useLoading();
  const [viewPassword, setviewPassword] = useState(false);

  const validateToken = useCallback(() => {
    if (validateAuthentication()) {
      if (Cookies.get('rememberme') === '1') return router.push('/settings/accounts');
    }
  }, [router]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  const handleSubmit = async (values: KEYPAIR) => {
    const req = (await request('LoginUser', values)) as REQUEST;
    if (req?.data) {
      if (values.rememberme) Cookies.set('rememberme', '1');
      return router.push('/settings/accounts');
    }
  };
  if (validateAuthentication()) {
    if (Cookies.get('rememberme') === '1') return <SuspenseLoader />;
  }

  const bannerImageLoader = () => {
    return getGlobalSettings()?.banner;
  };

  return (
    <>
      <div className="loginpage">
        <div className="loginArea equal-columns">
          <div className="col-12 col-md-6 loginLeft">
            <div className="loginForm">
              <div className="logo">
                {getGlobalSettings()?.logo ? (
                  <NImage width={40} height={41} alt="logo" src={getGlobalSettings()?.logo} />
                ) : null}
              </div>
              <h2>
                Welcome back <span>Please enter your details.</span>
              </h2>
              <Formik
                initialValues={initialValues}
                validateOnChange={false}
                validateOnBlur={false}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({ handleSubmit, handleChange, errors, touched }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Email </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                          />
                          {errors.email && touched.email ? (
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                          ) : null}
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <InputGroup className="mb-3">
                            <Form.Control
                              type={viewPassword ? 'text' : 'password'}
                              name="password"
                              placeholder="Enter password"
                              onChange={handleChange}
                              isInvalid={!!errors.password}
                            />
                            <InputGroup.Text onClick={() => setviewPassword(!viewPassword)} role="button">
                              <i className={`fa fa-eye ${viewPassword ? 'text-success' : ''}`}></i>
                            </InputGroup.Text>
                            {errors.password && touched.password ? (
                              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                            ) : null}
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <div className="d-flex justify-content-between">
                        <div>
                          <Form.Group className="rememberMe">
                            <Form.Check type="checkbox" name="rememberme" label="Remember me" onChange={handleChange} />
                          </Form.Group>
                        </div>
                        <div className="forgot">
                          <Link href="/forgot-password">Forgot password</Link>
                        </div>
                      </div>
                      <Col md={12}>
                        <Button type="submit" className="customBtn">
                          {loading?.LoginUser_LOADING ? ButtonLoader() : 'Sign In'}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          <div className="col-12 col-md-6 loginRight d-none d-sm-none d-md-block">
            <div className="h-full">
              {getGlobalSettings()?.banner ? (
                <Image
                  loader={bannerImageLoader}
                  alt="loginImg"
                  height={480}
                  width={720}
                  quality={100}
                  src={getGlobalSettings()?.banner}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
