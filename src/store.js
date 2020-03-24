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
        subscriptions: action.payload.subscriptions,
        subscribedCourses: action.payload.subscribedCourses,
        subscriptionSettings: action.payload.subscriptionSettings,
        subscribedAllResponses: action.payload.subscribedAllResponses
      };
    }

    case "LOGOUT": {
      return {
        ...state,
        loggedIn: false,
        username: undefined,
        cart: [],
        studentHistory: {},
        subscriptions: [],
        subscriptionSettings: [],
        subscribedCourses: []
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

    case "NEW-PURCHASE": {
      let newCourseCode = action.payload.selectedProduct.courseCode;
      let newSubscriptions = JSON.parse(
        JSON.stringify(action.payload.subscriptions)
      );
      newSubscriptions[newCourseCode] = action.payload.selectedProduct;

      let newSubscriptionSettings = JSON.parse(
        JSON.stringify(action.payload.subscriptionSettings)
      );
      newSubscriptionSettings[newCourseCode] = {};

      let newStudentHistory = JSON.parse(
        JSON.stringify(action.payload.studentHistory)
      ); // deep copy
      newStudentHistory[newCourseCode] = []; // add new empty array for the new course

      let newSubscribedCourses = JSON.parse(
        JSON.stringify(action.payload.subscribedCourses)
      );
      newSubscribedCourses[newCourseCode] = [];

      return {
        ...state,
        subscriptions: newSubscriptions,
        studentHistory: newStudentHistory,
        subscribedCourses: newSubscribedCourses
      };
    }

    case "SET-CURRENT-QUESTION-AND-LIVESTUDENTHISTORY": {
      // adding a new question to history via renderQuestion on RoutesAndPaths.jsx
      console.log("SET-CURRENT-QUESTION-AND-LIVESTUDENTHISTORY");
      console.log("payload");
      console.log(action.payload.currentQuestion);
      console.log(action.payload.liveStudentHistory);
      return {
        ...state,
        currentQuestion: action.payload.currentQuestion,
        liveStudentHistory: action.payload.liveStudentHistory
        //liveStudentUnRead: action.payload.liveStudentUnRead
      };
    }

    case "UPDATE-UNREAD-Q": {
      return {
        ...state,
        liveStudentUnRead: action.payload.liveStudentUnRead
      };
    }

    case "ANSWER-SUBMITTED": {
      // adding a new question to history via renderQuestion on RoutesAndPaths.jsx
      console.log("inside ANSWER-SUBMITTED");
      console.log("payload");
      console.log(action.payload.currentQuestion);
      console.log(action.payload.liveStudentHistory);
      console.log(action.payload.studentHistory);
      console.log(action.payload.subscribedAllResponses);
      console.log(action.payload.liveAllResponses);
      return {
        ...state,
        currentQuestion: action.payload.currentQuestion,
        liveStudentHistory: action.payload.liveStudentHistory,
        studentHistory: action.payload.studentHistory,
        subscribedAllResponses: action.payload.subscribedAllResponses,
        liveAllResponses: action.payload.liveAllResponses
      };
    }

    case "SET-CURRENT-QUESTION": {
      // adding a new question to history via renderQuestion on RoutesAndPaths.jsx
      console.log("SET-CURRENT-QUESTION");
      return {
        ...state,
        currentQuestion: action.payload.currentQuestion,
        elapsedTime: action.payload.currentQuestion.elapsedTime
      };
    }

    case "UPDATE-STUDENT-HISTORY": {
      //
    }

    case "REMOVE-Q": {
      console.log("in REMOVE-Q");
      return {
        ...state,
        liveStudentHistory: action.payload.liveStudentHistory,
        studentHistory: action.payload.studentHistory,
        currentQuestion: action.payload.currentQuestion
      };
    }

    case "SET-TIMER-ON": {
      return {
        ...state,
        timerOn: action.payload.timerOn
      };
    }

    case "SET-ANSWER-TIME": {
      return {
        ...state,
        elapsedTime: action.payload
      };
    }

    case "LOAD-LIVE-COURSE": {
      console.log("LOAD-LIVE-COURSE");
      return {
        ...state,
        liveCourseQuestions: action.payload.liveCourseQuestions,
        liveStudentHistory: action.payload.liveStudentHistory,
        currentQuestion: action.payload.liveCourseQuestions.slice(-1)[0]
        //liveStudentUnRead: action.payload.liveStudentUnRead
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
    courseList: [], // all courses available on server
    username: undefined,
    cart: [],
    studentHistory: {}, // object of arrays (of questions seen)
    subscriptions: {}, // array of objects (of courses)
    subscriptionSettings: {}, // object of objects (of settings for each course)
    subscribedCourses: {}, // array of course objects
    purchaseItem: {}, // course object
    currentCourseRun: {}, // current course object
    liveCourseQuestions: [{ qNum: 0 }, { qNum: 1 }], // array of questions (one array from subscribedCourses)
    liveStudentHistory: [], // array of studentHistory (one array from studentHistory)
    liveStudentUnRead: [], // at courseRun, populate the difference from liveCourseQuestions and liveStudentHistory
    elapsedTime: 0, // seconds spent on question
    timerOn: true, // global state so different components can influence
    currentQuestion: {
      // THIS SHOULD BE PART OF VEC?
      qNum: 0,
      complete: undefined, // could be true, false, undefined (=== skipped)
      isCorrect: undefined, // true , false, undefined
      elapsedTime: 0 // seconds
    },
    currentQuestionUpdate: {},
    subscribedAllResponses: {},
    liveAllResponses: []
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
