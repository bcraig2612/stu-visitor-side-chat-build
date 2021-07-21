import { makeStyles } from "@material-ui/core/styles";

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
  chatFormInput: {
    marginBottom: "10px"
  },
  recaptchaText: {
    fontSize: ".9em",
    color: "#585858"
  }
}));

export default useStyles;