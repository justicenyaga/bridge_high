import { apiCallBegan } from "./api";
import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "selectedT4",
  initialState: {
    selectedT4: {
      t4: {},
    },
    studentsSelectedT4: [],
    loading: false,
    error: null,
  },
  reducers: {
    selectedT4Requested: (selectedT4, action) => {
      selectedT4.loading = true;
    },

    selectedT4Received: (selectedT4, action) => {
      selectedT4.selectedT4 = action.payload;
      selectedT4.loading = false;
    },

    studentsSelectedT4Received: (selectedT4, action) => {
      selectedT4.studentsSelectedT4 = action.payload;
      selectedT4.loading = false;
    },

    selectedT4RequestFailed: (selectedT4, action) => {
      selectedT4.error = action.payload;
      selectedT4.loading = false;
    },
  },
});

const {
  selectedT4Requested,
  selectedT4Received,
  studentsSelectedT4Received,
  selectedT4RequestFailed,
} = slice.actions;
export default slice.reducer;

const url = "/api/students";

export const getSelectedT4 = (studentId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${studentId}/selected-t4`,
      method: "get",
      headers,
      onStart: selectedT4Requested.type,
      onSuccess: selectedT4Received.type,
      onError: selectedT4RequestFailed.type,
    })
  );
};

export const getAllStudentsSelectedT4 = () => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/all/selected-t4`,
      method: "get",
      headers,
      onStart: selectedT4Requested.type,
      onSuccess: studentsSelectedT4Received.type,
      onError: selectedT4RequestFailed.type,
    })
  );
};

export const getClassSelectedT4 = (classId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `/api/classes/${classId}/selected-t4`,
      method: "get",
      headers,
      onStart: selectedT4Requested.type,
      onSuccess: studentsSelectedT4Received.type,
      onError: selectedT4RequestFailed.type,
    })
  );
};
