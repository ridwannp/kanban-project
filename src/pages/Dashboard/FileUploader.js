import React, { useState } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { uploadTelegram } from "../../services/firebase";

const FileUploader = ({ selectedProject }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVariant, setAlertVariant] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setAlertMsg("Pilih file terlebih dahulu!");
      setAlertVariant("warning");
      return;
    }

    try {
      setIsLoading(true);
      setAlertMsg(""); // clear alert sebelum mulai
      await uploadTelegram(file, selectedProject);
      setAlertMsg("Upload berhasil!");
      setAlertVariant("success");
      setFile(null); // reset file input kalau mau
    } catch (error) {
      console.error("Upload gagal:", error);
      setAlertMsg("Upload gagal. Silakan coba lagi.");
      setAlertVariant("danger");
    } finally {
      setIsLoading(false);
    }
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

      {alertMsg && (
        <Alert variant={alertVariant} className="mt-3">
          {alertMsg}
        </Alert>
      )}

      <div className="mt-3">
        <Button onClick={handleUpload} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Mengupload...
            </>
          ) : (
            "Upload"
          )}
        </Button>
      </div>
    </div>
  );
};

export default FileUploader;
