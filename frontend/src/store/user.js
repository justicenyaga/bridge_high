import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";
// import { resetUserList } from "./userList";

const slice = createSlice({
  name: "user",

  initialState: {
    userInfo: {},
    loading: false,
    error: null,
    reset_success: false,
  },

  reducers: {
    userInfoRequested: (user, action) => {
      user.loading = true;
    },

    userInfoReceived: (user, action) => {
      user.userInfo = action.payload;
      user.loading = false;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      window.location.reload(true);
    },

    userInfoRequestFailed: (user, action) => {
      user.error = action.payload;
      user.loading = false;
    },

    resetPasswordSuccess: (user, action) => {
      user.reset_success = true;
      user.error = null;
    },

    resetPasswordFailed: (user, action) => {
      user.error = action.payload;
      user.reset_success = false;
      user.loading = false;
    },

    userLoggedOut: (user, action) => {
      user.userInfo = {};
    },

    errorCleared: (user, action) => {
      user.error = null;
      user.reset_success = false;
    },
  },
});

const {
  userInfoRequested,
  userInfoReceived,
  userInfoRequestFailed,
  resetPasswordSuccess,
  resetPasswordFailed,
  userLoggedOut,
  errorCleared,
} = slice.actions;
export default slice.reducer;

const headers = {
  "Content-Type": "application/json",
};

const url = "/api/users";

export const login = (email, password) =>
  apiCallBegan({
    url: `${url}/login/`,
    method: "post",
    data: { username: email, password },
    headers,
    onStart: userInfoRequested.type,
    onSuccess: userInfoReceived.type,
    onError: userInfoRequestFailed.type,
  });

export const register = (name, email, password) =>
  apiCallBegan({
    url: `${url}/register/`,
    method: "post",
    data: { email, name, password },
    headers,
    onStart: userInfoRequested.type,
    onSuccess: userInfoReceived.type,
    onError: userInfoRequestFailed.type,
  });

export const logout = () => (dispatch) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("userDetails");
  dispatch({ type: userLoggedOut.type });
  //   dispatch(resetUserList());
};

export const resetPassword =
  (current_password, new_password) => (dispatch, getState) => {
    const { userInfo } = getState().user;

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userInfo.token}`,
    };

    dispatch(
      apiCallBegan({
        url: `${url}/reset-password/`,
        method: "put",
        data: { current_password, new_password },
        headers,
        onSuccess: resetPasswordSuccess.type,
        onError: resetPasswordFailed.type,
      })
    );
  };

export const clearError = () => (dispatch) => {
  dispatch({ type: errorCleared.type });
};
