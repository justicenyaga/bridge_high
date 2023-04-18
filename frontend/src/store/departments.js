import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "departments",
  initialState: {
    list: [],
    loading: false,
    error: null,

    successUpdate: false,
    successDelete: false,
    successCreate: false,
  },
  reducers: {
    departmentsRequested: (departments, action) => {
      departments.loading = true;
    },

    departmentsReceived: (departments, action) => {
      departments.list = action.payload;
      departments.loading = false;
    },

    departmentsRequestFailed: (departments, action) => {
      departments.loading = false;
      departments.error = action.payload;
    },

    departmentCreated: (departments, action) => {
      departments.list.push(action.payload);
      departments.successCreate = true;
      departments.createdDepartment = action.payload;
    },

    createdDepartmentCleared: (departments, action) => {
      departments.successCreate = false;
      delete departments.createdDepartment;
    },

    departmentUpdated: (departments, action) => {
      const index = departments.list.findIndex(
        (department) => department._id === action.payload._id
      );
      departments.list[index] = action.payload;
      departments.successUpdate = true;
      window.location.reload();
    },

    departmentDeleted: (departments, action) => {
      departments.list = departments.list.filter(
        (department) => department._id !== action.payload._id
      );
      departments.successDelete = true;
      window.location.reload();
    },
  },
});

const {
  departmentsRequested,
  departmentsReceived,
  departmentCreated,
  departmentUpdated,
  departmentDeleted,
  createdDepartmentCleared,
  departmentsRequestFailed,
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = `/api/departments`;

export const loadDepartments = () => (dispatch, getState) => {
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
      onStart: departmentsRequested.type,
      onSuccess: departmentsReceived.type,
      onError: departmentsRequestFailed.type,
    })
  );
};

export const createDepartment = () => (dispatch, getState) => {
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
      onSuccess: departmentCreated.type,
    })
  );
};

export const updateDepartment = (deptId, data) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${deptId}/update/`,
      method: "put",
      data,
      headers,
      onSuccess: departmentUpdated.type,
    })
  );
};

export const deleteDepartment = (deptId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${deptId}/delete/`,
      method: "delete",
      headers,
      onSuccess: departmentDeleted.type,
    })
  );
};

export const clearCreatedDepartment = () => (dispatch) => {
  dispatch(createdDepartmentCleared());
};
