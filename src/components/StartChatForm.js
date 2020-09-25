import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useForm } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
  startChatForm: {
    flex: "1",
    backgroundColor: "#fff",
    padding: "10px",
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  chatFormInput: {
    marginBottom: "10px",
  }
}));

function StartChatForm(props) {
  const classes = useStyles();
  const { handleSubmit, register, errors } = useForm();
  const onSubmit = values => {
    props.onStartChatFormSubmit(values);
  }

  return (
    <div className={classes.startChatForm}>
      <p>Fill out the form to start chatting!</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          inputProps={{ 'name': 'name' }}
          inputRef={register({
            required: "Required",
            minLength: "3"
          })}
          fullWidth={true}
          className={classes.chatFormInput}
          id="outlined-basic"
          label="Name"
          variant="outlined"
          error={!!errors.name}
          helperText={errors.name && errors.name.message ? errors.name.message : ''}
        />
        <TextField
          inputProps={{ 'name': 'phone_number' }}
          inputRef={register({
            required: "Required",
            minLength: "3"
          })}
          fullWidth={true}
          className={classes.chatFormInput}
          label="Phone number"
          variant="outlined"
          error={!!errors.phone_number}
          helperText={errors.phone_number && errors.phone_number.message ? errors.phone_number.message : ''}
        />

        <TextField
          inputProps={{ 'name': 'message' }}
          inputRef={register({
            required: "Required",
            minLength: "3"
          })}
          multiline
          rowsMax={4}
          fullWidth={true}
          className={classes.chatFormInput}
          label="Message"
          variant="outlined"
          error={!!errors.message}
          helperText={errors.message && errors.message.message ? errors.message.message : ''}
        />
        <Button type="submit" size="large" fullWidth={true} variant="contained" color="primary">Start Chat</Button>
      </form>
    </div>
  );
}

export default StartChatForm;