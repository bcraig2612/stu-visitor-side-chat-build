import React, {useEffect, useRef, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Message from "./Message";
import Skeleton from "@material-ui/lab/Skeleton";
import TypingIndicator from "./TypingIndicator";
import moment from "moment";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import ContactRequestForm from "./ContactRequestForm";

const useStyles = makeStyles((theme) => ({
  messages: {
    flex: "1",
    backgroundColor: "#fff",
    padding: "10px",
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column"
  },
}));

function Messages(props) {
  // reference for end of message container
  const messagesEnd = useRef(null);
  const [showSendTextForm, setShowSendTextForm] = useState(false);
  const [showSendEmailForm, setShowSendEmailForm] = useState(false);
  const [phoneContactType, setPhoneContactType] = useState('sms');


  // scroll to most recent chat messages on render
  useEffect(() => {
    messagesEnd.current.scrollIntoView({behavior: "smooth"});
  });

  let messages = props.messages.map(message => <Message key={message.id} message={message} />);

  if (props.isLoadingConversation) {
    messages = (
      <React.Fragment>
        <Skeleton variant="text" height="50px" />
        <Skeleton variant="text" height="50px" />
        <Skeleton variant="text" height="50px" />
      </React.Fragment>
    );
  }

  const classes = useStyles();

  let conversationNotAccepted = null;
  if ((props.conversation.active == 0 && props.conversation.accepted == 0)) {
    conversationNotAccepted = (
      <React.Fragment>
        <Message message={{
          sent: moment().unix(),
          body: "Our customer service team is busy helping other customers.\n\n" +
            "Don’t worry I’m forwarding your message over to customer service.\n\n" +
            "How would you like them to contact you back?",
          sent_by_contact: 0
        }} />
        <ButtonGroup style={{minHeight: "36px"}} fullWidth variant="contained" color="primary" aria-label="contained primary button group" disabled={props.smsOptInSubmitting}>
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

  if (
    (props.conversation.active == 0) && (
      showSendEmailForm || showSendTextForm || props.conversation.sms_opt_in || props.conversation.call_opt_in || props.conversation.email_opt_in
    )
  ) {
    return (
      <React.Fragment>
        <ContactRequestForm
          phoneContactType={phoneContactType}
          conversation={props.conversation}
          showSendTextForm={showSendTextForm}
          setShowSendTextForm={setShowSendTextForm}
          setShowSendEmailForm={setShowSendEmailForm}
          showSendEmailForm={showSendEmailForm}
          smsOptInSubmitting={props.smsOptInSubmitting}
          smsOptIn={props.smsOptIn}
          handleInvalidToken={props.handleInvalidToken}
        />
        <div style={{float: "left", clear: "both"}}
             ref={messagesEnd}>
        </div>
      </React.Fragment>
    );
  }

  return (
    <div className={classes.messages}>
      {messages}
      {conversationNotAccepted}
      {props.showTypingIndicator == true && <TypingIndicator />}
      <div style={{float: "left", clear: "both"}}
           ref={messagesEnd}>
      </div>
    </div>
  );
}

export default Messages;