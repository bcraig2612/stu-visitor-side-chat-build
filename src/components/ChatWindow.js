import React, {useEffect} from 'react';
import Slide from "@material-ui/core/Slide";
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import Footer from './Footer';
import StartChatForm from "./StartChatForm";
import Messages from "./Messages";
import WaitingOnAgent from "./WaitingOnAgent";
import ChatComplete from "./ChatComplete";
import ChatAgent from "./ChatAgent";
import CircularProgress from "@material-ui/core/CircularProgress";

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
    flexDirection: "column",
    background: "#fff",
  }),
  headerAction: {
    cursor: "pointer",
    marginLeft: "10px"
  },
  title: {
    marginRight: "auto",
    ...theme.typography.button,
    display: "flex",
    alignItems: "center"
  }
}));

function ChatWindow(props) {
  const classes = useStyles(props);

  useEffect(() => {
    if (props.conversation && props.conversation.active && props.conversation.accepted == 0) {
      const timer = setInterval(() => {
        props.setConversationToClosed();
      }, 10000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [props, props.conversation]);

  let content = (
      <div className={classes.chatWindow}>
        <div className={classes.header}>
          <div className={classes.title}>Live Chat</div>
          <CloseIcon className={classes.headerAction} onClick={() => props.handleChatWindowToggle(true)}  />
        </div>
        <WaitingOnAgent closeWindow={() => props.handleChatWindowToggle(true)} />

        {!props.accessToken && <StartChatForm validationEmail={props.widgetConfig.require_contact_info_to_start ? props.widgetConfig.require_contact_info_to_start : ""} isSubmitting={props.isSubmitting} onStartChatFormSubmit={props.onStartChatFormSubmit} />}
        {props.accessToken && <Messages isLoadingConversation={props.isLoadingConversation} messages={props.messages} />}
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
            {props.accessToken.length > 0 && (props.conversation.active == 1) && (props.conversation.accepted == 1) && (
              <div className={classes.title}><ChatAgent displayName={props.widgetConfig.display_name}/></div>
            ) }
            {(!props.accessToken.length > 0 || (props.conversation.active == 0)) && (
              <div className={classes.title}>Live Chat</div>
            ) }

            {(props.accessToken.length > 0 && (props.conversation.active == 1) && (props.conversation.accepted == 0)) && (
              <div className={classes.title}><CircularProgress size={20} color="inherit" /> <span style={{marginLeft: "10px"}}>Receptionist</span></div>
            ) }

            <CloseIcon className={classes.headerAction} onClick={() => props.handleChatWindowToggle(true)}  />
          </div>
          {props.accessToken.length > 0 && (props.conversation.active == 0) && (props.conversation.accepted == 1) && <ChatComplete handleInvalidToken={props.handleInvalidToken} />}
          {/*{props.accessToken.length > 0 && (props.conversation.accepted == 0) && <WaitingOnAgent handleInvalidToken={props.handleInvalidToken} setConversationToClosed={props.setConversationToClosed} smsOptInSubmitting={props.smsOptInSubmitting} smsOptIn={props.smsOptIn} reloadConversation={props.reloadConversation} conversation={props.conversation} closeWindow={() => props.handleChatWindowToggle(true)} />}*/}
          {!props.accessToken.length > 0 && <StartChatForm validationEmail={props.widgetConfig.require_contact_info_to_start ? props.widgetConfig.require_contact_info_to_start : ""} formError={props.formError} isSubmitting={props.isSubmitting} onStartChatFormSubmit={props.onStartChatFormSubmit} />}
          {props.accessToken.length > 0 && (props.conversation.active == 1 || (props.conversation.active == 0 && props.conversation.accepted == 0)) && <Messages handleInvalidToken={props.handleInvalidToken} conversation={props.conversation} showTypingIndicator={props.showTypingIndicator} isLoadingConversation={props.isLoadingConversation} messages={props.messages} smsOptInSubmitting={props.smsOptInSubmitting} smsOptIn={props.smsOptIn} />}
          {props.accessToken.length > 0 && (props.conversation.active == 1) && <Footer handleNewMessage={props.handleNewMessage} composeMessageValue={props.composeMessageValue} handleComposeMessageChange={props.handleComposeMessageChange} />}
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
