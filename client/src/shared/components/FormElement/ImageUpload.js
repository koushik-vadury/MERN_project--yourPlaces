import React, { useRef, useState, useEffect } from "react";
import "./ImageUpload.css";
import Button from "../FormElement/Button";

const ImageUpload = (props) => {
  const filePickerRef = useRef();

  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState(false);

  const pickImageHandler = () => {
    filePickerRef.current.click();
    setTouched(true);
  };

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    console.log(event.target.files[0]);
    let pickedFile;
    let fileIsValid;
    if (
      event.target.files[0].type.includes("image/") &&
      event.target.files[0].size <= 5242880
    ) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setFile();
      setPreviewUrl();
      setIsValid(false);
      fileIsValid = false;
    }

    props.onInput(props.id, pickedFile, fileIsValid);
  };
  return (
    <div className="form-control">
      <input
        ref={filePickerRef}
        type="file"
        id={props.id}
        accept=".jpg,.png,.jpeg"
        style={{ display: "none" }}
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && `center`}`}>
        <div className="image-upload__preview">
          {!previewUrl && <p>Please Pick An Image</p>}
          {previewUrl && <img src={previewUrl} alt="preview" />}
        </div>
        <Button type="button" onClick={pickImageHandler} size="small">
          PICK IMAGE
        </Button>
      </div>
      {!isValid && touched && <p className="error">{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
