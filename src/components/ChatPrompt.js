import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";
import IconButton from "@material-ui/core/IconButton";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const useStyles = makeStyles({
  chatPrompt: {
    position: "fixed !important",
    bottom: "80px",
    right: "10px",
    "&::after": {
      content: '""',
      width: "20px",
      height: "20px",
      position: "absolute",
      bottom: "-6px",
      right: "18px",
      background: "#fff",
      borderRadius: "4px",
      transform: "rotate(45deg)",
    }
  },
  chatPromptBubble: {
    padding: "20px",
    borderRadius: "13px",
    fontSize: "1.1em",
    cursor: "pointer",
  },
  closeAction: {
    position: "absolute",
    bottom: "50px",
    right: "0"
  }
});

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