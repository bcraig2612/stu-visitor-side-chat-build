import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import Button from "@material-ui/core/Button";

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

function ChatComplete(props) {
  const classes = useStyles();

  return (
    <div className={classes.startChatForm}>
      <ThumbUpIcon color="primary" />
      <p className={classes.waitingText}>Thanks for chatting with us!</p>
      <Button color="primary" onClick={props.handleInvalidToken}>Start new chat</Button>
    </div>
  );
}

export default ChatComplete;