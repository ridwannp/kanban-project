import React from "react";
import { useDrop } from "react-dnd";
import DraggableProject from "../Dashboard/DraggableProject";
import { Card } from "react-bootstrap";
import { db } from "../../services/firebase";
import { doc, updateDoc } from "firebase/firestore";

const Column = ({ category, projects, setProjects, onProjectClick }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "PROJECT",
    drop: (item) => moveProject(item.id, category),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
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
          <DraggableProject
            key={project.taskId}
            project={project}
            onClick={() => onProjectClick(project)}
          />
        ))}
    </div>
  );
};

export default Column;
