import React, { useState } from "react";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { uploadTelegram } from "../../services/firebase";

const FileUploader = ({ selectedProject }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertVariant, setAlertVariant] = useState("");

  const MAX_PHOTO_SIZE = 20 * 1024 * 1024; // 20MB
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_DOC_SIZE = 50 * 1024 * 1024; // 50MB

  const handleUpload = async () => {
    if (!file) {
      setAlertMsg("Pilih file terlebih dahulu!");
      setAlertVariant("warning");
      return;
    }
    const fileType = file.type;

    if (fileType.startsWith("image/") && file.size > MAX_PHOTO_SIZE) {
      setAlertMsg("Gambar terlalu besar. Maksimum 20MB diperbolehkan.");
      setAlertVariant("danger");
      return;
    }

    if (fileType.startsWith("video/") && file.size > MAX_VIDEO_SIZE) {
      setAlertMsg("Video terlalu besar. Maksimum 50MB diperbolehkan.");
      setAlertVariant("danger");
      return;
    }

    // application/pdf or other document types
    if (
      (fileType === "application/pdf" || fileType.startsWith("application/")) &&
      file.size > MAX_DOC_SIZE
    ) {
      setAlertMsg("Dokumen terlalu besar. Maksimum 50MB diperbolehkan.");
      setAlertVariant("danger");
      return;
    }

    try {
      setIsLoading(true);
      setAlertMsg("");
      await uploadTelegram(file, selectedProject);
      setAlertMsg("Upload berhasil!");
      setAlertVariant("success");
      setFile(null);
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
