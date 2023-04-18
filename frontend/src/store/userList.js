import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "userList",
  initialState: {
    studentList: [],
    teacherList: [],
    staffList: [],
    adminList: [],

    loading: false,
    error: null,

    successDelete: false,
    successUpdate: false,
    successCreate: false,
  },
  reducers: {
    userListRequested: (userList, action) => {
      userList.loading = true;
    },

    studentListReceived: (userList, action) => {
      userList.studentList = action.payload;
      userList.loading = false;
      userList.lastFetch = Date.now();
    },

    teacherListReceived: (userList, action) => {
      userList.teacherList = action.payload;
      userList.loading = false;
      userList.lastFetch = Date.now();
    },

    adminListReceived: (userList, action) => {
      userList.adminList = action.payload;
      userList.loading = false;
      userList.lastFetch = Date.now();
    },

    staffListReceived: (userList, action) => {
      userList.staffList = action.payload;
      userList.loading = false;
      userList.lastFetch = Date.now();
    },

    userListRequestFailed: (userList, action) => {
      userList.loading = false;
      userList.error = action.payload;
    },

    userDeleted: (userList, action) => {
      userList.successDelete = true;
      window.location.reload();
    },

    userUpdated: (userList, action) => {
      userList.successUpdate = true;
      window.location.reload();
    },

    userCreated: (userList, action) => {
      userList.successCreate = true;
      userList.userCreated = action.payload;
    },

    createdUserRemoved: (userList, action) => {
      delete userList.userCreated;
      userList.successCreate = false;
    },
  },
});

const {
  userListRequested,
  studentListReceived,
  teacherListReceived,
  adminListReceived,
  staffListReceived,
  userListRequestFailed,
  userCreated,
  userUpdated,
  createdUserRemoved,
  userDeleted,
} = slice.actions;
export default slice.reducer;

// Action Creators
export const loadUsers = (role) => (dispatch, getState) => {
  let url = "/api";

  role === "students"
    ? (url += "/students")
    : role === "teachers"
    ? (url += "/teachers")
    : role === "admin"
    ? (url += "/admins")
    : (url += "/staffs");

  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  dispatch(
    apiCallBegan({
      url: url,
      method: "get",
      headers,
      onStart: userListRequested.type,
      onSuccess:
        role === "students"
          ? studentListReceived.type
          : role === "teachers"
          ? teacherListReceived.type
          : role === "admin"
          ? adminListReceived.type
          : staffListReceived.type,
      onError: userListRequestFailed.type,
    })
  );
};

export const deleteUser = (role, user_id) => (dispatch, getState) => {
  let url = "/api";

  role === "students"
    ? (url += "/students")
    : role === "teachers"
    ? (url += "/teachers")
    : role === "admin"
    ? (url += "/admins")
    : (url += "/staffs");

  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  dispatch(
    apiCallBegan({
      url: url + `/${user_id}/delete/`,
      method: "delete",
      headers,
      onSuccess: userDeleted.type,
    })
  );
};

export const updateUser = (role, userDetails) => (dispatch, getState) => {
  let url = "/api";

  role === "students"
    ? (url += "/students")
    : role === "teachers"
    ? (url += "/teachers")
    : role === "admin"
    ? (url += "/admins")
    : (url += "/staffs");

  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  dispatch(
    apiCallBegan({
      url: url + `/${userDetails._id}/update/`,
      method: "put",
      data: userDetails,
      headers,
      onSuccess: userUpdated.type,
    })
  );
};

export const createUser = (role) => (dispatch, getState) => {
  let url = "/api";

  role === "students"
    ? (url += "/students")
    : role === "teachers"
    ? (url += "/teachers")
    : role === "admin"
    ? (url += "/admins")
    : (url += "/staffs");

  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  dispatch(
    apiCallBegan({
      url: url + "/create/",
      method: "post",
      data: {},
      headers,
      onSuccess: userCreated.type,
    })
  );
};

export const removeCreatedUser = () => (dispatch) =>
  dispatch({ type: createdUserRemoved.type });
