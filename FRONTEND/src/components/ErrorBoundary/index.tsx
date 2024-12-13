'use client';
import React from 'react';

// import { logout } from '@/utils/helpers';

type PROPS = {
  children: React.ReactNode | JSX.Element | JSX.Element[];
};

type STATES = {
  hasError: boolean;
  errorInfo?: unknown;
  error?: {
    message: string;
    stack: string;
  };
};

export class ErrorBoundary extends React.Component<PROPS, STATES> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    // logout();
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    this.setState(prev => ({
      ...prev,
      error,
      errorInfo,
    }));
    console.log('Error Occured', { error: error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="container">
          <h1 className="text-center">Something went wrong </h1>
          <code className="text-center">Message - {JSON.stringify(this.state?.error?.message, null, 5) as any}</code>
          <br />
          <br />
          <br />
          <code className="text-center">Stack - {JSON.stringify(this.state?.error?.stack, null, 5) as any}</code>
        </div>
      );
    }

    return this.props.children;
  }
}
