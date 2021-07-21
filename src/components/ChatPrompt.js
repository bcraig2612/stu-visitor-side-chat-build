import React from 'react';
import useStyles from './styles/ChatPrompt.styles';
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

function ChatPrompt(props) {
  const classes = useStyles();

  return (
    <div className={classes.chatPrompt}>
      <Grow in={true}>
        <div>
          <div className={classes.closeAction}>
            <IconButton aria-label="close" size="small" onClick={props.closeChatPrompt}>
              <HighlightOffIcon fontSize="inherit" />
            </IconButton>
          </div>
          <Paper elevation={3} className={classes.chatPromptBubble} onClick={() => props.handleChatWindowToggle(false)}>
            Hi there, have a question? Message us here.
          </Paper>
        </div>
      </Grow>
    </div>
  );
}

export default ChatPrompt;