import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme) => ({
  message: props => ({
    marginBottom: "10px",
    maxWidth: "90%",
    width: "auto",
    display: "inline-block",
    alignSelf: "flex-start",
    overflowWrap: "break-word",
    color: "#333",
    backgroundColor: "rgb(244, 246, 249)",
    borderRadius: "26px 26px 26px 3px",
    padding: "12px 20px",
  }),
  conversationItem: props => ({
    textAlign: "left",
    width: "100%",
    position: "relative",
    marginBottom: "10px",
  }),
  bubble: props => ({
    textAlign: "left",
    color: "#333",
    backgroundColor: "rgb(244, 246, 249)",
    borderRadius: "26px 26px 26px 3px",
    padding: "12px 20px",
    display: "flex",
    maxWidth: "54%",
    overflowWrap: "break-word",
    lineHeight: "1.4",
    fontSize: "14px",
    position: "relative",
    marginBottom: "3px",
    width: "70px",
    alignItems: "center",
    justifyContent: "center"
  }),
}));

function TypingIndicator(props) {
  const classes = useStyles(props);

  return (
    <div className={classes.conversationItem}>
      <Skeleton variant="rect" className={classes.bubble}><MoreHorizIcon style={{visibility: "visible"}} /></Skeleton>
    </div>
  );
}

export default TypingIndicator;