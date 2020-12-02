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
  const [message, setMessage] = useState('');

  const onSubmit = values => {
    if (values.contactMethod === "email") {
      props.smsOptIn('email', values.name, values.message);
      return;
    } else {
      const phoneNumber = parsePhoneNumberFromString(values.name, 'US');

      if (phoneNumber) {
        if (phoneNumber.isValid()) {
          // submit form
          props.smsOptIn(values.contactMethod, phoneNumber.number, values.message);
          return;
        }
      }
      setError("name", {
        type: "manual",
        message: "Enter a valid phone number."
      });
    }
  }

  const formatPhoneNumber = (value) => {
    if (!value) return '';
    value = value.toString();
    if (value.includes('(') && !value.includes(')')) {
      return value.replace('(', '');
    }
    return new AsYouType('US').input(value);
  };

  const emailOptIn = values => {
    props.smsOptIn('email', values.name);
  }

  const onType = event => {
    const { value } = event.target;

    if (! props.showSendEmailForm) {
      const newValue = formatPhoneNumber(value);
      setValue(newValue);
      return;
    }
    setValue(value);
  }

  const onMessageChange = event => {
    const { value } = event.target;
    setMessage(value);
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
          <TextField
            inputProps={{ 'name': 'message', maxLength: 320 }}
            inputRef={register({
              maxLength: 320,
            })}
            fullWidth={true}
            className={classes.chatFormInput}
            label="Message (optional)"
            variant="outlined"
            error={!!errors.message}
            aria-invalid={errors.message ? "true" : "false"}
            helperText={errors.message ? errors.message.message : ''}
            value={message}
            onChange={onMessageChange}
            style={{marginTop: "10px"}}
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" ref={register} name="contactMethod" value="email" />
          <TextField
            inputProps={{ 'name': 'name', maxLength: 320 }}
            inputRef={register({
              required: "Required",
              minLength: 1,
              maxLength: 320,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
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
          <TextField
            inputProps={{ 'name': 'message', maxLength: 320 }}
            inputRef={register({
              maxLength: 320,
            })}
            fullWidth={true}
            className={classes.chatFormInput}
            label="Message (optional)"
            variant="outlined"
            error={!!errors.message}
            aria-invalid={errors.message ? "true" : "false"}
            helperText={errors.message ? errors.message.message : ''}
            value={message}
            onChange={onMessageChange}
            style={{marginTop: "10px"}}
          />
          <Button
            style={{marginTop: "10px"}}
            disabled={props.smsOptInSubmitting}
            type="submit"
            size="large"
            fullWidth={true}
            variant="contained"
            color="primary">{props.smsOptInSubmitting ? 'Loading..' : 'Submit'}</Button>
        </form>

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