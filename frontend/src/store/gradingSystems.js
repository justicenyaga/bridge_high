import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "gradingSystems",
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
    gradingSystemsRequested: (gradingSystems, action) => {
      gradingSystems.loading = true;
    },
    gradingSystemsReceived: (gradingSystems, action) => {
      gradingSystems.list = action.payload;
      gradingSystems.loading = false;
      gradingSystems.lastFetch = Date.now();
      localStorage.setItem(
        "gradingSystems",
        JSON.stringify(gradingSystems.list)
      );
    },
    gradingSystemsRequestFailed: (gradingSystems, action) => {
      gradingSystems.loading = false;
      gradingSystems.error = action.payload;
    },

    gradingSystemCreated: (gradingSystems, action) => {
      gradingSystems.list.push(action.payload);
      gradingSystems.successCreate = true;
      gradingSystems.createdGradingSystem = action.payload;
    },

    createdGradingSystemCleared: (gradingSystems, action) => {
      gradingSystems.successCreate = false;
      delete gradingSystems.createdGradingSystem;
    },

    gradingSystemUpdated: (gradingSystems, action) => {
      const index = gradingSystems.list.findIndex(
        (gradingSystem) => gradingSystem._id === action.payload._id
      );
      gradingSystems.list[index] = action.payload;
      gradingSystems.successUpdate = true;
      window.location.reload();
    },

    gradingSystemDeleted: (gradingSystems, action) => {
      gradingSystems.list = gradingSystems.list.filter(
        (gradingSystem) => gradingSystem._id !== action.payload._id
      );
      gradingSystems.successDelete = true;
      window.location.reload();
    },
  },
});

const {
  gradingSystemsRequested,
  gradingSystemsReceived,
  gradingSystemCreated,
  createdGradingSystemCleared,
  gradingSystemUpdated,
  gradingSystemDeleted,
  gradingSystemsRequestFailed,
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = "api/grading-systems";

export const loadGradingSystems = () => (dispatch, getState) => {
  const { lastFetch } = getState().gradingSystems;

  if (lastFetch) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: gradingSystemsRequested.type,
      onSuccess: gradingSystemsReceived.type,
      onError: gradingSystemsRequestFailed.type,
    })
  );
};

export const createGradingSystem = () => (dispatch, getState) => {
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
      onSuccess: gradingSystemCreated.type,
    })
  );
};

export const updateGradingSystem = (id, data) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${id}/update/`,
      method: "put",
      data,
      headers,
      onSuccess: gradingSystemUpdated.type,
    })
  );
};

export const deleteGradingSystem = (id) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${id}/delete/`,
      method: "delete",
      headers,
      onSuccess: gradingSystemDeleted.type,
    })
  );
};

export const clearCreatedGradingSystem = () => (dispatch) => {
  dispatch(createdGradingSystemCleared());
};
