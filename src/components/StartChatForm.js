import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { useForm } from "react-hook-form";
import Alert from "@material-ui/lab/Alert";

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
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = values => {
    props.onStartChatFormSubmit(values);
  }

  return (
    <div className={classes.startChatForm}>
      <p>Fill out the form to start chatting!</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          inputProps={{ 'name': 'name', maxLength: 300 }}
          inputRef={register({
            required: "Required",
            minLength: 1,
            maxLength: 300
          })}
          fullWidth={true}
          className={classes.chatFormInput}
          id="outlined-basic"
          label="Name"
          variant="outlined"
          error={!!errors.name}
          aria-invalid={errors.name ? "true" : "false"}
          helperText={errors.name ? 'Please enter your name.' : ''}
        />
        <TextField
          inputProps={{ 'name': 'email_address', maxLength: 320 }}
          inputRef={register({
            required: "Required",
            minLength: 3,
            maxLength: 320
          })}
          fullWidth={true}
          className={classes.chatFormInput}
          label="Email address"
          variant="outlined"
          error={!!errors.email_address}
          aria-invalid={errors.email_address ? "true" : "false"}
          helperText={errors.email_address ? 'Invalid email address.' : ''}
        />

        <TextField
          inputProps={{ 'name': 'message', maxLength: 300 }}
          inputRef={register({
            required: "Required",
            minLength: 1,
            maxLength: 300
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
        <Button
          disabled={props.isSubmitting}
          type="submit"
          size="large"
          fullWidth={true}
          variant="contained"
          color="primary">{props.isSubmitting ? 'Loading..' : 'Start Chat'}</Button>
        {props.formError && <Alert severity="error" style={{width: "100%", marginTop: "10px"}}>{props.formError}</Alert>}
      </form>
    </div>
  );
}

export default StartChatForm;