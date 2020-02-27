import { createStore } from "redux";
//  import produce from "immer";

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN-SUCCESS": {
      return {
        ...state,
        loggedIn: true,
        username: action.payload.username,
        cart: action.payload.cart,
        studentHistory: action.payload.studentHistory,
        courseHistory: action.payload.courseHistory
      };
    }

    case "LOGOUT": {
      return {
        ...state,
        loggedIn: false,
        username: undefined,
        cart: [],
        studentHistory: {},
        courseHistory: [],
        purchaseItem: {}
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

    case "UPDATE-COURSE-HISTORY": {
      return {
        ...state,
        courseHistory: action.payload
      };
    }

    case "UPDATE-STUDENT-HISTORY": {
      console.log("studentHistory");
      console.log(action.payload.studentHistory);
      console.log(action.payload.newHistoryItem);
      let studentHistoryCopy = action.payload.studentHistory.slice();
      studentHistoryCopy.push(action.payload.newHistoryItem);
      return {
        ...state,
        studentHistory: studentHistoryCopy
      };
    }

    case "SET-ANSWER-TIME": {
      return {
        ...state,
        elapsedTime: action.payload
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
    courseList: [],
    username: undefined,
    cart: [],
    purchaseItem: {},
    studentHistory: [],
    courseHistory: [],
    purchaseItem: {},
    currentCourseRun: [],
    nextQuestion: 0,
    elapsedTime: 0,
    test: 1
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
