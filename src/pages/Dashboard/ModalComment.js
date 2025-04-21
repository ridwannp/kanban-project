import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  ListGroup,
  Badge,
  Stack,
  Tab,
  Tabs,
} from "react-bootstrap";
import { db } from "../../services/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../../services/AuthContext";
import FileUploader from "../Dashboard/FileUploader";

const ModalComment = ({ selectedProject, setSelectedProject, taskId }) => {
  const { currentUser } = useAuth();
  const [key, setKey] = useState("home");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [projectInfo, setProjectInfo] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!selectedProject) return;

    const q = query(
      collection(db, "comments"),
      where("projectId", "==", selectedProject.taskId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(
        snapshot.docs.map((doc) => ({ id: doc.taskId, ...doc.data() }))
      );
    });

    const fetchProjectInfo = async () => {
      const docRef = doc(db, "task", taskId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProjectInfo(docSnap.data());
      }
    };

    fetchProjectInfo();

    return () => unsubscribe();
  }, [selectedProject]);

  const handleAddComment = async () => {
    if (comment.trim() === "") return;
    const newComment = {
      projectId: selectedProject.taskId,
      text: comment,
      userEmail: currentUser.email,
      timestamp: new Date(),
      image: image || "",
    };
    await addDoc(collection(db, "comments"), newComment);
    setComments([...comments, newComment]);
    setComment("");
  };

  const handleApprove = async () => {
    try {
      const projectRef = doc(db, "task", selectedProject.id);
      await updateDoc(projectRef, { status: "Done" });

      // Menambahkan data approval ke Firebase
      await addDoc(collection(db, "approval"), {
        taskId: selectedProject.id,
        approve: true,
        approvedAt: new Date(),
      });
    } catch (error) {
      console.error("Error approving project:", error);
    }
  };

  return (
    <Modal
      className="custom-modal"
      show={!!selectedProject}
      onHide={() => setSelectedProject(null)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Project: {projectInfo?.judul}</Modal.Title>
        <Stack className="m-3" direction="horizontal" gap={2}>
          <Badge className="p-2" bg="dark">
            Assign : {projectInfo?.assignedTo}
          </Badge>
          <Badge className="p-2 ml-2" bg="primary">
            Type : {projectInfo?.type}
          </Badge>
          <Badge className="p-2 ml-3" bg="danger">
            Deadline : {projectInfo?.deadline}
          </Badge>
        </Stack>
      </Modal.Header>
      <Modal.Body>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
          fill
        >
          <Tab eventKey="home" title="Komentar">
            {projectInfo && (
              <div className="mb-3">
                <ListGroup as="ol" numbered>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Judul Headline</div>
                      {projectInfo.judul}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Narasumber</div>
                      {projectInfo.narasumber}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Materi yang akan dipelajari</div>
                      {projectInfo.materi}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Tempat & Tanggal Acara</div>
                      {projectInfo.tempat}, {projectInfo.tanggal}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Benefit & Harga Promo</div>
                      {projectInfo.benefitHarga}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Giveaway</div>
                      {projectInfo.giveaway}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">
                        Info Link Pendaftaran & Contact
                      </div>
                      {projectInfo.pendaftaran}
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                  >
                    <div className="ms-2 me-auto">
                      <div className="fw-bold">Tambahan Komentar</div>
                      {projectInfo.komentar}
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </div>
            )}
            {comments.length > 0 ? (
              comments.map((c, index) => (
                <div key={index} className="mb-2 p-2 border rounded">
                  <strong>{c.userEmail}:</strong>
                  <p className="mb-1">{c.text}</p>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
            <Form.Group className="mt-3">
              <Form.Label>Add a Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
              />
            </Form.Group>
            <div className="mt-4">
              <Button variant="primary" onClick={handleAddComment}>
                Add Comment
              </Button>
            </div>
          </Tab>
          <Tab eventKey="upload" title="Upload">
            <FileUploader
              onFileUpload={(base64Image) => setImage(base64Image)}
              selectedProject={selectedProject}
            />
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setSelectedProject(null)}>
          Close
        </Button>
        {selectedProject?.status === "Review" &&
          currentUser?.role === "manager" && (
            <Button
              variant="primary"
              onClick={handleApprove}
              className="btn btn-success ms-2"
            >
              Approve
            </Button>
          )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComment;
