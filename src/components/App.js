import React, {useEffect, useState} from 'react';
import Pusher from 'pusher-js';
import moment from "moment";
import ChatWindow from './ChatWindow';
import ChatToggle from './ChatToggle';
import notificationMP3 from "../notification.mp3";
import ChatPrompt from "./ChatPrompt";

// this will identify the client we are on
// so we don't show duplicate messages from pusher
const clientIdentifier = Date.now();
const apiURL = process.env.REACT_APP_API_URL;

// play alert sound
function newMessageAlert() {
  const audio = new Audio(notificationMP3);
  window.focus();
  audio.play().catch((err) => {
    console.log(err);
  });
}

let pusher = null;

function App(props) {
  const isIframe = window.location !== window.parent.location;
  const [chatClosed, setChatClosed] = useState(isIframe);
  const [showPrompt, setShowPrompt] = useState(false);
  const [composeMessageValue, setComposeMessageValue] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [formError, setFormError] = useState('');
  const [conversation, setConversation] = useState({});
  const [storedConversationID, setStoredConversationID] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [smsOptInSubmitting, setSmsOptInSubmitting] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [typingIndicatorDisabled, setTypingIndicatorDisabled] = useState(false);

  useEffect(() => {
    // check to see if token is in storage
    const jwt = accessToken;
    if (jwt && storedConversationID) {
      setAccessToken(jwt);
      loadConversation(jwt);
    }

  }, [accessToken, storedConversationID]);

  useEffect(() => {
    if (window.addEventListener) {
      // For standards-compliant web browsers
      window.addEventListener("message", displayMessage, false);
    }
    else {
      window.attachEvent("onmessage", displayMessage);
    }

    // send message to parent to store jwt in local storage
    const msg = JSON.stringify({'action': "get_stu_jwt"});
    window.parent.postMessage(msg, "*");

    setTimeout(function() {
      handleEnableChatPrompt();
    }, 1000);
  }, []);

  function reloadConversation() {
    const jwt = accessToken;
    if (jwt) {
      setAccessToken(jwt);
      loadConversation(jwt);
    }
  }

  function getLocalStorage(key) {
    return localStorage.getItem(key);
  }

  function displayMessage(e) {
    let key = e.message ? "message" : "data";
    let data = e[key];

    try {
      data = JSON.parse(data);
    } catch(e) {
      return;
    }

    if (data.action === "stu_jwt") {
      let messageData = {};
      if (data.data && data.data.conversationID) {
        messageData = data.data;
      } else {
        messageData = JSON.parse(data.data);
      }
      setStoredConversationID(messageData.conversationID);
      setAccessToken(messageData.token);
    }
  }

  function setLocalStorage(key, value, action) {
    const msg = JSON.stringify({'action': action, 'key': key, 'value': value});
    window.parent.postMessage(msg, "*")
  }

  function onStartChatFormSubmit(values) {
    handleInvalidToken();
    setIsSubmitting(true);
    const requestData = {uid: props.uid, name: values.name, captchaToken: values.captchaToken, clientIdentifier: clientIdentifier};
    fetch(apiURL + 'initializeConversation/', {
      method: "POST",
      withCredentials: true,
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => Promise.all([response, response.json()]))
      .then(([response, json]) => {
        if (response.status < 200 || response.status >= 300) {
          let error = new Error(json.message);
          error.response = response;
          throw error;
        }
        setMessages([]);
        setIsSubmitting(false);
        setConversation(json.data.conversation);
        setAccessToken(json.data.token);

        // send message to parent to store jwt in local storage
        const msg = JSON.stringify({'action': "set_stu_jwt", 'data': {token: json.data.token, conversationID: json.data.conversation.id}});
        window.parent.postMessage(msg, "*");

        //loadConversation(json.data.token, json.data.conversationID)
      })
      .catch(function(ex) {
        setIsSubmitting(false);
        setFormError(ex.message);
      });
  }

  function smsOptIn(contactMethod, value)
  {
    // contactMethod should be (sms, call, or email)
    if (! value) {
      value = '';
    }
    setSmsOptInSubmitting(true);
    const requestData = {conversationID: conversation.id, value: value, contactMethod: contactMethod};
    fetch(apiURL + 'smsOptIn/', {
      method: "POST",
      withCredentials: true,
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => Promise.all([response, response.json()]))
      .then(([response, json]) => {
        if (response.status < 200 || response.status >= 300) {
          let error = new Error(json.message);
          error.response = response;
          throw error;
        }

        setSmsOptInSubmitting(false);
        setConversation(json.data.conversation);

      })
      .catch(function(ex) {
        console.log(ex);
        setSmsOptInSubmitting(false);
      });
  }

  function setConversationToClosed()
  {
    if (!conversation.id) {
      return;
    }
    const requestData = {conversationID: conversation.id};
    fetch(apiURL + 'setConversationToClosed/', {
      method: "POST",
      withCredentials: true,
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => Promise.all([response, response.json()]))
      .then(([response, json]) => {
        if (response.status < 200 || response.status >= 300) {
          let error = new Error(json.message);
          error.response = response;
          throw error;
        }
        setConversation(json.data.conversation);
      })
      .catch(function(ex) {

      });
  }

  function sendMessageToSoTellUs(text, tempID) {
    const requestData = {clientIdentifier: clientIdentifier, conversationID: conversation.id, body: text};
    fetch(apiURL + 'messages/', {
      method: "POST",
      withCredentials: true,
      headers: {
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
      .then(response => Promise.all([response, response.json()]))
      .then(([response, json]) => {
        if (response.status < 200 || response.status >= 300) {
          let error = new Error(json.message);
          error.response = response;
          throw error;
        }
      })
      .catch(function(ex) {
        let updatedMessages = [];

        setMessages((state) => {
          updatedMessages = [...state];
          return state;
        });
        const foundIndex = updatedMessages.findIndex(x => x.id === tempID);
        updatedMessages[foundIndex].error = true;
        setMessages(updatedMessages);
      });

  }

  // if token is invalid clear localStorage and refresh window
  function handleInvalidToken() {
    localStorage.removeItem('stu_jwt');
    setStoredConversationID(null);
    setAccessToken('');
  }

  function loadConversation(jwt, conversationID) {
    conversationID = storedConversationID;
    if (conversationID) {
      conversationID = conversationID;
    }

    if (!conversationID) {
      return false;
    }

    setIsLoadingConversation(true);
    fetch(apiURL + 'messages/?conversationID=' + conversationID, {
      method: "GET",
      withCredentials: true,
      headers: {
        'Authorization': 'Bearer ' + jwt,
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then(response => {
        setIsLoadingConversation(false);
        setConversation(response.data.conversation);
        setMessages(messages => [...messages, ...response.data.messages]);
        // set up pusher
        Pusher.logToConsole = false;
        pusher = new Pusher('a3105b52df63262dc19e', {
          cluster: 'us3',
          authEndpoint: apiURL + 'pusherAuthentication/',
          auth: {
            headers: {
              Authorization: 'Bearer ' + jwt,
            }
          }
        });

        let channel = pusher.subscribe(response.data.conversation.channel_name);
        channel.bind('new-message', function(data) {
          if (data.clientIdentifier === clientIdentifier) {
            return false;
          }
          newMessageAlert();
          setChatClosed(false);
          setShowTypingIndicator(false);
          setMessages(messages => [...messages, {id: Date.now(), sent_by_contact: data.sent_by_contact, body: data.body, sent: data.sent}]);
        });

        channel.bind('conversation-accepted', function(data) {
          setConversation(data);
          setChatClosed(false);
        });

        channel.bind('conversation-closed', function(data) {
          setConversation(data.conversation);
        });

        channel.bind('client-typing', function(data) {
          setChatClosed(false);
          setShowTypingIndicator(true);
          setTimeout(() => {
            setShowTypingIndicator(false);
          }, 4000);
        });
      })
      .catch((err) => {
        handleInvalidToken();
      });
  }

  function closeChatPrompt() {
    handleDisableChatPrompt();
  }

  function handleDisableChatPrompt() {
    setShowPrompt(false);
    const msg = JSON.stringify({'action': "minimize"});
    localStorage.setItem('stu_chat_prompt_disabled', '1');

    window.parent.postMessage(msg, "*");
  }

  function handleEnableChatPrompt() {
    const promptDisabled = localStorage.getItem('stu_chat_prompt_disabled')
    if (promptDisabled) {
      return;
    }

    // ignore if chat window is open
    let updatedState
    setChatClosed(currentState=>{    // Do not change the state by get the updated state
      updatedState = currentState;
      return currentState
    })
    if (updatedState === false) {
      return;
    }
    const msg = JSON.stringify({'action': "show_chat_prompt"});
    window.parent.postMessage(msg, "*");
    setShowPrompt(true);
  }

  function handleComposeMessageChange(e) {
    setComposeMessageValue(e.target.value);

    if (typingIndicatorDisabled === false) {
      const channel = pusher.subscribe(conversation.channel_name);
      channel.trigger('client-typing', { id: conversation.id });

      setTypingIndicatorDisabled(true);
      setTimeout(() => {
        setTypingIndicatorDisabled(false);
      }, 4000)
    }
  }

  function handleNewMessage() {
    if (composeMessageValue.length) {
      const tempID = Date.now();
      setMessages([...messages, {id: tempID, sent_by_contact: true, body: composeMessageValue, sent: moment().unix()}]);
      setComposeMessageValue('');
      sendMessageToSoTellUs(composeMessageValue, tempID);
    }
  }

  function handleChatWindowToggle(closeChat) {
    setChatClosed(closeChat);
    handleDisableChatPrompt();
  }

  if (!isIframe) {
    return (<p style={{textAlign: "center"}}>Not authorized.</p>);
  }

  return (
    <div>
      {showPrompt && <ChatPrompt closeChatPrompt={closeChatPrompt} handleChatWindowToggle={handleChatWindowToggle} />}
      <ChatWindow
        handleNewMessage={handleNewMessage}
        messages={messages}
        composeMessageValue={composeMessageValue}
        handleComposeMessageChange={handleComposeMessageChange}
        handleChatWindowToggle={handleChatWindowToggle}
        chatClosed={chatClosed}
        isIframe={isIframe}
        accessToken={accessToken}
        onStartChatFormSubmit={onStartChatFormSubmit}
        isSubmitting={isSubmitting}
        isLoadingConversation={isLoadingConversation}
        formError={formError}
        conversation={conversation}
        reloadConversation={reloadConversation}
        smsOptIn={smsOptIn}
        smsOptInSubmitting={smsOptInSubmitting}
        setConversationToClosed={setConversationToClosed}
        handleInvalidToken={handleInvalidToken}
        showTypingIndicator={showTypingIndicator}
        widgetConfig={props.widgetConfig}

      />
      {isIframe ? <ChatToggle handleChatWindowToggle={handleChatWindowToggle} chatClosed={chatClosed} /> : null }
    </div>
  );
}

export default App;
