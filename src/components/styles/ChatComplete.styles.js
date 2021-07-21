import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  startChatForm: {
    flex: "1",
    backgroundColor: "#fff",
    padding: "10px",
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  waitingText: {
    fontSize: "1.1em",
    textAlign: "center"
  }
}));

export default useStyles;