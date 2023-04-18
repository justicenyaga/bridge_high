import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "subjects",
  initialState: {
    list: [],
    loading: false,
    error: null,
    lastFetch: null,

    successUpdate: false,
    successDelete: false,
    successCreate: false,
  },
  reducers: {
    subjectsRequested: (subjects, action) => {
      subjects.loading = true;
    },

    subjectsReceived: (subjects, action) => {
      subjects.list = action.payload;
      subjects.loading = false;
      subjects.lastFetch = Date.now();
      localStorage.setItem("subjects", JSON.stringify(subjects.list));
    },

    subjectsRequestFailed: (subjects, action) => {
      subjects.loading = false;
      subjects.error = action.payload;
    },

    subjectCreated: (subjects, action) => {
      subjects.list.push(action.payload);
      subjects.successCreate = true;
      subjects.createdSubject = action.payload;
    },

    createdSubjectCleared: (subjects, action) => {
      subjects.successCreate = false;
      delete subjects.createdSubject;
    },

    subjectUpdated: (subjects, action) => {
      const index = subjects.list.findIndex(
        (subject) => subject._id === action.payload._id
      );
      subjects.list[index] = action.payload;
      subjects.successUpdate = true;
      window.location.reload();
    },

    subjectDeleted: (subjects, action) => {
      subjects.list = subjects.list.filter(
        (subject) => subject._id !== action.payload._id
      );
      subjects.successDelete = true;
      window.location.reload();
    },
  },
});

const {
  subjectsReceived,
  subjectsRequested,
  subjectCreated,
  subjectUpdated,
  subjectDeleted,
  createdSubjectCleared,
  subjectsRequestFailed,
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = "/api/subjects";

export const loadSubjects = () => (dispatch, getState) => {
  const { lastFetch } = getState().subjects;

  if (lastFetch) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: subjectsRequested.type,
      onSuccess: subjectsReceived.type,
      onError: subjectsRequestFailed.type,
    })
  );
};

export const createSubject = () => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/create/`,
      method: "post",
      data: {},
      headers,
      onSuccess: subjectCreated.type,
    })
  );
};

export const updateSubject = (subjectId, data) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${subjectId}/update/`,
      method: "put",
      data,
      headers,
      onSuccess: subjectUpdated.type,
    })
  );
};

export const deleteSubject = (subjectId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${subjectId}/delete/`,
      method: "delete",
      headers,
      onSuccess: subjectDeleted.type,
    })
  );
};

export const clearCreatedSubject = () => (dispatch) =>
  dispatch({ type: createdSubjectCleared.type });
