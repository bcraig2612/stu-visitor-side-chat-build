import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  message: props => ({
    marginBottom: "10px",
    maxWidth: "90%",
    width: "auto",
    display: "inline-block",
    alignSelf: props.message.sent_by_visitor ? "flex-end" : "flex-start",
    overflowWrap: "break-word",
    color: props.message.sent_by_visitor ? "#fff" : "#333",
    backgroundColor: props.message.sent_by_visitor ? theme.palette.info.main : "rgb(244, 246, 249)",
    borderRadius: props.message.sent_by_visitor ? "26px 26px 3px 26px" : "26px 26px 26px 3px",
    padding: "12px 20px",
  }),
  conversationItem: props => ({
    textAlign: props.message.sent_by_visitor ? "right" : "left",
    width: "100%",
    position: "relative",
    marginBottom: "10px",
  }),
  bubble: props => ({
    textAlign: "left",
    color: props.message.sent_by_visitor ? "#fff" : "#333",
    backgroundColor: props.message.sent_by_visitor ? theme.palette.info.main : "rgb(244, 246, 249)",
    borderRadius: props.message.sent_by_visitor ? "26px 26px 3px 26px" : "26px 26px 26px 3px",
    padding: "12px 20px",
    display: "inline-block",
    maxWidth: "54%",
    overflowWrap: "break-word",
    lineHeight: "1.4",
    fontSize: "14px",
    position: "relative",
    marginBottom: "3px",
  }),
  timeStamp: {
    fontSize: "12px",
    lineHeight: "1.25",
    color: "rgb(99, 114, 125)",
    margin: "2px 0px 0px 1px",
  }
}));

function Message(props) {
  const classes = useStyles(props);
  let sent = moment.utc(props.message.sent);
  sent = sent.local().calendar();

  return (
    <div className={classes.conversationItem}>
      <div className={classes.bubble}>{props.message.body}</div>
      <div className={classes.timeStamp}>{sent}</div>
    </div>
  );
}

export default Message;