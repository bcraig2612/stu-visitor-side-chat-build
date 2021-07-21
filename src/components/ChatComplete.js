import React from 'react';
import useStyles from './styles/ChatComplete.styles';
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import Button from "@material-ui/core/Button";

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