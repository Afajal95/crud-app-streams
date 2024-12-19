import React from "react";
import { List, Button, Confirm } from "semantic-ui-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deleteStream, setCurrentStream } from "../streams/streamSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

const StreamList: React.FC = () => {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const { streams, loading, error } = useAppSelector((state) => state.streams);
    const [open, setOpen] = React.useState(false);
    const [selectedStreamId, setSelectedStreamId] = React.useState<number | undefined>(undefined);
    const handleDelete = () => {
        if (selectedStreamId !== undefined) {
            dispatch(deleteStream(selectedStreamId));
        }
        setOpen(false);
    };

    const handleOpenConfirm = (id: number | undefined) => {
        setSelectedStreamId(id);
        setOpen(true); 
    };

    return (
        <>
            <List divided relaxed>
                {streams.map((stream) => (
                    <List.Item key={stream.id}>
                        <List.Content
                            verticalAlign="middle"
                            style={{ display: "flex", justifyContent: "space-between", width: "100%" }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <i className="large camera icon"></i>
                                <div>
                                    <List.Header>{stream.title}</List.Header>
                                    <List.Description>{stream.description}</List.Description>
                                </div>
                            </div>

                            <div>
                                <Button size="small" color="yellow" onClick={() => dispatch(setCurrentStream(stream))}>
                                    Edit
                                </Button>
                                <Button size="small" color="red" onClick={() => handleOpenConfirm(stream.id)}>
                                    Delete
                                </Button>
                            </div>
                        </List.Content>
                    </List.Item>
                ))}
            </List>
            <Confirm
                open={open}
                onCancel={() => setOpen(false)} 
                onConfirm={handleDelete}
                content="Are you sure you want to delete this stream?"
                confirmButton="Yes, Delete"
                cancelButton="Cancel"
            />
        </>
    );
};

export default StreamList;
