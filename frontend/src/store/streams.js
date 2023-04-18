import { createSlice } from "@reduxjs/toolkit";
import { apiCallBegan } from "./api";

const slice = createSlice({
  name: "streams",
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
    streamsRequested: (streams, action) => {
      streams.loading = true;
    },
    streamsReceived: (streams, action) => {
      streams.list = action.payload;
      streams.loading = false;
      streams.lastFetch = Date.now();
      localStorage.setItem("streams", JSON.stringify(streams.list));
    },
    streamsRequestFailed: (streams, action) => {
      streams.loading = false;
      streams.error = action.payload;
    },

    streamCreated: (streams, action) => {
      streams.list.push(action.payload);
      streams.successCreate = true;
      streams.createdStream = action.payload;
    },

    createdStreamCleared: (streams, action) => {
      streams.successCreate = false;
      delete streams.createdStream;
    },

    streamUpdated: (streams, action) => {
      const index = streams.list.findIndex(
        (stream) => stream._id === action.payload._id
      );
      streams.list[index] = action.payload;
      streams.successUpdate = true;
      window.location.reload();
    },

    streamDeleted: (streams, action) => {
      streams.list = streams.list.filter(
        (stream) => stream._id !== action.payload._id
      );
      streams.successDelete = true;
      window.location.reload();
    },
  },
});

const {
  streamsReceived,
  streamsRequested,
  streamCreated,
  createdStreamCleared,
  streamUpdated,
  streamDeleted,
  streamsRequestFailed,
} = slice.actions;
export default slice.reducer;

// Action Creators
const url = "api/classes/streams";

export const loadStreams = () => (dispatch, getState) => {
  const { lastFetch } = getState().streams;

  if (lastFetch) return;

  return dispatch(
    apiCallBegan({
      url,
      onStart: streamsRequested.type,
      onSuccess: streamsReceived.type,
      onError: streamsRequestFailed.type,
    })
  );
};

export const createStream = () => (dispatch, getState) => {
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
      onSuccess: streamCreated.type,
    })
  );
};

export const updateStream = (streamId, data) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${streamId}/update/`,
      method: "put",
      data,
      headers,
      onSuccess: streamUpdated.type,
    })
  );
};

export const deleteStream = (streamId) => (dispatch, getState) => {
  const { token } = getState().user.userInfo;

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return dispatch(
    apiCallBegan({
      url: `${url}/${streamId}/delete/`,
      method: "delete",
      headers,
      onSuccess: streamDeleted.type,
    })
  );
};

export const clearCreatedStream = () => (dispatch) => {
  dispatch(createdStreamCleared());
};
