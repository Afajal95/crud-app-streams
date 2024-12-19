import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchStreams } from "../streams/streamSlice";
import CreateEditStream from "./CreateEditStream";
import StreamList from "./StreamList";
import { Header } from "semantic-ui-react";
import {ThunkDispatch} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

const StreamCrud: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { loading, error } = useAppSelector((state) => state.streams);

  useEffect(() => {
    dispatch(fetchStreams());
  }, [dispatch]);

 
  return (
    <div style={{ padding: "2rem" }}>
      <Header as="h2">Stream Manager</Header>
      <Header as="h3">Streams</Header>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <StreamList/>
      <CreateEditStream />
    </div>
  );
};

export default StreamCrud;

