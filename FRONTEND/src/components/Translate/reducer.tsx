import Cookies from 'js-cookie';

interface InitalState {
  lang: string;
}
const initialState: InitalState = {
  lang: Cookies.get('lang') || 'en',
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
