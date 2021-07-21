import React from 'react';
import useStyles from "./styles/TypingIndicator.styles";
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Skeleton from "@material-ui/lab/Skeleton";

function TypingIndicator(props) {
  const classes = useStyles(props);

  return (
    <div className={classes.conversationItem}>
      <Skeleton variant="rect" className={classes.bubble}><MoreHorizIcon style={{visibility: "visible"}} /></Skeleton>
    </div>
  );
}

export default TypingIndicator;