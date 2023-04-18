import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "exams",
  initialState: {
    examList: [],
    loading: false,
    error: null,

    successUpdate: false,
    successDelete: false,
    successCreate: false,
  },
  reducers: {
    examsRequested: (exams, action) => {
      exams.loading = true;
    },

    examsReceived: (exams, action) => {
      exams.examList = action.payload;
      exams.loading = false;
    },

    examsRequestFailed: (exams, action) => {
      exams.loading = false;
      exams.error = action.payload;
    },

    examCreated: (exams, action) => {
      exams.examList.push(action.payload);
      exams.successCreate = true;
      exams.createdExam = action.payload;
    },

    createdExamCleared: (exams, action) => {
      exams.successCreate = false;
      delete exams.createdExam;
    },

    examUpdated: (exams, action) => {
      const index = exams.examList.findIndex(
        (exam) => exam._id === action.payload._id
      );
      exams.examList[index] = action.payload;
      exams.successUpdate = true;
      window.location.reload();
    },

    examDeleted: (exams, action) => {
      exams.examList = exams.examList.filter(
        (exam) => exam._id !== action.payload._id
      );
      exams.successDelete = true;
      window.location.reload();
    },
  },
});

const {
  examsRequested,
  examsReceived,
  examCreated,
  examUpdated,
  examDeleted,
  createdExamCleared,
  examsRequestFailed,
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = `/api/exams`;

export const loadExams = () => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: url,
      method: "get",
      headers,
      onStart: examsRequested.type,
      onSuccess: examsReceived.type,
      onError: examsRequestFailed.type,
    })
  );
};

export const createExam = () => (dispatch, getState) => {
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
      onSuccess: examCreated.type,
    })
  );
};

export const updateExam = (examId, data) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${examId}/update/`,
      method: "put",
      data,
      headers,
      onSuccess: examUpdated.type,
    })
  );
};

export const deleteExam = (examId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${examId}/delete/`,
      method: "delete",
      headers,
      onSuccess: examDeleted.type,
    })
  );
};

export const clearCreatedExam = () => (dispatch) => {
  dispatch(createdExamCleared());
};
