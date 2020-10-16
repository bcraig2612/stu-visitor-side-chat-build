import React, {useEffect, useRef} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Message from "./Message";
import Skeleton from "@material-ui/lab/Skeleton";
import TypingIndicator from "./TypingIndicator";

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

  return (
    <div className={classes.messages}>
      {messages}
      {props.showTypingIndicator == true && <TypingIndicator />}
      <div style={{float: "left", clear: "both"}}
           ref={messagesEnd}>
      </div>
    </div>
  );
}

export default Messages;