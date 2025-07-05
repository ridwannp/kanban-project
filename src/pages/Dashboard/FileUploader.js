import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { uploadToFirestore, uploadTelegram } from "../../services/firebase";

import { doc, addDoc, collection } from "firebase/firestore";

const FileUploader = ({ selectedProject }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [projectId, setProjectId] = useState("");

  const handleUpload = async () => {
    if (!file) {
      alert("Pilih file terlebih dahulu!");
      return;
    }
    await uploadTelegram(file, selectedProject);
  };
  return (
    <div>
      <Form.Group>
        <Form.Label>Upload File (Gambar/PDF/Video)</Form.Label>
        <Form.Control
          type="file"
          accept="image/*,application/pdf,video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </Form.Group>
      <div className="mt-3">
        <Button onClick={handleUpload}>Upload</Button>
      </div>
    </div>
  );
};

export default FileUploader;
