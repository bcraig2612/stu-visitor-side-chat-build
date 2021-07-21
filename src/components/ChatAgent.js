import React from 'react';
import useStyles from './styles/ChatAgent.styles';
import StyledBadge from './styles/ChatAgent.StyledBadge.styles';
import Avatar from '@material-ui/core/Avatar';

export default function ChatAgent(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <StyledBadge
        overlap="circle"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        variant="dot"
      >
        <Avatar>{props.displayName.charAt(0)}</Avatar>
      </StyledBadge>
      <div style={{marginLeft: "10px"}}>{props.displayName}</div>
    </div>
  );
}