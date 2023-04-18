import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "registers",
  initialState: {
    registers: [],
    studentRegisters: [],
    loading: false,
    error: null,
  },
  reducers: {
    registersRequested: (registers, action) => {
      registers.loading = true;
    },
    registersReceived: (registers, action) => {
      registers.registers = action.payload;
      registers.loading = false;
    },
    studentRegistersReceived: (registers, action) => {
      registers.studentRegisters = action.payload;
      registers.loading = false;
    },
    registersRequestFailed: (registers, action) => {
      registers.loading = false;
      registers.error = action.payload;
    },
  },
});

const {
  registersRequested,
  registersReceived,
  studentRegistersReceived,
  registersRequestFailed,
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = `/api/registers`;

export const loadClassRegisters = (sessionId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/session/${sessionId}`,
      method: "get",
      headers,
      onStart: registersRequested.type,
      onSuccess: registersReceived.type,
      onError: registersRequestFailed.type,
    })
  );
};

export const loadStudentRegisters = (studentId) => (dispatch, getState) => {
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
      onStart: registersRequested.type,
      onSuccess: studentRegistersReceived.type,
      onError: registersRequestFailed.type,
    })
  );
};
