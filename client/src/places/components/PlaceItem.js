import React, { useContext, useState } from "react";
import "./PlaceItem.css";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElement/Button";
import Modal from "../../shared/components/UIElements/Modal";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Map from "../../shared/components/UIElements/Map";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const PlaceItem = (props) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => {
    setShowMap(true);
  };
  const closeMapHandler = () => {
    setShowMap(false);
  };
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const cancleDeleteHandler = () => {
    setShowConfirmModal(false);
  };
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: "Bearer" + auth.token }
      );
      props.onDelete(props.id);
    } catch (error) {}
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancle={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map zoom={15} center={props.coordinates} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancle={cancleDeleteHandler}
        footer={
          <>
            <Button inverse onClick={cancleDeleteHandler}>
              CANCLE
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
        header="Are you sure?"
        footerClass="place-item__modal-actions"
      >
        <p>
          Do you want to proceed and delete this place? please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <li className="place-item">
        {!isLoading && (
          <Card className="place-item__content">
            <div className="place-item__image">
              <img src={props.image} alt={props.title} />
            </div>
            <div className="place-item__info">
              <h2>{props.title}</h2>
              <h3>{props.address}</h3>
              <p>{props.description}</p>
            </div>
            <div className="place-item__actions">
              <Button inverse onClick={openMapHandler}>
                VIEW ON MAP
              </Button>
              {auth.userId === props.creatorId && (
                <>
                  <Button to={`/places/${props.id}`} exact>
                    EDIT
                  </Button>
                  <Button danger onClick={showDeleteWarningHandler}>
                    DELETE
                  </Button>
                </>
              )}
            </div>
          </Card>
        )}
      </li>
    </>
  );
};

export default PlaceItem;
