import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "results",
  initialState: {
    results: [],
    studentResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    resultsRequested: (results, action) => {
      results.loading = true;
    },
    resultsReceived: (results, action) => {
      results.results = action.payload;
      results.loading = false;
    },
    studentResultsReceived: (results, action) => {
      results.studentResults = action.payload;
      results.loading = false;
    },
    resultsRequestFailed: (results, action) => {
      results.loading = false;
      results.error = action.payload;
    },
  },
});

const {
  resultsRequested,
  resultsReceived,
  studentResultsReceived,
  resultsRequestFailed,
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = `/api/results`;

export const loadResults = () => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: url + "/all",
      method: "get",
      headers,
      onStart: resultsRequested.type,
      onSuccess: resultsReceived.type,
      onError: resultsRequestFailed.type,
    })
  );
};

export const loadStudentResults = (studentId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/student/${studentId}`,
      method: "get",
      headers,
      onStart: resultsRequested.type,
      onSuccess: studentResultsReceived.type,
      onError: resultsRequestFailed.type,
    })
  );
};
