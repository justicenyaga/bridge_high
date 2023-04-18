import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "terms",
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
    termsRequested: (terms, action) => {
      terms.loading = true;
    },

    termsReceived: (terms, action) => {
      terms.list = action.payload;
      terms.loading = false;
      terms.lastFetch = Date.now();
      localStorage.setItem("terms", JSON.stringify(terms.list));
    },

    termsRequestFailed: (terms, action) => {
      terms.loading = false;
      terms.error = action.payload;
    },

    termCreated: (terms, action) => {
      terms.list.push(action.payload);
      terms.successCreate = true;
      terms.createdTerm = action.payload;
    },

    createdTermCleared: (terms, action) => {
      terms.successCreate = false;
      delete terms.createdTerm;
    },

    termUpdated: (terms, action) => {
      const index = terms.list.findIndex(
        (term) => term._id === action.payload._id
      );
      terms.list[index] = action.payload;
      terms.successUpdate = true;
      window.location.reload();
    },

    termDeleted: (terms, action) => {
      terms.list = terms.list.filter((term) => term._id !== action.payload._id);
      terms.successDelete = true;
      window.location.reload();
    },
  },
});

const {
  termsReceived,
  termsRequested,
  termCreated,
  termUpdated,
  termDeleted,
  createdTermCleared,
  termsRequestFailed,
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = "/api/terms";

export const loadTerms = () => (dispatch, getState) => {
  const { lastFetch } = getState().terms;

  if (lastFetch) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: termsRequested.type,
      onSuccess: termsReceived.type,
      onError: termsRequestFailed.type,
    })
  );
};

export const createTerm = () => (dispatch, getState) => {
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
      onSuccess: termCreated.type,
    })
  );
};

export const updateTerm = (termId, data) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${termId}/update/`,
      method: "put",
      data,
      headers,
      onSuccess: termUpdated.type,
    })
  );
};

export const deleteTerm = (termId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${termId}/delete/`,
      method: "delete",
      headers,
      onSuccess: termDeleted.type,
    })
  );
};

export const clearCreatedTerm = () => (dispatch) => {
  dispatch(createdTermCleared());
};
