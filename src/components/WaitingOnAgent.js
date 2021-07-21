import React, {useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import { parsePhoneNumberFromString, AsYouType } from 'libphonenumber-js';
import useStyles from './styles/WaitingOnAgent.styles';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';

function WaitingOnAgent(props) {
  const classes = useStyles();
  const { register, setError, handleSubmit, errors } = useForm();
  const [showSendTextForm, setShowSendTextForm] = useState(false);
  const [showSendEmailForm, setShowSendEmailForm] = useState(false);
  const [phoneContactType, setPhoneContactType] = useState('sms');
  const [value, setValue] = useState('');

  useEffect(() => {
    if (props.conversation.active) {
      const timer = setInterval(() => {
        props.setConversationToClosed();
      }, 10000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [props, props.conversation]);

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

  const emailOptIn = () => {
    props.smsOptIn('email');
  }

  const onType = event => {
    const { value } = event.target;
    const newValue = new AsYouType('US').input(value);
    setValue(newValue);
  }

  let content = (
    <React.Fragment>
      <p className={classes.waitingText}>Please wait while we connect you with customer service..</p>
      <CircularProgress />
    </React.Fragment>
  );

  if (props.conversation.active === 0 && !showSendTextForm) {
    content = (
      <React.Fragment>
        <p className={classes.waitingText}>Our customer service team is busy helping other customers, how would you like us to contact you?</p>
        <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group" disabled={props.smsOptInSubmitting}>
          <Button onClick={() => {
            setPhoneContactType('sms')
            setShowSendTextForm(true)
          }}>Text</Button>
          <Button onClick={() => {
            setPhoneContactType('call')
            setShowSendTextForm(true)
          }}>Call</Button>
          <Button onClick={() => setShowSendEmailForm(true)}>Email</Button>
        </ButtonGroup>
      </React.Fragment>
    );
  }

  if (props.conversation.active === 0 && showSendTextForm && (phoneContactType === 'sms' || phoneContactType === 'call')) {
    content = (
      <React.Fragment>

        {phoneContactType === "sms" && <p className={classes.waitingText}>Enter your phone number and we will get back to you via text!</p>}
        {phoneContactType === "call" && <p className={classes.waitingText}>Enter your phone number and we will give you a call!</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" ref={register} name="contactMethod" value={phoneContactType} />
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
        <Button style={{marginTop: "10px"}} color="primary" onClick={() => setShowSendTextForm(false)}>Go back</Button>

      </React.Fragment>
    );
  }

  if (props.conversation.active === 0 && showSendEmailForm) {
    content = (
      <React.Fragment>
        <p className={classes.waitingText}>Want us to email you at {props.conversation.email_address}?</p>
        <Button
          onClick={emailOptIn}
          style={{marginTop: "10px"}}
          disabled={props.smsOptInSubmitting}
          type="submit"
          size="large"
          fullWidth={true}
          variant="contained"
          color="primary">{props.smsOptInSubmitting ? 'Loading..' : 'Yes'}</Button>
        <Button style={{marginTop: "10px"}} color="primary" onClick={() => setShowSendEmailForm(false)}>Go back</Button>
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

export default WaitingOnAgent;