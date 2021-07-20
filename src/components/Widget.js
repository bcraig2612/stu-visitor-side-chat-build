import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, useParams} from "react-router-dom";
import {ThemeProvider} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import App from "./App";
import createTheme from "@material-ui/core/styles/createTheme";

const apiURL = process.env.REACT_APP_API_URL;

export default function Widget(props) {
  const { uid } = useParams();
  const [widgetConfig, setWidgetConfig] = useState(null);

  const theme = createTheme({
    palette: {
      primary: {
        main: (widgetConfig && widgetConfig.color_chat) ? widgetConfig.color_chat : "#3f51b5",
      },
    },
  });

  useEffect(() => {
    getWidgetConfig(uid);
  }, [uid]);

  function getWidgetConfig(uid) {
    fetch(apiURL + 'widget/?uid=' + uid, {
      method: "GET"
    }).then(response => response.json())
      .then(response => {
        setWidgetConfig(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (!widgetConfig) {
    return null;
  }

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App uid={uid} widgetConfig={widgetConfig} />
      </ThemeProvider>
    </Router>
  );
}