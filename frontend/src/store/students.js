import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "students",
  initialState: {
    studentsList: [],
    loading: false,
    error: null,
    lastFetch: null,
    successDelete: false,
  },
  reducers: {
    studentsRequested: (students, action) => {
      students.loading = true;
    },

    studentsReceived: (students, action) => {
      students.studentsList = action.payload;
      students.loading = false;
      students.lastFetch = Date.now();
    },

    studentsRequestFailed: (students, action) => {
      students.loading = false;
      students.error = action.payload;
    },

    studentDeleted: (students, action) => {
      const index = students.studentsList.findIndex(
        (student) => student._id === action.payload._id
      );

      students.studentsList.splice(index, 1);
      students.successDelete = true;
    },
  },
});

const {
  studentsReceived,
  studentsRequested,
  studentsRequestFailed,
  studentDeleted,
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = "/api/students";

export const loadStudents = () => (dispatch, getState) => {
  const { userInfo } = getState().user;
  const { lastFetch } = getState().students;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${userInfo.token}`,
  };

  const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
  if (diffInMinutes < 10) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: studentsRequested.type,
      onSuccess: studentsReceived.type,
      onError: studentsRequestFailed.type,
      headers,
    })
  );
};

export const deleteStudent = (studentId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  dispatch(
    apiCallBegan({
      url: `/api/students/${studentId}/delete/`,
      method: "delete",
      headers,
      onSuccess: studentDeleted.type,
    })
  );
};
