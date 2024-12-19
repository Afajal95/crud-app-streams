// StreamForm.tsx
import React, { useState, useEffect } from "react";
import { Form, Button, Header, Segment, Message } from "semantic-ui-react";
import { useAppSelector } from "../store/hooks";
import { createStream, Stream, updateStream } from "../streams/streamSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";


const StreamForm: React.FC = () => {
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const { streams, currentStream } = useAppSelector((state) => state.streams);
    const [formData, setFormData] = useState<Stream>({
        id: currentStream?.id,
        title: currentStream?.title || "",
        description: currentStream?.description || "",
    });

    const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; success: boolean }>({
        visible: false,
        message: "",
        success: false,
    });

    useEffect(() => {
        if (currentStream) {
            setFormData({ id: currentStream.id, title: currentStream.title, description: currentStream.description });
        }
    }, [currentStream]);

    const handleSubmit = async () => {
        try {
            if (formData.id !== undefined) {
                await dispatch(updateStream({ id: formData.id, updatedStream: { ...formData } }));
                showSnackbar("Stream updated successfully!", true);
            } else {
                await dispatch(createStream({ title: formData.title, description: formData.description }));
                showSnackbar("Stream created successfully!", true);
            }
            setFormData({ id: undefined, title: undefined, description: "" });
        } catch {
            showSnackbar("Failed to save the stream. Please try again.", false);
        }
    };

    const showSnackbar = (message: string, success: boolean) => {
        setSnackbar({ visible: true, message, success });
        setTimeout(() => setSnackbar({ visible: false, message: "", success: false }), 3000);
    };

    if (formData.title === undefined) {
        return(
            <>
                <Button color="blue" onClick={() => setFormData({ id: undefined, title: "", description: "" })}>
                    Create Stream
                </Button>
                {snackbar.visible && (
                    <Message positive={snackbar.success} negative={!snackbar.success}>
                        {snackbar.message}
                    </Message>
                )}
            </>
        )
    }

    return (
        <Segment>
            <Header as="h3">{formData.id ? "Edit a Stream" : "Create a Stream"}</Header>
            <Form>
                <Form.Input
                    label="Title"
                    placeholder="Enter title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <Form.Input
                    label="Description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <Button color="blue" disabled={formData.title === "" || formData.description === ""} onClick={handleSubmit}>
                    Submit
                </Button>
            </Form>
        </Segment>
    );
};

export default StreamForm;
