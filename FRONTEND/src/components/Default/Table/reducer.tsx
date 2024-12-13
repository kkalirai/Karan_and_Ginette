interface data {
  [field: string]: JSX.Element | JSX.Element[] | string | number | boolean;
}
interface InitalState {
  totalSize?: number | string;
  currentPage: number;
  startPage?: number;
  endPage?: number;
  pages: number;
  limit: number;
  result: data[];
  searchKeyword?: string;
  sortBy: string;
  searchRegex?: {
    $regex: string;
    $options: string;
  };
}
const initialState: InitalState = {
  currentPage: 1,
  startPage: 1,
  endPage: 1,
  pages: 1,
  limit: 25,
  result: [],
  searchKeyword: '',
  sortBy: '',
  searchRegex: {
    $regex: '',
    $options: '',
  },
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
