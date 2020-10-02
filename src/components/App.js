import React, {useEffect, useState} from 'react';
import Pusher from 'pusher-js';
import moment from "moment";

import ChatWindow from './ChatWindow';
import ChatToggle from './ChatToggle';
import postData from "../utils/postData";
import notificationMP3 from "../notification.mp3";

// this will identify the client we are on
// so we don't show duplicate messages from pusher
const clientIdentifier = Date.now();
const apiURL = 'http://localhost:9000/';

// play alert sound
function newMessageAlert() {
  const audio = new Audio(notificationMP3);
  audio.play();
}

function App() {
  const isIframe = window.location !== window.parent.location;
  const [chatClosed, setChatClosed] = useState(isIframe);
  const [composeMessageValue, setComposeMessageValue] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [channelName, setChannelName] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);

  // connect to pusher
  useEffect(() => {
    // check to see if token is in storage
    const jwt = getLocalStorage();
    if (jwt) {
      console.log('Token was in storage: ' + jwt);
      setAccessToken(jwt);
      loadConversation(jwt);
    }

  }, []);

  function getLocalStorage() {
    return localStorage.getItem('stu_jwt');
  }

  function setLocalStorage(key, value, action) {
    // if (isIframe) {
    //   const msg = JSON.stringify({'action': action, 'key': key, 'value': value});
    //   window.parent.postMessage(msg, "*")
    //   return;
    // }
    localStorage.setItem(key, value);
  }

  function onStartChatFormSubmit(values) {
    setIsSubmitting(true);

    postData(apiURL + 'api/create_conversation.php', {name: values.name, phone_number: values.phone_number, message: values.message, clientIdentifier: clientIdentifier})
      .then(data => {
        setIsSubmitting(false);

        if (data.error) {
          return false;
        }
        setLocalStorage('stu_jwt', data.token, 'set_stu_jwt');
        setAccessToken(data.token);
        setChannelName(data.channel_name);
        loadConversation(data.token);
      });
  }

  function sendMessageToSoTellUs(text) {
    postData(apiURL + 'api/pusher.php', {jwt: accessToken, body: text, clientIdentifier: clientIdentifier, sent_by_visitor: 1 })
      .then(data => {
        console.log(data); // JSON data parsed by `data.json()` call
        if (data.error && data.errorType === 'INVALID_TOKEN') {
          handleInvalidToken();
        }
      });
  }

  // if token is invalid clear localStorage and refresh window
  function handleInvalidToken() {
    localStorage.clear();
    window.location.reload();
  }

  function loadConversation(jwt) {
    setIsLoadingConversation(true);
    postData(apiURL + 'api/get_conversation.php', {jwt: jwt })
      .then(data => {
        // check for errors
        if (data.errorType === 'INVALID_TOKEN') {
          handleInvalidToken();
          setIsLoadingConversation(false);
          return;
        }

        setIsLoadingConversation(false);

        setChannelName(data.conversation.channel_name);
        setMessages(messages => [...messages, ...data.messages]);

        // set up pusher
        Pusher.logToConsole = true;
        const pusher = new Pusher('66e7f1b4416d81db9385', {
          cluster: 'us3'
        });

        let channel = pusher.subscribe(data.conversation.channel_name);
        channel.bind('new-message', function(data) {
          if (data.clientIdentifier === clientIdentifier) {
            return false;
          }
          console.log(data);
          newMessageAlert();
          setChatClosed(false);
          setMessages(messages => [...messages, {id: Date.now(), sent_by_visitor: data.sent_by_visitor, body: data.body, sent: data.sent}]);
        });

      });
  }

  function handleComposeMessageChange(e) {
    setComposeMessageValue(e.target.value);
  }

  function handleNewMessage() {
    if (composeMessageValue.length) {
      setMessages([...messages, {id: Date.now(), sent_by_visitor: true, body: composeMessageValue, sent: moment()}]);
      setComposeMessageValue('');
      sendMessageToSoTellUs(composeMessageValue);
    }
  }

  function handleChatWindowToggle(closeChat) {
    setChatClosed(closeChat);
  }

  return (
    <div>
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
      />
      {isIframe ? <ChatToggle handleChatWindowToggle={handleChatWindowToggle} chatClosed={chatClosed} /> : null }
    </div>
  );
}

export default App;
