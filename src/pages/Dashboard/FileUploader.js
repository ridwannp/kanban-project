import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const FileUploader = ({ onFileUpload }) => {
  const [preview, setPreview] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setPreview(reader.result);
        onFileUpload(reader.result);
      };
    }
  };

  return (
    <div>
      <Form.Group>
        <Form.Label>Upload Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </Form.Group>
      {preview && (
        <div className="mt-2">
          <p>Preview:</p>
          <img src={preview} alt="preview" width="100" />
        </div>
      )}
    </div>
  );
};

export default FileUploader;
