'use client';
import { Formik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import * as Yup from 'yup';

import { useLoading, useRequest, useSettings } from '@/components/App';
import { REQUEST } from '@/types/interfaces';
import { toastr } from '@/utils/helpers';

const FormikSchema = Yup.object().shape({
  email: Yup.string().email().required('Required'),
});

const Index = () => {
  const router = useRouter();
  const settings = useSettings();
  const { request, loading } = useRequest();
  const { ButtonLoader } = useLoading();

  return (
    <div className={`loginarea whiteBox`}>
      <div className="text-center">
        {settings?.logo ? <Image alt="logo" height={41} width={132} src="/assets/images/logo.png" /> : null}
      </div>
      <div className="text-center">
        <h2>
          Forgot password <span>Please enter your details.</span>
        </h2>
      </div>
      <Formik
        enableReinitialize={true}
        initialValues={{
          email: '',
        }}
        validationSchema={FormikSchema}
        onSubmit={async values => {
          const payload = {
            // email: encodeURIComponent(values.email),
            email: values.email,
          };
          const res = (await request('forgotPassword', payload)) as REQUEST;
          const email = values.email as string;

          if (res) {
            toastr(res?.message as string, 'success', 'Forgot Password');
            router.push(`/varify-otp?email=${email}`);
          }
        }}
      >
        {({ handleSubmit, handleChange, values, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                onChange={handleChange}
                value={values.email}
                isInvalid={!!errors.email}
                type="email"
                placeholder="Enter your email"
              />
              {errors.email ? <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback> : null}
            </Form.Group>
            <Button type="submit" className="loginBtn customBtn mt20 fullBtn fs14">
              {loading?.forgotPassword_LOADING ? ButtonLoader() : 'verify email'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Index;
