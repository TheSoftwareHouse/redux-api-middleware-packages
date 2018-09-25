import { SET_TOKEN, CLEAR_TOKEN } from './const';

const initialState = {
  auth: {
    token: null,
  },
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        auth: {
          token: action.payload.token,
        },
      };
    case CLEAR_TOKEN:
      return {
        ...state,
        auth: {
          token: initialState.auth.token,
        },
      };
    default:
      return state;
  }
}
