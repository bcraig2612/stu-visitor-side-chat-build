import React, { useState } from "react";
import useStyles from "./styles/Footer.styles";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";


function Footer(props) {
  const classes = useStyles();
  const [sendDisabled, setSendDisabled] = useState(false);

  function handleSubmit() {
    if (props.composeMessageValue.length < 1 || sendDisabled) {
      return false;
    }
    setSendDisabled(true);
    setTimeout(() => setSendDisabled(false), 1000);
    props.handleNewMessage();
  }

  function keyPress(e) {
    if(e.keyCode == 13){
      handleSubmit();
    }
  }

  return (
    <div className={classes.footer}>
      <TextField
        inputProps={{ maxLength: 300 }}
        id="filled-multiline-flexible"
        label="Message"
        value={props.composeMessageValue}
        variant="filled"
        size="small"
        onChange={props.handleComposeMessageChange}
        className={classes.composeMessage}
        onKeyDown={keyPress}
      />
      <Fab disabled={sendDisabled} onClick={handleSubmit} style={{marginLeft: "10px"}} size="small" color="primary" aria-label="send">
        <SendIcon />
      </Fab>
    </div>
  );
}

export default Footer;