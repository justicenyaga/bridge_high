import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "userData",
  initialState: {
    userData: {},
    loading: false,
    error: null,
  },
  reducers: {
    userDataRequested: (userData, action) => {
      userData.loading = true;
    },

    userDataReceived: (userData, action) => {
      userData.userData = action.payload;
      userData.loading = false;
    },

    userDataRequestFailed: (userData, action) => {
      userData.loading = false;
      userData.error = action.payload;
    },
  },
});

const { userDataRequested, userDataReceived, userDataRequestFailed } =
  slice.actions;

export default slice.reducer;

// Action Creators
const url = `/api/users`;

export const loadUserData = (id) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: url + `/${id}/details`,
      method: "get",
      headers,
      onStart: userDataRequested.type,
      onSuccess: userDataReceived.type,
      onError: userDataRequestFailed.type,
    })
  );
};
