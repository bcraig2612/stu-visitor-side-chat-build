import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  chatPrompt: {
    position: "fixed !important",
    bottom: "80px",
    right: "10px",
    "&::after": {
      content: '""',
      width: "20px",
      height: "20px",
      position: "absolute",
      bottom: "-6px",
      right: "18px",
      background: "#fff",
      borderRadius: "4px",
      transform: "rotate(45deg)",
    }
  },
  chatPromptBubble: {
    padding: "20px",
    borderRadius: "13px",
    fontSize: "1.1em",
    cursor: "pointer",
  },
  closeAction: {
    position: "absolute",
    bottom: "50px",
    right: "0"
  }
});

export default useStyles;