import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import Input from "../../shared/components/FormElement/Input";
import Button from "../../shared/components/FormElement/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./PlaceForm.css";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ImageUpload from "../../shared/components/FormElement/ImageUpload";

const NewPlace = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { isLoading, sendRequest, error, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      description: {
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
  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formdata = new FormData();
      formdata.append("title", formState.inputs.title.value);
      formdata.append("description", formState.inputs.description.value);
      formdata.append("address", formState.inputs.address.value);
      formdata.append("creator", auth.userId);
      formdata.append("image", formState.inputs.image.value);

      await sendRequest("http://localhost:5000/api/places", "POST", formdata);
      history.push("/");
    } catch (error) {}
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          type="text"
          label="Title"
          element="input"
          errorText="Please input a valid title"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <Input
          id="address"
          type="text"
          label="Address"
          element="input"
          errorText="Please input a valid address"
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <Input
          id="description"
          type="text"
          label="Description"
          element="textarea"
          errorText="Please input a valid description (at least 5 char.)"
          validators={[VALIDATOR_MINLENGTH(5)]}
          onInput={inputHandler}
        />
        <ImageUpload
          onInput={inputHandler}
          id="image"
          errorText="Please provide an image(not more than 5MB)"
        />
        <Button disabled={!formState.isValid} type="submit">
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
