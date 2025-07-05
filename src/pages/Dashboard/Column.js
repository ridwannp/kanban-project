import React, { useState } from "react";
import { useDrop } from "react-dnd";
import DraggableProject from "../Dashboard/DraggableProject";
import { Button, Modal } from "react-bootstrap";
import { db } from "../../services/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../../services/AuthContext";

const Column = ({
  category,
  projects,
  setProjects,
  onProjectClick,
  onEditProject,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const { currentUser } = useAuth();
  const userRole = currentUser.role;

  const [{ isOver }, drop] = useDrop({
    accept: "PROJECT",
    canDrop: () => userRole === "multimedia",
    drop: (item) => userRole === "multimedia" && moveProject(item.id, category),
    collect: (monitor) => ({
      isOver: userRole === "multimedia" && !!monitor.isOver(),
    }),
  });

  const moveProject = async (id, newCategory) => {
    const projectRef = doc(db, "task", id);
    await updateDoc(projectRef, { status: newCategory });
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, status: newCategory } : project
      )
    );
  };

  const handleDelete = async (id) => {
    const projectRef = doc(db, "task", projectToDelete);
    await deleteDoc(projectRef);
    setProjects((prev) => prev.filter((project) => project.id !== id));
    setShowModal(false);
  };

  const handleShowModal = (projectId) => {
    setProjectToDelete(projectId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProjectToDelete(null);
  };

  const handleEdit = (project) => {
    if (onEditProject) onEditProject(project);
  };

  const categoryColor = {
    Todo: "#FC4100",
    Progress: "#00215E",
    Review: "#FFA447",
    Done: "#337357",
  };

  return (
    <div
      ref={drop}
      className={`column p-3 rounded ${isOver ? "bg-light" : ""}`}
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "400px",
        borderRadius: "10px",
        boxShadow: isOver ? "0px 0px 10px rgba(0,0,0,0.2)" : "none",
      }}
    >
      <div
        style={{
          backgroundColor: categoryColor[category] || "#6c757d",
          color: "#fff",
          padding: "10px",
          borderRadius: "10px",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        <h5 className="text-center">{category}</h5>
      </div>
      {projects
        .filter((project) => project.status === category)
        .map((project) => (
          <div key={project.taskId} style={{ position: "relative" }}>
            <DraggableProject
              project={project}
              onClick={() => onProjectClick(project)}
              onDelete={handleShowModal}
              userRole={userRole}
              onEdit={() => handleEdit(project)}
            />
          </div>
        ))}
      {/* Confirm Delete Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Hapus</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah Anda yakin ingin menghapus project ini?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Batal
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Hapus
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Column;
