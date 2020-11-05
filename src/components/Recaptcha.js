import React from 'react';
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha
} from 'react-google-recaptcha-v3';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const CaptchaButton = ({ onVerifyCaptcha, token, setToken }) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const clickHandler = async () => {
    if (!executeRecaptcha) {
      return;
    }

    const token = await executeRecaptcha('start_chat');
    setToken(token);
    onVerifyCaptcha(token);
  };

  return (
    <div style={{textAlign:"center"}}>
      <FormControlLabel
        control={<Checkbox color="primary" checked={token !== ""} onChange={clickHandler} />}
        label="I am not a robot."
      />
    </div>
  );
};

export const ReCaptcha = ({ onVerifyCaptcha, token, setToken }) => (
  <GoogleReCaptchaProvider
    reCaptchaKey="6LfHnd4ZAAAAAOP6lFUw8m3yAxBA-OSTex1wRIGR"
  >
    <CaptchaButton token={token} setToken={setToken} onVerifyCaptcha={onVerifyCaptcha} />
  </GoogleReCaptchaProvider>
);