import { apiCallBegan } from "./api";
import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "selectedSubjects",
  initialState: {
    selectedSubjects: {},
    studentsSelectedSubjects: [],
    loading: false,
    error: null,
  },
  reducers: {
    selectedSubjectsRequested: (selectedSubjects, action) => {
      selectedSubjects.loading = true;
    },

    selectedSubjectsReceived: (selectedSubjects, action) => {
      selectedSubjects.selectedSubjects = action.payload;
      selectedSubjects.loading = false;
    },

    studentsSelectedSubjectsReceived: (selectedSubjects, action) => {
      selectedSubjects.studentsSelectedSubjects = action.payload;
      selectedSubjects.loading = false;
    },

    selectedSubjectsRequestFailed: (selectedSubjects, action) => {
      selectedSubjects.error = action.payload;
      selectedSubjects.loading = false;
    },
  },
});

const {
  selectedSubjectsRequested,
  selectedSubjectsReceived,
  studentsSelectedSubjectsReceived,
  selectedSubjectsRequestFailed,
} = slice.actions;
export default slice.reducer;

const url = "/api/students";

export const getSelectedSubjects = (studentId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${studentId}/selected-subjects`,
      method: "get",
      headers,
      onStart: selectedSubjectsRequested.type,
      onSuccess: selectedSubjectsReceived.type,
      onError: selectedSubjectsRequestFailed.type,
    })
  );
};

export const getAllStudentsSelectedSubjects = () => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/all/selected-subjects`,
      method: "get",
      headers,
      onStart: selectedSubjectsRequested.type,
      onSuccess: studentsSelectedSubjectsReceived.type,
      onError: selectedSubjectsRequestFailed.type,
    })
  );
};

export const getClassSelectedSubjects = (classId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `/api/classes/${classId}/selected-subjects`,
      method: "get",
      headers,
      onStart: selectedSubjectsRequested.type,
      onSuccess: studentsSelectedSubjectsReceived.type,
      onError: selectedSubjectsRequestFailed.type,
    })
  );
};
