import axios from 'axios';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import moment from 'moment-timezone';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

import { ACTION, API_ERROR, KEYPAIR } from '@/types/interfaces';
import { api } from '@/utils/axiosInterceptor';

export interface ApiFunction {
  (action: ACTION): Promise<unknown>;
}
export function GenerateAPI(apiFunctions: Record<string, ApiFunction>, ModuleName: string) {
  function generate(method: string, functionName: string, lastPathname: string, headers?: KEYPAIR) {
    apiFunctions[functionName + ModuleName] = async function (action: any): Promise<unknown> {
      const { payload, meta } = action;
      let url = `/api/${ModuleName.toLowerCase()}/`;
      if (meta && meta.pathname) {
        url = url + meta.pathname;
      } else {
        url = url + lastPathname;
      }

      return handleApiRequest(url, method, payload, headers);
    };
  }
  return { generate };
}

export const handleApiRequest = async (
  url: string,
  method: string,
  payload: any,
  headers?: KEYPAIR,
): Promise<unknown> => {
  try {
    let requestOptions: any = { data: payload };
    if (payload?.formData) {
      requestOptions['data'] = payload?.formData;
    }
    if (payload?.headers) {
      requestOptions['headers'] = payload?.headers;
    }
    if (headers) {
      requestOptions = headers;
    }
    const res: ReturnType<any> = await api(url, method, requestOptions);
    return res;
  } catch (error) {
    return handleErrors(error as API_ERROR);
  }
};

export const getProxyImage = (url: string) => {
  if (!url) return '/assets/images/noimage.png';
  return `/spimages/${url}`;
};

export const setAuthToken = (token: string | boolean) => {
  if (typeof token == 'string') {
    // Cookies.set('token', token);
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const setHeader = (token: string | boolean, tokenName: string) => {
  if (typeof token == 'string') {
    Cookies.set(tokenName, token);
    // axios.defaults.headers.common[tokenName] = token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export const toastr = (message: string, icon: string, title?: string) => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    showCloseButton: true,
    timerProgressBar: true,
    focusCancel: true,
    didOpen: toast => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  Toast.fire({
    iconHtml: '',
    title: '',
    html: `
    <div>
        <img src="/assets/icons/${icon === 'success' ? 'GreenCheck' : 'Error'}.svg" />
        ${title ? `<h4 class="${icon}">${title}</h4>` : ''}
        <p>${message}</p>        
    </div>`,
    // ${statusCode ? `<p class='mt-1'>Error: ${statusCode}</p>`:''}
    customClass: 'fireToaster',
    showClass: {
      backdrop: 'swal2-noanimation', // disable backdrop animation
      popup: '', // disable popup animation
      icon: '', // disable icon animation
    },
    hideClass: {
      popup: '', // disable popup fade-out animation
    },
    timer: 3000,
    timerProgressBar: true,
    heightAuto: true,
    width: '356px',
    grow: 'row',
  });
};
export const confirmDialog = (title: string, head?: string) => {
  return new Promise(resolve => {
    Swal.fire({
      title: '',
      text: '',
      html: `
      <div class="ConfirmUser"> 
            <div class="featured-icon">
            <img src="/assets/icons/IconSave.svg" />    
            </div>       
            <div class="confirmDialogBody">
            <h4>${head || ''}</h4>
            <p>${title}</p>
            </div>
        </div>`,
      // showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      customClass: {
        actions: 'swal-sq-actions',
        confirmButton: 'swal-sq-confirmButtonDialog',
        denyButton: 'swal-sq-denyButton',
        cancelButton: 'swal-sq-cancelButton',
      },
      // denyButtonText: `Don't save`,
    })
      .then(result => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          resolve(true);
          // Swal.fire('Saved!', '', 'success');
        } else if (result.isDenied) {
          resolve(false);
          // Swal.fire('Changes are not saved', '', 'info');
        } else {
          resolve(false);
        }
      })
      .catch(() => resolve(false));
  });
};

