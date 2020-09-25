import React from 'react';
import Slide from "@material-ui/core/Slide";
import CloseIcon from '@material-ui/icons/Close';
import CallMadeIcon from '@material-ui/icons/CallMade';
import { makeStyles } from '@material-ui/core/styles';
import Footer from './Footer';
import StartChatForm from "./StartChatForm";
import Messages from "./Messages";

const useStyles = makeStyles((theme) => ({
  header: props => ({
    width: '100%',
    padding: '10px',
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    borderTopLeftRadius: props.isIframe ? "4px" : "0",
    borderTopRightRadius: props.isIframe ? "4px" : "0",
    justifyContent: "flex-end"
  }),
  chatWindow: props => ({
    position: "fixed",
    bottom: props.isIframe ? "10px" : "0",
    right: props.isIframe ? "10px" : "0",
    boxShadow: "0 1px 1px rgba(0,0,0,0.11), 0 2px 2px rgba(0,0,0,0.11), 0 4px 4px rgba(0,0,0,0.11), 0 6px 8px rgba(0,0,0,0.11), 0 8px 16px rgba(0,0,0,0.11)",
    borderRadius: props.isIframe ? "4px" : "0",
    maxHeight: props.isIframe ? "calc(100% - 20px)" : "100%",
    maxWidth: "100%",
    height: props.isIframe ? "508px" : "100%",
    width: props.isIframe ? "286px" : "100%",
    zIndex: "2000",
    display: "flex",
    flexDirection: "column"
  }),
  headerAction: {
    cursor: "pointer",
    marginLeft: "10px"
  },
  title: {
    marginRight: "auto",
    ...theme.typography.button,
  }
}));

function ChatWindow(props) {
  const classes = useStyles(props);
  let content = (
      <div className={classes.chatWindow}>
        <div className={classes.header}>
          <div className={classes.title}>Live Chat</div>
          <CloseIcon className={classes.headerAction} onClick={() => props.handleChatWindowToggle(true)}  />
        </div>
        {!props.accessToken && <StartChatForm onStartChatFormSubmit={props.onStartChatFormSubmit} />}
        {props.accessToken && <Messages messages={props.messages} />}
        {props.accessToken && <Footer handleNewMessage={props.handleNewMessage} composeMessageValue={props.composeMessageValue} handleComposeMessageChange={props.handleComposeMessageChange} />}
      </div>
  );

  if (props.isIframe) {
    content = (
      <Slide direction="up"
             in={!props.chatClosed}
             mountOnEnter
             unmountOnExit
             onExited={() => window.parent.postMessage(JSON.stringify({'action': 'minimize'}),"*")}
      >
        <div className={classes.chatWindow}>
          <div className={classes.header}>
            <div className={classes.title}>Live Chat</div>
            {/*<CallMadeIcon*/}
            {/*  className={classes.headerAction}*/}
            {/*  onClick={() => {*/}
            {/*    window.parent.postMessage(JSON.stringify({'action': 'new_window'}), "*")*/}
            {/*  }}*/}
            {/*  />*/}
            <CloseIcon className={classes.headerAction} onClick={() => props.handleChatWindowToggle(true)}  />
          </div>
          {!props.accessToken && <StartChatForm onStartChatFormSubmit={props.onStartChatFormSubmit} />}
          {props.accessToken && <Messages messages={props.messages} />}
          {props.accessToken && <Footer handleNewMessage={props.handleNewMessage} composeMessageValue={props.composeMessageValue} handleComposeMessageChange={props.handleComposeMessageChange} />}
        </div>
      </Slide>
    );
  }
  return (
    <div className="App">
      {content}
    </div>
  );
}

export default ChatWindow;
