import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import {AsYouType, parsePhoneNumberFromString} from "libphonenumber-js";
import {useForm} from "react-hook-form";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";

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
  waitingText: {
    fontSize: "1.1em",
    textAlign: "center"
  }
}));

function ContactRequestForm(props) {
  const classes = useStyles();
  const { register, setError, handleSubmit, errors } = useForm();
  const [value, setValue] = useState('');

  const onSubmit = values => {
    const phoneNumber = parsePhoneNumberFromString(values.name, 'US');

    if (phoneNumber) {
      if (phoneNumber.isValid()) {
        // submit form
        props.smsOptIn(values.contactMethod, phoneNumber.number);
        return;
      }
    }

    setError("name", {
      type: "manual",
      message: "Enter a valid phone number."
    });
  }

  const emailOptIn = values => {
    props.smsOptIn('email', values.name);
  }

  const onType = event => {
    const { value } = event.target;
    const newValue = new AsYouType('US').input(value);
    setValue(newValue);
  }

  let content;

  if (props.conversation.active === 0 && props.showSendTextForm && (props.phoneContactType === 'sms' || props.phoneContactType === 'call')) {
    content = (
      <React.Fragment>

        {props.phoneContactType === "sms" && <p className={classes.waitingText}>Enter your phone number and we will get back to you via text!</p>}
        {props.phoneContactType === "call" && <p className={classes.waitingText}>Enter your phone number and we will give you a call!</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" ref={register} name="contactMethod" value={props.phoneContactType} />
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
            label="Phone number"
            variant="outlined"
            error={!!errors.name}
            aria-invalid={errors.name ? "true" : "false"}
            helperText={errors.name ? errors.name.message : ''}
            value={value}
            onChange={onType}
          />

          <Button
            style={{marginTop: "10px"}}
            disabled={props.smsOptInSubmitting}
            type="submit"
            size="large"
            fullWidth={true}
            variant="contained"
            color="primary">{props.smsOptInSubmitting ? 'Loading..' : 'Submit'}</Button>
          {props.formError && <Alert severity="error" style={{width: "100%", marginTop: "10px"}}>{props.formError}</Alert>}
        </form>
        <Button style={{marginTop: "10px"}} color="primary" onClick={() => props.setShowSendTextForm(false)}>Go back</Button>

      </React.Fragment>
    );
  }

  if (props.conversation.active === 0 && props.showSendEmailForm) {
    content = (
      <React.Fragment>
        <p className={classes.waitingText}>What email address should we contact you at?</p>
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
          label="Email address"
          variant="outlined"
          error={!!errors.name}
          aria-invalid={errors.name ? "true" : "false"}
          helperText={errors.name ? errors.name.message : ''}
          value={value}
          onChange={onType}
        />
        <Button
          onClick={emailOptIn}
          style={{marginTop: "10px"}}
          disabled={props.smsOptInSubmitting}
          type="submit"
          size="large"
          fullWidth={true}
          variant="contained"
          color="primary">{props.smsOptInSubmitting ? 'Loading..' : 'Yes'}</Button>
        <Button style={{marginTop: "10px"}} color="primary" onClick={() => props.setShowSendEmailForm(false)}>Go back</Button>
      </React.Fragment>
    );
  }

  if (props.conversation.sms_opt_in) {
    content = (
      <React.Fragment>
        <ThumbUpIcon color="primary" />
        <p className={classes.waitingText}>We got your message! Customer service will be texting you shortly.</p>
        <Button color="primary" onClick={props.handleInvalidToken}>Start new chat</Button>
      </React.Fragment>
    );
  }

  if (props.conversation.call_opt_in) {
    content = (
      <React.Fragment>
        <ThumbUpIcon color="primary" />
        <p className={classes.waitingText}>We got your message! Customer service will be calling you shortly.</p>
        <Button color="primary" onClick={props.handleInvalidToken}>Start new chat</Button>
      </React.Fragment>
    );
  }

  if (props.conversation.email_opt_in) {
    content = (
      <React.Fragment>
        <ThumbUpIcon color="primary" />
        <p className={classes.waitingText}>We got your message! Customer service will send an email to {props.conversation.email_address} shortly.</p>
        <Button color="primary" onClick={props.handleInvalidToken}>Start new chat</Button>
      </React.Fragment>
    );
  }

  return (
    <div className={classes.startChatForm}>
      {content}
    </div>
  );
}

export default ContactRequestForm;