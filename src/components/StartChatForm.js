import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { ReCaptcha } from "./Recaptcha";
import useStyles from "./styles/StartChatForm.styles";
import { Button, Link } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

function StartChatForm(props) {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [validationEmail, setValidationEmail] = useState("");
  const [token, setToken] = useState("");

  const { handleSubmit, register, errors, setValue } = useForm({
    mode: "onChange",
  });

  const onSubmit = (values) => {
    props.onStartChatFormSubmit(values);
    setToken("");
  };

  const handleValidationEmailChange = (event) => {
    setValidationEmail(event.target.value);
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const onVerifyCaptcha = (token) => {
    setValue("captchaToken", token);
  };

  useEffect(() => {
    register({ name: "captchaToken" }, { required: true });
  });

  return (
    <div className={classes.startChatForm}>
      <p>Fill out the form to start chatting!</p>
      <ValidatorForm onSubmit={handleSubmit(onSubmit)}>
        <TextValidator
          inputProps={{ name: "name", maxLength: 70 }}
          inputRef={register}
          onChange={handleNameChange}
          label="Name"
          value={name}
          id="outlined-basic"
          name="name"
          fullWidth={true}
          className={classes.chatFormInput}
          variant="outlined"
          validators={["required"]}
          errorMessages={["Please enter your name."]}
          aria-invalid={errors.name ? "true" : "false"}
        />
        { !props.validationEmail ?
        <TextValidator
          inputRef={register}
          onChange={handleValidationEmailChange}
          label="Email"
          value={validationEmail}
          id="validationEmail"
          name="validationEmail"
          fullWidth={true}
          className={classes.chatFormInput}
          variant="outlined"
          validators={["required", "isEmail"]}
          errorMessages={[
            "Please enter your email address.",
            "Email is not valid.",
          ]}
          aria-invalid={errors.validationEmail ? "true" : "false"}
        />
        : ""}
        <ReCaptcha
          token={token}
          setToken={setToken}
          onVerifyCaptcha={onVerifyCaptcha}
        />

        <Button
          disabled={props.isSubmitting || token === ""}
          type="submit"
          size="large"
          fullWidth={true}
          variant="contained"
          color="primary"
        >
          {props.isSubmitting ? "Loading.." : "Start Chat"}
        </Button>
        {props.formError && (
          <Alert severity="error" style={{ width: "100%", marginTop: "10px" }}>
            {props.formError}
          </Alert>
        )}
        <p className={classes.recaptchaText}>
          This site is protected by reCAPTCHA and the Google&nbsp;
          <Link href="https://policies.google.com/privacy" target="_blank">
            Privacy Policy&nbsp;
          </Link>
          and&nbsp;
          <Link href="https://policies.google.com/terms" target="_blank">
            Terms of Service&nbsp;
          </Link>
          apply.
        </p>
      </ValidatorForm>
    </div>
  );
}

export default StartChatForm;
