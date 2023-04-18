import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "classTeachers",
  initialState: {
    list: [],
    classTeacher: {},
    loading: false,
    error: null,
    lastFetch: null,

    successUpdate: false,
    successDelete: false,
    successCreate: false,
  },
  reducers: {
    classTeachersRequested: (classTeachers, action) => {
      classTeachers.loading = true;
    },

    classTeachersReceived: (classTeachers, action) => {
      classTeachers.list = action.payload;
      classTeachers.loading = false;
      classTeachers.lastFetch = Date.now();
      localStorage.setItem("classTeachers", JSON.stringify(classTeachers.list));
    },

    classTeacherReceived: (classTeachers, action) => {
      classTeachers.classTeacher = action.payload;
      classTeachers.loading = false;
      classTeachers.lastFetch = Date.now();
    },

    classTeachersRequestFailed: (classTeachers, action) => {
      classTeachers.loading = false;
      classTeachers.error = action.payload;
    },

    classTeacherCreated: (classTeachers, action) => {
      classTeachers.list.push(action.payload);
      classTeachers.successCreate = true;
      classTeachers.createdClassTeacher = action.payload;
    },

    createdClassTeacherCleared: (classTeachers, action) => {
      classTeachers.successCreate = false;
      delete classTeachers.createdClassTeacher;
    },

    classTeacherUpdated: (classTeachers, action) => {
      const index = classTeachers.list.findIndex(
        (classTeacher) => classTeacher._id === action.payload._id
      );
      classTeachers.list[index] = action.payload;
      classTeachers.successUpdate = true;
      window.location.reload();
    },

    classTeacherDeleted: (classTeachers, action) => {
      classTeachers.list = classTeachers.list.filter(
        (classTeacher) => classTeacher._id !== action.payload._id
      );
      classTeachers.successDelete = true;
      window.location.reload();
    },
  },
});

const {
  classTeachersRequested,
  classTeachersReceived,
  classTeacherReceived,
  classTeachersRequestFailed,
  classTeacherCreated,
  createdClassTeacherCleared,
  classTeacherUpdated,
  classTeacherDeleted,
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = "api/teachers/class-teachers";

export const loadClassTeachers = () => (dispatch, getState) => {
  const { lastFetch } = getState().classTeachers;

  if (lastFetch) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: classTeachersRequested.type,
      onSuccess: classTeachersReceived.type,
      onError: classTeachersRequestFailed.type,
    })
  );
};

export const loadClassTeacherByTeacherId =
  (teacherId) => (dispatch, getState) => {
    const { lastFetch } = getState().classTeachers;

    if (lastFetch) return;

    return dispatch(
      apiCallBegan({
        url: `${url}/teacher/${teacherId}/`,
        onStart: classTeachersRequested.type,
        onSuccess: classTeacherReceived.type,
        onError: classTeachersRequestFailed.type,
      })
    );
  };

export const createClassTeacher = () => (dispatch, getState) => {
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
      onSuccess: classTeacherCreated.type,
    })
  );
};

export const updateClassTeacher =
  (classTeacherId, data) => (dispatch, getState) => {
    const { token } = getState().user.userInfo;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    return dispatch(
      apiCallBegan({
        url: `${url}/${classTeacherId}/update/`,
        method: "put",
        data,
        headers,
        onSuccess: classTeacherUpdated.type,
      })
    );
  };

export const deleteClassTeacher = (classTeacherId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${classTeacherId}/delete/`,
      method: "delete",
      headers,
      onSuccess: classTeacherDeleted.type,
    })
  );
};

export const clearCreatedClassTeacher = () => (dispatch) => {
  dispatch(createdClassTeacherCleared());
};
