import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  header: props => ({
    width: '100%',
    padding: '10px',
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    borderTopLeftRadius: props.isIframe ? "4px" : "0",
    borderTopRightRadius: props.isIframe ? "4px" : "0",
    justifyContent: "flex-end"
  }),
  chatWindow: props => ({
    position: "fixed",
    bottom: props.isIframe ? "10px" : "0",
    right: props.isIframe ? "10px" : "0",
    boxShadow: "0 1px 1px rgba(0,0,0,0.11), 0 2px 2px rgba(0,0,0,0.11), 0 4px 4px rgba(0,0,0,0.11), 0 6px 8px rgba(0,0,0,0.11), 0 8px 16px rgba(0,0,0,0.11)",
    borderRadius: props.isIframe ? "4px" : "0",
    maxHeight: props.isIframe ? "calc(100% - 20px)" : "100%",
    maxWidth: "100%",
    height: props.isIframe ? "508px" : "100%",
    width: props.isIframe ? "286px" : "100%",
    zIndex: "2000",
    display: "flex",
    flexDirection: "column",
    background: "#fff",
  }),
  headerAction: {
    cursor: "pointer",
    marginLeft: "10px"
  },
  title: {
    marginRight: "auto",
    ...theme.typography.button,
    display: "flex",
    alignItems: "center"
  }
}));

export default useStyles;