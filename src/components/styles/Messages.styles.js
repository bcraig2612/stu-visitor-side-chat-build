import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  messages: {
    flex: "1",
    backgroundColor: "#fff",
    padding: "10px",
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column"
  },
}));

export default useStyles;