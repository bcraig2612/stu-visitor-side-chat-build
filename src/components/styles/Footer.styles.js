import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  footer: {
    display: "flex",
    padding: "10px",
    background: "#fff",
    alignItems: "center"
  },
  composeMessage: {
    flex: "1"
  }
}));

export default useStyles;