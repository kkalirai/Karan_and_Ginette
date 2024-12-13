'use client';
import { Formik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import * as Yup from 'yup';

import { useLoading, useRequest, useSettings } from '@/components/App';
import { REQUEST } from '@/types/interfaces';
import { toastr } from '@/utils/helpers';

const ResetSchema = Yup.object().shape({
  password: Yup.string()
    .required('Required')
    .trim()
    .matches(/\w*[a-z]\w*/, 'Password must have a lower case letter')
    .matches(/\w*[A-Z]\w*/, 'Password must have an uppercase letter')
    .matches(/\d/, 'Password must have a number')
    .matches(/^\S*$/, 'White Spaces are not allowed')
    .min(6, ({ min }) => `Password must be at least ${min} characters`)
    .max(128, ({ max }) => `Password must not be greator than ${max} characters`),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], "Passwords don't match")
    .when('password', {
      is: (password: string) => password && password.length !== 0,
      then: Yup.string().required('Required'),
    }),
});

function Index() {
  const router = useRouter();
  const settings = useSettings();
  const searchParams = useSearchParams();

  const [viewPassword, setviewPassword] = useState(false);
  const [viewConfirmPassword, setviewConfirmPassword] = useState(false);
  const { request, loading } = useRequest();
  const { ButtonLoader } = useLoading();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`loginarea whiteBox`}>
      <div className="loginForm">
        <div className="logo text-center">
          {settings?.logo ? <Image alt="logo" height={41} width={132} src="/assets/images/logo.png" /> : null}
        </div>
        <div className="text-center">
          <h2>
            Create new password <span>Please set your new password</span>
          </h2>
        </div>
        <Formik
          enableReinitialize={true}
          initialValues={{
            password: '',
            confirmPassword: '',
          }}
          validationSchema={ResetSchema}
          onSubmit={async values => {
            const req = (await request('resetPassword', {
              password: values.password,
              confirmPassword: values.password,
              token,
            })) as REQUEST;
            if (req) {
              toastr('Password successfully set', 'success');
              router.push('/login');
            }
          }}
        >
          {({ handleSubmit, handleChange, values, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <InputGroup className="mb-3">
                      <Form.Control
                        type={viewPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={values.password}
                        isInvalid={!!errors.password}
                      />
                      <InputGroup.Text onClick={() => setviewPassword(!viewPassword)} role="button">
                        <i className={`fa fa-eye ${viewPassword ? 'text-success' : ''}`}></i>
                      </InputGroup.Text>
                      <Form.Text>
                        The password should contain at least 6 characters and include at least one uppercase letter, one
                        lowercase letter, and one number
                      </Form.Text>
                      {errors.password ? (
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      ) : null}
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <InputGroup className="mb-3">
                      <Form.Control
                        type={viewConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        onChange={handleChange}
                        value={values.confirmPassword}
                        isInvalid={!!errors.confirmPassword}
                      />

                      <InputGroup.Text onClick={() => setviewConfirmPassword(!viewConfirmPassword)} role="button">
                        <i className={`fa fa-eye ${viewConfirmPassword ? 'text-success' : ''}`}></i>
                      </InputGroup.Text>

                      {errors.confirmPassword ? (
                        <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                      ) : null}
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={12}>
                  <Button type="submit" className="loginBtn customBtn mt20 fullBtn fs14">
                    {loading?.resetPassword_LOADING ? ButtonLoader() : 'Update password'}
                  </Button>
                </Col>
                <Col>
                  <div className="createAccount text-center" style={{ padding: '20px' }}>
                    Cancel and Return to{' '}
                    <Link href="/login" className="fogotPass text-primary">
                      Login
                    </Link>
                  </div>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Index;
