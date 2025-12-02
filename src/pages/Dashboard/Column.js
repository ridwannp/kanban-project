import React, { useState } from "react";
import { useDrop } from "react-dnd";
import DraggableProject from "../Dashboard/DraggableProject";
import { Button, Modal } from "react-bootstrap";
import { db } from "../../services/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

const Column = ({
  category,
  projects,
  setProjects,
  onProjectClick,
  onEditProject,
  userRole,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const [{ isOver }, drop] = useDrop({
    accept: "PROJECT",
    canDrop: (item) => {
      const { currentStatus } = item;
    
      // Rule 1: Todo → Progress → Review - hanya multimedia
      if ((category === "Progress" || category === "Review") && 
          (currentStatus === "Todo" || currentStatus === "Progress")) {
        return userRole === "multimedia";
      }
      
      // Rule 2: Review → Done - hanya sales atau manager
      if (category === "Done" && currentStatus === "Review") {
        return userRole === "sales" || userRole === "manager";
      }
      
      // Rule 3: Review → Todo - siapapun bisa
      if (category === "Todo" && currentStatus === "Review") {
        return true;
      }
      
      // Mencegah transisi yang tidak sesuai business logic
      return false;
    },
    drop: (item) => moveProject(item.id, category),
    collect: (monitor) => ({
      isOver: !!monitor.isOver() && !!monitor.canDrop(),
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
      className={`kanban-column ${isOver ? "is-over" : ""}`}
    >
      <div
        className="column-header"
        style={{
          backgroundColor: categoryColor[category] || "#6c757d",
        }}
      >
        <h5 className="m-0">{category}</h5>
      </div>
      
      <div className="column-content">
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
      </div>

      {/* Confirm Delete Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this project?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Column;
