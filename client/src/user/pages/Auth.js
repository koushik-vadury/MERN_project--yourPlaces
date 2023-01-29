import React, { useState } from "react";
import { useContext } from "react";
import Button from "../../shared/components/FormElement/Button";
import Input from "../../shared/components/FormElement/Input";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./Auth.css";
import "../../shared/components/UIElements/LoadingSpinner.css";
import ImageUpload from "../../shared/components/FormElement/ImageUpload";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [formState, inputHandler, setFormData] = useForm({}, false);
  const [isLogInMode, setIsLogInMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);
    if (isLogInMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );
        auth.login(responseData.user.id);
      } catch (error) {}
    } else {
      try {
        const formData = new FormData();

        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData
        );
        auth.login(responseData.user.id);
      } catch (error) {}
    }
  };

  const switchModeHandler = () => {
    if (!isLogInMode) {
      setFormData(
        { ...formState.inputs, name: undefined, image: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLogInMode((preMove) => !preMove);
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />

      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}

        <h2>{isLogInMode ? `Login` : `Signup`} Required</h2>

        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLogInMode && (
            <>
              <Input
                element="input"
                id="name"
                type="text"
                label="Your Name"
                errorText="Please enter a valid name"
                validators={[VALIDATOR_REQUIRE()]}
                onInput={inputHandler}
              />
              <ImageUpload
                id="image"
                center
                onInput={inputHandler}
                errorText="Please provide an image(not more than 5MB)"
              />
            </>
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-mail"
            errorText="Please enter a valid email address"
            validators={[VALIDATOR_EMAIL()]}
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            errorText="Please enter a valid password(minimun 5 char.)"
            validators={[VALIDATOR_MINLENGTH(5)]}
            onInput={inputHandler}
          />
          <Button disabled={!formState.isValid} type="submit">
            {isLogInMode ? "LOGIN" : "SIGNUP"}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLogInMode ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
