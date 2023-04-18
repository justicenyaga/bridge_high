import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "forms",
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
    formsRequested: (forms, action) => {
      forms.loading = true;
    },

    formsReceived: (forms, action) => {
      forms.list = action.payload;
      forms.loading = false;
      forms.lastFetch = Date.now();
      localStorage.setItem("forms", JSON.stringify(forms.list));
    },

    formsRequestFailed: (forms, action) => {
      forms.loading = false;
      forms.error = action.payload;
    },

    formCreated: (forms, action) => {
      forms.list.push(action.payload);
      forms.successCreate = true;
      forms.createdForm = action.payload;
    },

    createdFormCleared: (forms, action) => {
      forms.successCreate = false;
      delete forms.createdForm;
    },

    formUpdated: (forms, action) => {
      const index = forms.list.findIndex(
        (form) => form._id === action.payload._id
      );
      forms.list[index] = action.payload;
      forms.successUpdate = true;
      window.location.reload();
    },

    formDeleted: (forms, action) => {
      forms.list = forms.list.filter((form) => form._id !== action.payload._id);
      forms.successDelete = true;
      window.location.reload();
    },
  },
});

const {
  formsReceived,
  formsRequested,
  formCreated,
  createdFormCleared,
  formUpdated,
  formDeleted,
  formsRequestFailed,
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = "/api/classes";

export const loadForms = () => (dispatch, getState) => {
  const { lastFetch } = getState().forms;

  if (lastFetch) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: formsRequested.type,
      onSuccess: formsReceived.type,
      onError: formsRequestFailed.type,
    })
  );
};

export const createForm = () => (dispatch, getState) => {
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
      onSuccess: formCreated.type,
    })
  );
};

export const updateForm = (formId, data) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${formId}/update/`,
      method: "put",
      data,
      headers,
      onSuccess: formUpdated.type,
    })
  );
};

export const deleteForm = (formId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${formId}/delete/`,
      method: "delete",
      headers,
      onSuccess: formDeleted.type,
    })
  );
};

export const clearCreatedForm = () => (dispatch) => {
  dispatch(createdFormCleared());
};
