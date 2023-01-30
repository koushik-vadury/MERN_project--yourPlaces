import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
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

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const userId = useParams().userId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (error) {}
    };
    fetchData();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (id) => {
    setLoadedPlaces((prePlaces) =>
      prePlaces.filter((place) => place.id !== id)
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner onOverlay />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </>
  );
};

export default UserPlaces;
