import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducer from "./reducer";
import api from "./middleware/api";

const userDetailsFromLocalStorage = localStorage.getItem("userDetails")
  ? JSON.parse(localStorage.getItem("userDetails"))
  : {};

const userInfoFromLocalStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : {};

const subjectsFromLocalStorage = localStorage.getItem("subjects")
  ? JSON.parse(localStorage.getItem("subjects"))
  : [];

const termsFromLocalStorage = localStorage.getItem("terms")
  ? JSON.parse(localStorage.getItem("terms"))
  : [];

const sessionsFromLocalStorage = localStorage.getItem("sessions")
  ? JSON.parse(localStorage.getItem("sessions"))
  : [];

const formsFromLocalStorage = localStorage.getItem("forms")
  ? JSON.parse(localStorage.getItem("forms"))
  : [];

const streamsFromLocalStorage = localStorage.getItem("streams")
  ? JSON.parse(localStorage.getItem("streams"))
  : [];

const gradingSystemsFromLocalStorage = localStorage.getItem("gradingSystems")
  ? JSON.parse(localStorage.getItem("gradingSystems"))
  : [];

const initialState = {
  user: {
    userInfo: userInfoFromLocalStorage,
  },

  userDetails: {
    userDetails: userDetailsFromLocalStorage,
  },

  subjects: {
    list: subjectsFromLocalStorage,
  },

  sessions: {
    list: sessionsFromLocalStorage,
  },

  forms: {
    list: formsFromLocalStorage,
  },

  streams: {
    list: streamsFromLocalStorage,
  },

  terms: {
    list: termsFromLocalStorage,
  },

  gradingSystems: {
    list: gradingSystemsFromLocalStorage,
  },
};

export default function () {
  return configureStore({
    reducer,
    preloadedState: initialState,
    middleware: [...getDefaultMiddleware(), api],
  });
}
