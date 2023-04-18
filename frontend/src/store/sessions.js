import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "sessions",
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
    sessionsRequested: (sessions, action) => {
      sessions.loading = true;
    },
    sessionsReceived: (sessions, action) => {
      sessions.list = action.payload;
      sessions.loading = false;
      sessions.lastFetch = Date.now();
      localStorage.setItem("sessions", JSON.stringify(sessions.list));
    },
    sessionsRequestFailed: (sessions, action) => {
      sessions.loading = false;
      sessions.error = action.payload;
    },

    sessionCreated: (sessions, action) => {
      sessions.list.push(action.payload);
      sessions.successCreate = true;
      sessions.createdSession = action.payload;
    },

    createdSessionCleared: (sessions, action) => {
      sessions.successCreate = false;
      delete sessions.createdSession;
    },

    sessionUpdated: (sessions, action) => {
      const index = sessions.list.findIndex(
        (session) => session._id === action.payload._id
      );
      sessions.list[index] = action.payload;
      sessions.successUpdate = true;
      window.location.reload();
    },

    sessionDeleted: (sessions, action) => {
      sessions.list = sessions.list.filter(
        (session) => session._id !== action.payload._id
      );
      sessions.successDelete = true;
      window.location.reload();
    },
  },
});

const {
  sessionsReceived,
  sessionsRequested,
  sessionCreated,
  sessionUpdated,
  sessionDeleted,
  createdSessionCleared,
  sessionsRequestFailed,
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = "/api/sessions";

export const loadSessions = () => (dispatch, getState) => {
  const { lastFetch } = getState().sessions;

  if (lastFetch) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: sessionsRequested.type,
      onSuccess: sessionsReceived.type,
      onError: sessionsRequestFailed.type,
    })
  );
};

export const createSession = () => (dispatch, getState) => {
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
      onSuccess: sessionCreated.type,
    })
  );
};

export const updateSession = (sessionId, data) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${sessionId}/update/`,
      method: "put",
      data,
      headers,
      onSuccess: sessionUpdated.type,
    })
  );
};

export const deleteSession = (sessionId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${sessionId}/delete/`,
      method: "delete",
      headers,
      onSuccess: sessionDeleted.type,
    })
  );
};

export const clearCreatedSession = () => (dispatch) => {
  dispatch(createdSessionCleared());
};
