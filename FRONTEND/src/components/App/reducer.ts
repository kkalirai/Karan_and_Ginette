import { useReducer } from 'react';

interface InitalState {
  loading?: {
    [key: string]: boolean;
  };
  error?: unknown;
  cancelled?: unknown;
  data?: unknown;
}
const initialState: InitalState = {
  loading: {},
};
interface Action {
  type: string;
  data: InitalState;
}
function reducer(state = initialState, action: Action) {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, ...action.data };
    default:
      return state;
  }
}

export { reducer, initialState };

interface InitialValue {
  [key: string]: any;
}

export function commonReducer(state = {} as InitialValue, action: InitialValue) {
  return { ...state, ...action };
}
export const useCommonReducer = (initialValue?: InitialValue) => {
  const [state, dispatch] = useReducer(commonReducer, initialValue || {});
  return { state, dispatch };
};
