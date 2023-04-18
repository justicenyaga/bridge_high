import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "userDetails",
  initialState: {
    userDetails: {},
    loading: false,
    error: null,
  },
  reducers: {
    userDetailsRequested: (userDetails, action) => {
      userDetails.loading = true;
    },

    userDetailsReceived: (userDetails, action) => {
      userDetails.userDetails = action.payload;
      localStorage.setItem("userDetails", JSON.stringify(action.payload));
      userDetails.loading = false;
    },

    userDetailsRequestFailed: (userDetails, action) => {
      userDetails.loading = false;
      userDetails.error = action.payload;
    },
  },
});

const { userDetailsRequested, userDetailsReceived, userDetailsRequestFailed } =
  slice.actions;

export default slice.reducer;

// Action Creators
const url = `/api/users`;

export const loadUserDetails = (id) => (dispatch, getState) => {
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
      onStart: userDetailsRequested.type,
      onSuccess: userDetailsReceived.type,
      onError: userDetailsRequestFailed.type,
    })
  );
};
