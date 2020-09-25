import React, {useEffect, useRef} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Message from "./Message";

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

  const messages = props.messages.map(message => <Message key={message.id} message={message} />);

  const classes = useStyles();

  return (
    <div className={classes.messages}>
      {messages}
      <div style={{float: "left", clear: "both"}}
           ref={messagesEnd}>
      </div>
    </div>
  );
}

export default Messages;