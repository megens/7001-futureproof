import { createStore } from "redux";
//  import produce from "immer";

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN-SUCCESS": {
      return {
        ...state,
        loggedIn: true,
        username: action.payload.username
      };
    }

    case "LOAD-COURSES": {
      return {
        ...state,
        courseList: action.payload.courseList
      };
    }

    case "SET-PURCHASE-ITEM": {
      return {
        ...state,
        purchaseItem: action.payload.purchaseItem
      };
    }

    default: {
      return state;
    }
  }
}

const store = createStore(
  reducer,
  {
    loggedIn: false,
    username: undefined,
    courseList: [],
    purchaseItem: {}
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