export const deleteDialog = (title: string, head?: string) => {
  return new Promise(resolve => {
    Swal.fire({
      title: '',
      text: '',
      html: `
      <div class="ConfirmUser"> 
            <div class="featured-icon">
            <img src="/assets/icons/IconDelete.svg" />    
            </div>       
            <div class="confirmDialogBody">
            <h4>${head || 'Delete'}</h4>
            <p>${title}</p>
            </div>
        </div>`,
      showCancelButton: true,
      confirmButtonText: 'DELETE',
      showCloseButton: true,
      customClass: {
        actions: 'swal-sq-actions',
        confirmButton: 'swal-sq-confirmButton',
        denyButton: 'swal-sq-denyButton',
        cancelButton: 'swal-sq-cancelButton',
      },
      // denyButtonText: `Don't save`,
    })
      .then(result => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          resolve(true);
          // Swal.fire('Saved!', '', 'success');
        } else if (result.isDenied) {
          resolve(false);
          // Swal.fire('Changes are not saved', '', 'info');
        } else {
          resolve(false);
        }
      })
      .catch(() => resolve(false));
  });
};

export const confirmSweetRequest = (title: string) => {
  return new Promise(resolve => {
    Swal.fire({
      title: title,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#3299cc',
      showLoaderOnConfirm: true,
      preConfirm: response => {
        return resolve(response);
      },
      allowOutsideClick: () => !Swal.isLoading(),
    })
      .then(result => {
        if (result.isConfirmed) {
          resolve(true);
          // Swal.fire('Saved!', '', 'success');
        } else if (result.isDenied) {
          resolve(false);
          // Swal.fire('Changes are not saved', '', 'info');
        } else {
          resolve(false);
        }
      })
      .catch(() => resolve(false));
  });
};

export const showSweetProcessing = () => {
  return new Promise(resolve => {
    Swal.fire({
      title: 'Processing...',
      html: '',
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(Swal.getDenyButton() as HTMLButtonElement);
      },
    });
    resolve(Swal);
  });
};

export const UploadFileSchema = () => {
  const FILE_SIZE = 1000;
  const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
  return Yup.mixed()
    .test('fileSize', 'File Size is too large', value => value.size <= FILE_SIZE)
    .test('fileType', 'Unsupported File Format', value => SUPPORTED_FORMATS.includes(value.type));
};
export const capitalize = (title: string) => (title ? title.charAt(0).toUpperCase() + title.slice(1) : '');

export const trimAndLower = (data: string) => data.toLowerCase().trim();
export const handleErrors = (res: API_ERROR) => {
  let msg = '';
  console.log(res);
  const { statusCode, message, error } = res;
  console.log(statusCode, msg, error);
  if (error) {
    if (typeof error == 'object' && Object.keys(error)?.length) {
      Object.entries(error).map(([, value]) => {
        msg += capitalize(value?.toString() || '') + '\n';
      });
    } else {
      if (typeof message === 'string') {
        msg = message;
      } else if (typeof error == 'string') {
        msg = error;
      }
    }

    if (typeof msg === 'string' && msg?.toLowerCase() == 'unauthorized') {
      logout();
    }
  } else {
    if (typeof message === 'string') {
      msg = message;
      if (typeof msg === 'string' && msg?.toLowerCase() == 'unauthorized') {
        logout();
      }
    } else if (typeof error == 'string') {
      msg = error;
    }
  }
  toastr(msg, 'error', 'Error Occurred');
};
export const getTimeSlots = () => {
  // Define start and end times
  const startTime = moment('00:00 AM', 'hh:mm A');
  const endTime = moment('11:30 PM', 'hh:mm A');

  // Generate time slots with 30-minute breaks
  const timeSlots = [];

  let currentTime = moment(startTime);
  while (currentTime <= endTime) {
    const formattedTime = currentTime.format('hh:mm A');
    timeSlots.push({ currentTime: new Date(currentTime.toISOString()), formattedTime });
    currentTime = currentTime.add(30, 'minutes'); // Add 30 minutes
  }
  return timeSlots;
};
export const formatDate = (date: string | Date, type?: string | null | undefined, iso?: boolean) => {
  if (!date) date = new Date();
  if (iso) return moment(date).tz('Australia/Sydney').toISOString(); // Convert date to ISO format
  const formattedDate = moment(date)
    .tz('Australia/Sydney')
    .format(type || 'DD/MM/YYYY hh:mm:ss A'); // Set timezone offset to +10:00 (Australia/Sydney) and format date

  return formattedDate;
};

