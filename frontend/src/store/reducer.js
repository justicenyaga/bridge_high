import { combineReducers } from "redux";

import userReducer from "./user";
import userDetailsReducer from "./userDetails";
import userDataReducer from "./userData";
import userListReducer from "./userList";

import resultsReducer from "./results";
import registersReducer from "./registers";

import subjectsReducer from "./subjects";
import sessionsReducer from "./sessions";
import formsReducer from "./forms";
import streamsReducer from "./streams";
import termsReducer from "./terms";
import examsReducer from "./exams";
import departmentsReducer from "./departments";
import classTeachersReducer from "./classTeachers";
import gradingSystemsReducer from "./gradingSystems";

import selectedT4Reducer from "./selectedT4";
import selectedSubjectsReducer from "./selectedSubjects";

import studentsReducer from "./students";

export default combineReducers({
  user: userReducer,
  userDetails: userDetailsReducer,
  userData: userDataReducer,
  userList: userListReducer,

  sessions: sessionsReducer,
  forms: formsReducer,
  streams: streamsReducer,
  terms: termsReducer,
  exams: examsReducer,
  departments: departmentsReducer,
  classTeachers: classTeachersReducer,
  gradingSystems: gradingSystemsReducer,
  subjects: subjectsReducer,

  results: resultsReducer,
  registers: registersReducer,

  selectedT4: selectedT4Reducer,
  selectedSubjects: selectedSubjectsReducer,
});
