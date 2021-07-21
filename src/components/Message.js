import React from 'react';
import moment from "moment";
import Linkify from 'react-linkify';
import useStyles from './styles/Message.styles';

function Message(props) {
  const classes = useStyles(props);
  let sent = moment.unix(props.message.sent);
  sent = sent.local().calendar();

  return (
    <div className={classes.conversationItem}>
      <div className={classes.bubble}>
        <Linkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <a target="_blank" href={decoratedHref} key={key}>
              {decoratedText}
            </a>
          )}
        >
        {props.message.body.split('\n').map(function(item, key) {
          return (
            <span key={key}>
                {item}
              <br/>
            </span>
          )
        })}
        </Linkify>
      </div>
      <div className={classes.timeStamp}>{props.message.error ? 'Error sending message' : sent}</div>
    </div>
  );
}

export default Message;