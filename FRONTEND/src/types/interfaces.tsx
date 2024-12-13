export interface IETarget {
  event: MouseEvent;
}

export interface KEYPAIR {
  [key: string]: unknown;
}

export interface DATATABLE_COLUMN {
  dataField: string;
  text: string;
  hidden?: boolean;
  value?: string;
  search?: boolean;
}
export interface DATATABLE_ROWS {
  [field: string]: JSX.Element | JSX.Element[] | string | number | boolean;
}

export interface ACTION {
  payload?: KEYPAIR | KEYPAIR[];
}
export interface REQUEST {
  columnViews: unknown;
  data?: unknown;
  message?: string;
  error?: unknown;
}

export interface PAYLOAD {
  data?: unknown;
}
export type RESPONSE = {
  success: boolean;
  data?: unknown;
  error?: unknown;
};
export interface HANDLE_ERRORS {
  [key: string]: string[];
}
export interface REGISTER {
  (action: ACTION): unknown;
}

export interface API_ERROR {
  error: HANDLE_ERRORS;
  message: string;
  statusCode?: number;
}

export interface SETTINGS_PAYLOAD {
  primaryColor: string;
  logo: string;
  banner: string;
  font: string;
}

export interface VEHICLE {
  add: any;
  isDelete: boolean;
  id: string;
  reminderDate: string;
  licensePlateNumber: string;
  duration: string;
  expiryDate: string;
  customerId: string;
  status: string;
  vehicles: VEHICLE[];
}

export interface CUSTOMER {
  name?: any;
  lastname: any;
  id: string;
  firstname: string;
  fullname: string;
  status: string | boolean;
  phone: string;
  email: string;
  Vehicles: VEHICLE[];
  action: JSX.Element;
  createdAt: string;
  updatedAt: string;
}
