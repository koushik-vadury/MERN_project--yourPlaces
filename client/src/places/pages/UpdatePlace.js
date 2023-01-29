import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Button from "../../shared/components/FormElement/Button";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElement/Input";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import "./PlaceForm.css";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
// const PLACES = [
//   {
//     id: "p1",
//     title: "Empire State Building",
//     description:
//       "The Empire State Building is one of the tallest buildings in the world and the United States.",
//     image:
//       "https://images.pexels.com/photos/2190283/pexels-photo-2190283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     address: "20 W 34th St., New York, NY 10001, USA",
//     creator: "u1",
//     location: {
//       lat: "40.7484405",
//       lng: "-7398584",
//     },
//   },
//   {
//     id: "p2",
//     title: "Empire State Building",
//     description:
//       "The Empire State Building is one of the tallest buildings in the world and the United States.",
//     image:
//       "https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     address: "Gohail road sutrapur, Bogura",
//     creator: "u1",
//     location: {
//       lat: "40.7484405",
//       lng: "-7398584",
//     },
//   },
//   {
//     id: "p3",
//     title: "Empire State Building",
//     description:
//       "The Empire State Building is one of the tallest buildings in the world and the United States.",
//     image:
//       "https://images.pexels.com/photos/164988/pexels-photo-164988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     address: "20 W 34th St., New York, NY 10001, USA",
//     creator: "u2",
//     location: {
//       lat: "40.7484405",
//       lng: "-7398584",
//     },
//   },
// ];
const UpdatePlace = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const placeId = useParams().placeId;
  const [loadedPlace, setloadedPlace] = useState();
  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        setloadedPlace(responseData.place);
        setFormData(
          {
            title: {
              value: responseData.place.title,
              isValid: true,
            },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (error) {}
    };

    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (!loadedPlace && !isLoading && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      console.table(formState.inputs);
      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push(`/${auth.userId}/places`);
    } catch (error) {}
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            label="Title"
            errorText="Please enter a valid title"
            initialValue={formState.inputs.title.value}
            validators={[VALIDATOR_REQUIRE()]}
            initialValid={formState.inputs.title.isValid}
            type="text"
            onInput={inputHandler}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            errorText="Please enter a valid description (minimum 5 char.)"
            initialValue={formState.inputs.description.value}
            validators={[VALIDATOR_MINLENGTH(5)]}
            initialValid={formState.inputs.description.isValid}
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
