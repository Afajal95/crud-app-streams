import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Stream {
  id?: number;
  title?: string;
  description?: string;
}

interface StreamsState {
  streams: Stream[];
  loading: boolean;
  error: string | null;
  currentStream?: Stream;
}

const initialState: StreamsState = {
  streams: [],
  loading: false,
  error: null,
  currentStream: {id: undefined, title: undefined, description: undefined},
};

// Async Actions
export const fetchStreams = createAsyncThunk("streams/fetchStreams", async () => {
  const response = await axios.get("http://localhost:3005/streams");
  return response.data;
});

export const createStream = createAsyncThunk("streams/createStream", async (stream: Stream) => {
  const response = await axios.post("http://localhost:3005/streams", stream);
  return response.data;
});

export const updateStream = createAsyncThunk(
  "streams/updateStream",
  async ({ id, updatedStream }: { id: number; updatedStream: Stream }) => {
    const response = await axios.put(`http://localhost:3005/streams/${id}`, updatedStream);
    return response.data;
  }
);

export const deleteStream = createAsyncThunk("streams/deleteStream", async (id: number) => {
  await axios.delete(`http://localhost:3005/streams/${id}`);
  return id;
});

// Slice
const streamSlice = createSlice({
  name: "streams",
  initialState,
  reducers: {
    setCurrentStream: (state, action) => {
      state.currentStream = action.payload;
    },
    clearCurrentStream: (state) => {
      state.currentStream = {id: undefined, title: "", description: ""};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStreams.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStreams.fulfilled, (state, action) => {
        state.loading = false;
        state.streams = action.payload;
      })
      .addCase(fetchStreams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch streams.";
      })
      .addCase(createStream.fulfilled, (state, action) => {
        state.streams.push(action.payload);
      })
      .addCase(updateStream.fulfilled, (state, action) => {
        const index = state.streams.findIndex((stream) => stream.id === action.payload.id);
        if (index !== -1) state.streams[index] = action.payload;
      })
      .addCase(deleteStream.fulfilled, (state, action) => {
        state.streams = state.streams.filter((stream) => stream.id !== action.payload);
      });
  },
});

export default streamSlice.reducer;
export const { setCurrentStream, clearCurrentStream } = streamSlice.actions;