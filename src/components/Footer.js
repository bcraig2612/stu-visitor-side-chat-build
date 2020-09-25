import React from "react";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  footer: {
    display: "flex",
    padding: "10px",
    background: "#fff",
    alignItems: "center"
  },
  composeMessage: {
    flex: "1"
  }
}));

function Footer(props) {
  const classes = useStyles();

  return (
    <div className={classes.footer}>
      <TextField
        id="filled-multiline-flexible"
        label="Message"
        multiline
        rowsMax={4}
        value={props.composeMessageValue}
        variant="filled"
        size="small"
        onChange={props.handleComposeMessageChange}
        className={classes.composeMessage}
      />
      <Fab onClick={props.handleNewMessage} style={{marginLeft: "10px"}} size="small" color="primary" aria-label="send">
        <SendIcon />
      </Fab>
    </div>
  );
}

export default Footer;