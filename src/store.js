import { createStore } from "redux";
//  import produce from "immer";

function reducer(state, action) {
  switch (action.type) {
    case "LOGIN-SUCCESS": {
      console.log("in dispatch LOGIN-SUCCESS");
      return {
        ...state,
        loggedIn: true,
        username: action.payload.username,
        cart: action.payload.cart,
        studentHistory: action.payload.studentHistory,
        subscriptions: action.payload.subscriptions,
        subscribedCourses: action.payload.subscribedCourses,
        subscriptionSettings: action.payload.subscriptionSettings,
        subscribedAllResponses: action.payload.subscribedAllResponses,
      };
    }

    case "LOGOUT": {
      console.log("in dispatch LOGOUT");
      return {
        ...state,
        loggedIn: false,
        username: undefined,
        cart: [],
        studentHistory: {},
        subscriptions: [],
        subscriptionSettings: [],
        subscribedCourses: [],
      };
    }

    case "LOAD-COURSES": {
      console.log("in dispatch LOAD-COURSES");
      return {
        ...state,
        courseList: action.payload.courseList,
      };
    }

    case "SET-PURCHASE-ITEM": {
      console.log("in dispatch SET-PURCHASE-ITEM");
      return {
        ...state,
        purchaseItem: action.payload.purchaseItem,
      };
    }

    case "NEW-PURCHASE": {
      console.log("in dispatch NEW-PURCHASE");
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
        subscribedCourses: newSubscribedCourses,
      };
    }

    case "UPDATE-LIVECOURSE-CRITERION": {
      console.log("in UPDATE-LIVECOURSE-CRITERION");
      return {
        ...state,
        liveCourseSettings: {
          ...state.liveCourseSettings,
          [action.payload.criterion]: action.payload.checked,
        },
      };
    }

    case "UPDATE-COURSE-SETTINGS": {
      console.log("in UPDATE-COURSE-SETTINGS");
      return {
        ...state,
        liveCourseSettings: action.payload.liveCourseSettings,
        subscriptionSettings: action.payload.subscriptionSettings,
      };
    }

    case "UPDATE-LIVE-COURSE-SETTINGS": {
      console.log("in UPDATE-LIVE-COURSE-SETTINGS");
      return {
        ...state,
        liveCourseSettings: action.payload.liveCourseSettings,
      };
    }

    // TO DO: is this one necessary?
    case "UPDATE-SUBSCRIPTIONSETTINGS": {
      console.log("in UPDATE-SUBSCRIPTIONSETTINGS");
      return {
        ...state,
        subscriptionSettings: action.payload.subscriptionSettings,
      };
    }

    case "UPDATE-UNREADQS": {
      console.log("in dispatch UPDATE-UNREADQS");
      return {
        ...state,
        liveStudentUnRead: action.payload.liveStudentUnRead,
        filteredUnReadQs: action.payload.filteredUnReadQs,
      };
    }

    case "UPDATE-CRITERIA-SET": {
      console.log("in dispatch UPDATE-UNREADQS");
      return {
        ...state,
        criteriaSet: action.payload.criteriaSet,
      };
    }

    case "UPDATE-NEWQNUM": {
      console.log("in UPDATE-NEWQNUM ");
      return {
        ...state,
        newQNum: action.payload.newQNum,
      };
    }

    case "SET-CURRENT-QUESTION-AND-LIVESTUDENTHISTORY": {
      // adding a new question to history via renderQuestion on RoutesAndPaths.jsx
      console.log("in dispatch SET-CURRENT-QUESTION-AND-LIVESTUDENTHISTORY");
      console.log("payload");
      console.log(action.payload.currentQuestion);
      console.log(action.payload.liveStudentHistory);
      console.log(action.payload.liveStudentUnRead);
      console.log(action.payload.newQNum);
      return {
        ...state,
        currentQuestion: action.payload.currentQuestion,
        liveStudentHistory: action.payload.liveStudentHistory,
        liveStudentUnRead: action.payload.liveStudentUnRead,
        filteredUnReadQs: action.payload.filteredUnReadQs,
        newQNum: action.payload.newQNum,
      };
    }

    case "ANSWER-SUBMITTED": {
      // adding a new question to history via renderQuestion on RoutesAndPaths.jsx
      console.log("in dispatch ANSWER-SUBMITTED");
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
        liveAllResponses: action.payload.liveAllResponses,
      };
    }

    case "SET-CURRENT-QUESTION": {
      // adding a new question to history via renderQuestion on RoutesAndPaths.jsx
      console.log("in dispatch SET-CURRENT-QUESTION");
      return {
        ...state,
        currentQuestion: action.payload.currentQuestion,
        elapsedTime: action.payload.currentQuestion.elapsedTime,
      };
    }

    case "REMOVE-Q": {
      console.log("in dispatch REMOVE-Q");
      return {
        ...state,
        liveStudentHistory: action.payload.liveStudentHistory,
        studentHistory: action.payload.studentHistory,
        currentQuestion: action.payload.currentQuestion,
        newQNum: action.payload.newQNum,
      };
    }

    case "SET-TIMER-ON": {
      console.log("in dispatch SET-TIMER-ON");
      return {
        ...state,
        timerOn: action.payload.timerOn,
      };
    }

    case "SET-ANSWER-TIME": {
      console.log("in dispatch SET-ANSWER-TIME");
      return {
        ...state,
        elapsedTime: action.payload,
      };
    }

    case "LOAD-LIVE-COURSE": {
      console.log("in dispatch LOAD-LIVE-COURSE");
      return {
        ...state,
        liveCourse: action.payload.liveCourse,
        liveStudentHistory: action.payload.liveStudentHistory,
        liveAllResponses: action.payload.liveAllResponses,
        subscriptionSettings: action.payload.subscriptionSettings,
        liveCourseSettings: action.payload.liveCourseSettings,
        criteriaSet: action.payload.criteriaSet,
        currentQuestion: action.payload.currentQuestion,
        //currentQuestion: action.payload.liveCourseQuestions.slice(-1)[0]
        newQNum: action.payload.newQNum,
        liveStudentUnRead: action.payload.liveStudentUnRead,
        filteredUnReadQs: action.payload.filteredUnReadQs,
      };
    }

    case "UPDATE-STUDENT-HISTORY": {
      console.log("in UPDATE-STUDENT-HISTORY");
      return {
        ...state,
        liveStudentHistory: action.payload.liveStudentHistory,
        studentHistory: action.payload.studentHistory,
        currentQuestion: action.payload.currentQuestion,
      };
    }

    case "SET-NEWQ": {
      console.log("in dispatch SET-NEWQ");
      return {
        ...state,
        newQNum: action.payload.newQNum,
      };
    }

    case "BULK-ADD-HISTORY": {
      console.log("in dispatch BULK-ADD-HISTORY");
      // called from Admin ... artificially creating history
      return {
        ...state,
        liveStudentHistory: action.payload.liveStudentHistory,
        studentHistory: action.payload.studentHistory,
        liveAllResponses: action.payload.liveAllResponses,
        subscribedAllResponses: action.payload.subscribedAllResponses,
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
    currentCourseMenu: {}, // current course object,
    liveCourseSettings: {},
    liveCourseChapters: [],
    liveStudentHistory: [], // array of studentHistory (one array from studentHistory)
    liveStudentUnRead: [], // at CourseMenu, populate the difference
    filteredUnReadQs: [],
    elapsedTime: 0, // seconds spent on question
    timerOn: true, // global state so different components can influence
    currentQuestion: {
      // THIS SHOULD BE PART OF VEC?
      qNum: 0,
      complete: undefined, // could be true, false, undefined (=== skipped)
      skipped: undefined,
      isCorrect: undefined, // true , false, undefined
      elapsedTime: 0, // seconds
    },
    newQNum: "",
    currentQuestionUpdate: {},
    subscribedAllResponses: {},
    liveAllResponses: [],
    criteriaTypes: ["chapter", "qType", "setter"],
    criteriaSet: [],
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
