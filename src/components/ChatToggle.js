import React  from 'react';
import useStyles from './styles/ChatToggle.styles';
import Fab from '@material-ui/core/Fab';
import ChatIcon from '@material-ui/icons/Chat';
import Slide from "@material-ui/core/Slide";

function ChatToggle(props) {
  const classes = useStyles();

  return (
    <Slide direction="up" in={props.chatClosed} mountOnEnter unmountOnExit onExit={() => window.parent.postMessage(JSON.stringify({'action': 'expand'}),"*")}>
      <Fab className={classes.toggleChat} color="primary" aria-label="add" onClick={() => props.handleChatWindowToggle(false)}>
        <ChatIcon />
      </Fab>
    </Slide>
  );
}

export default ChatToggle;