export const isValidDate = (value: string) => {
  if (/[^0-9/]/.test(value)) {
    return false;
  }
  if (!/([^/]*\/){2}/.test(value)) return false;

  if (moment(value, 'DD-MM-YYYY').isValid()) return 'DD-MM-YYYY';
  if (moment(value, 'M/D/YY').isValid()) return 'M/D/YY';
  if (moment(value, 'YYYY/MM/DD').isValid()) return 'YYYY/MM/DD';
  if (moment(value, 'MM/DD/YYYY').isValid()) return 'MM/DD/YYYY';
  return false;
};

export const getPDFFromBuffer = (bufferArray: number[], filename?: string) => {
  try {
    const blob = new Blob([new Uint8Array(bufferArray).buffer], { type: 'application/pdf' });
    // const win = window.open('', '_blank');
    // const URL = window.URL || window.webkitURL;
    // const dataUrl = URL.createObjectURL(blob);
    // if (win) win.location = dataUrl;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    if (link.download !== undefined) {
      link.setAttribute('href', url);
      link.setAttribute('target', '_blank');
      link.setAttribute('title', filename || 'Order Confirmation PDF');
      // link.setAttribute('download', filename || 'Order Confirmation PDF');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.log('Blob Error', error);
  }
};
export const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  // eslint-disable-next-line no-useless-escape
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const logout = async () => {
  setAuthToken(false);
  Cookies.remove('accessToken');
  Cookies.remove('rememberme');
};

export const validateAuthentication = () => {
  const jwtDecodedToken = Cookies.get('accessToken') as undefined | string;
  if (jwtDecodedToken) {
    // Non Null Assertion ! will remove undefined and null from a type without doing any explicit type checking
    const decoded: any = jwt_decode(jwtDecodedToken as string);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      logout();
      return false;
    }
    return true;
  } else {
    return false;
  }
};

export const validateRole = (role: string) => {
  if (!role) return true;
  const { decoded, isValid } = getDecodedToken('');
  if (isValid && role === decoded.role) return true;
  return false;
};

export const getDecodedToken = (token: string) => {
  const jwtDecodedToken = (Cookies.get('accessToken') as undefined | string) || token;

  if (jwtDecodedToken) {
    // Non Null Assertion ! will remove undefined and null from a type without doing any explicit type checking
    const decoded: any = jwt_decode(jwtDecodedToken as string);
    return { decoded, isValid: true };
  } else {
    return { isValid: false };
  }
};
export const convertToCamelCase = (inputString: string) =>
  inputString.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

export const getStatus = (status: string) => {
  status = status.toUpperCase();
  switch (status) {
    case 'SUCCESS':
      return 'textGreen';
    case 'FAILED':
      return 'text-danger';
    case 'SUCCESS WITH ERRORS':
      return 'text-warning';
    default:
      return 'textBlck';
  }
};

export const formatLogStatus = (status: string) => {
  status = status?.toUpperCase();
  switch (status) {
    case 'SUCCESS':
      return 'Success';
    case 'FAILED':
      return 'Failed';
    case 'SUCCESS WITH ERRORS':
      return 'Success with Errors';
    default:
      return status;
  }
};
