'use client';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { handleErrors, toastr } from '@/utils/helpers';
import { API_ERROR } from '@/types/interfaces';
import { useRequest } from '@/components/App';

import OTPInput from './OTPInput';

const VerifyUser = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const { request } = useRequest();
  const handleSubmit = async (pin: string) => {
    try {
      const payload = {
        otp: pin,
        email: email,
      };

      const res = (await request('verifyOTP', payload)) as any;
      const accessToken = res?.data?.token;

      if (res) {
        toastr(res?.message as string, 'success', 'OTP Verification');
        router.push(`/reset-password?token=${accessToken}`);
      }
    } catch (error) {
      return handleErrors(error as API_ERROR);
    }
  };

  return (
    <div className="loginarea whiteBox">
      <div className="text-center">
        <h2>Verify OTP</h2>
      </div>
      <div className="text-center">
        <p>An OTP has been sent to your email address, kindly enter them here</p>
      </div>
      <OTPInput length={6} onComplete={handleSubmit} />
    </div>
  );
};

export default VerifyUser;
