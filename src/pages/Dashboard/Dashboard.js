import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { addProject, db } from "../../services/firebase";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import {
  Col,
  Row,
  Button,
  Form,
  Modal,
  ButtonGroup,
  InputGroup,
} from "react-bootstrap";
import Column from "./Column";
import ModalComment from "../Dashboard/ModalComment";
import { useAuth } from "../../services/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const categories = ["Todo", "Progress", "Review", "Done"];
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filterAssignment, setFilterAssignment] = useState("");
  const [filterTitle, setFilterTitle] = useState("");
  const [sortPriority, setSortPriority] = useState("");
  const [isCustomEvent, setIsCustomEvent] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "task"), (snapshot) => {
      const projectsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(projectsData);
      setFilteredProjects(projectsData);
    });
    return unsubscribe;
  }, []);

  const handleAddProject = async () => {
    await addProject(newProject);
    setNewProject({
      priority: "",
      type: "",
      assignedTo: "",
      event: "",
      judul: "",
      narasumber: "",
      materi: "",
      tanggaltempat: "",
      benefitHarga: "",
      giveaway: "",
      pendaftaran: "",
      deadline: "",
      komentar: "",
    });
    setIsCustomEvent(false);
    setShowModal(false);
  };

  const handleProjectClick = (project) => {
    setSelectedTaskId(project.taskId);
    setSelectedProject(project);
    setIsEditing(false);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setSelectedTaskId(project.taskId);
    setIsEditing(true);
  };

  const handleEventChange = (e) => {
    const selectedEvent = e.target.value;

    if (selectedEvent === "Other") {
      setIsCustomEvent(true);
      setNewProject({ ...newProject, event: "" }); // Kosongkan event saat "Other" dipilih
    } else {
      setIsCustomEvent(false);
      setNewProject({ ...newProject, event: selectedEvent });
    }
  };

  const assignmentOptions = {
    Video: [
      { label: "Video Editor: Robil", value: "Robil" },
      { label: "Video Editor: Wahyu", value: "Wahyu" },
    ],
    Design: [{ label: "Desain Grafis: Hilmi", value: "Hilmi" }],
  };

  useEffect(() => {
    handleFilterAndSort();
  }, [filterAssignment, filterTitle, sortPriority, projects]);

  const handleFilterAndSort = () => {
    let filtered = [...projects]; // Copy agar tidak merusak original

    if (filterAssignment) {
      filtered = filtered.filter(
        (project) => project.assignedTo === filterAssignment
      );
    }

    if (filterTitle) {
      filtered = filtered.filter((project) =>
        project?.judul?.toLowerCase().includes(filterTitle?.toLowerCase())
      );
    }

    const priorityOrder = { Low: 1, Middle: 2, High: 3 };

    if (sortPriority) {
      filtered.sort((a, b) => {
        const aPriority = priorityOrder[a.priority] || 0;
        const bPriority = priorityOrder[b.priority] || 0;

        return sortPriority === "asc"
          ? aPriority - bPriority
          : bPriority - aPriority;
      });
    }

    setFilteredProjects(filtered);
  };

  const countAssignmentsByUserAndStatus = (user) => {
    const todo = projects.filter(
      (project) => project.assignedTo === user && project.status === "Todo"
    ).length;
    const progress = projects.filter(
      (project) => project.assignedTo === user && project.status === "Progress"
    ).length;
    const done = projects.filter(
      (project) => project.assignedTo === user && project.status === "Done"
    ).length;

    return { todo, progress, done };
  };

  return (
    <div className="board-container">
      <DndProvider backend={HTML5Backend}>
        <div className="board-header">
          <h2 className="board-title">Project Board</h2>
          {currentUser.role !== "multimedia" && (
            <Button
              className="custom-btn custom-btn-primary"
              onClick={() => setShowModal(true)}
            >
              + Add Project
            </Button>
          )}
        </div>

        <div className="filter-section">
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3 mb-md-0">
                <Form.Label className="filter-label">Search by Judul</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Type to search..."
                  value={filterTitle}
                  onChange={(e) => setFilterTitle(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3 mb-md-0">
                <Form.Label className="filter-label">Sort by Priority</Form.Label>
                <Form.Select
                  value={sortPriority}
                  onChange={(e) => setSortPriority(e.target.value)}
                >
                  <option value="">None</option>
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label className="filter-label">Filter by Assignment</Form.Label>
                <Form.Select
                  value={filterAssignment}
                  onChange={(e) => setFilterAssignment(e.target.value)}
                >
                  <option value="">All Assignments</option>
                  <option value="Robil">Video Editor: Robil</option>
                  <option value="Wahyu">Video Editor: Wahyu</option>
                  <option value="Hilmi">Desain Grafis: Hilmi</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Modal add new project */}
        <Modal
          className="custom-modal"
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add New Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Project Type</Form.Label>
                    <Form.Select
                      required
                      value={newProject.type}
                      onChange={(e) =>
                        setNewProject({ ...newProject, type: e.target.value })
                      }
                    >
                      <option>Pilih Project Type</option>
                      <option value="Video">Video</option>
                      <option value="Design">Design</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Assignment</Form.Label>
                    <Form.Select
                      required
                      value={newProject.assignedTo}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          assignedTo: e.target.value,
                        })
                      }
                    >
                      <option value="">Pilih Assignment</option>
                      {assignmentOptions[newProject.type]?.map((option) => {
                        const counts = countAssignmentsByUserAndStatus(
                          option.value
                        );
                        return (
                          <option key={option.value} value={option.value}>
                            {option.label} (Todo: {counts.todo}, Progress:{" "}
                            {counts.progress}, Done: {counts.done})
                          </option>
                        );
                      })}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Event Project</Form.Label>
                    <Form.Select
                      required
                      value={
                        isCustomEvent
                          ? "Other"
                          : newProject.event || "Select Event"
                      }
                      onChange={handleEventChange}
                    >
                      <option disabled>Pilih Event Project</option>
                      <option value="revolution">
                        Sales & Marketing Revolution
                      </option>
                      <option value="Property Rich Revolution">
                        Property Rich Revolution
                      </option>
                      <option value="Life Revolution">Life Revolution</option>
                      <option value="Business Revolution">
                        Business Revolution
                      </option>
                      <option value="Financial Revolution">
                        Financial Revolution
                      </option>
                      <option value="Traine For Firewalk Trainer">
                        Trainee For Firewalk Trainer
                      </option>
                      <option value="Superteen Bootcamp">
                        Superteen Bootcamp
                      </option>
                      <option value="Konten Sosmed TDW">
                        Konten Sosmed TDW
                      </option>
                      <option value="Other">Other</option> {/* Opsi "Other" */}
                    </Form.Select>

                    {/* Input muncul jika "Other" dipilih */}
                    {isCustomEvent && (
                      <Form.Control
                        type="text"
                        className="mt-2"
                        placeholder="Masukkan event secara manual"
                        value={newProject.event}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            event: e.target.value,
                          })
                        }
                      />
                    )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Judul Headline</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      value={newProject.headline}
                      onChange={(e) =>
                        setNewProject({ ...newProject, judul: e.target.value })
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Narasumber</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={newProject.narasumber}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          narasumber: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Materi yang akan dipelajari</Form.Label>
                <Form.Control
                  as="textarea"
                  required
                  rows={3}
                  value={newProject.materi}
                  onChange={(e) =>
                    setNewProject({ ...newProject, materi: e.target.value })
                  }
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                  <Form.Label>Tempat & Tanggal Acara</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    required
                    value={newProject.tempat}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        tempat: e.target.value,
                      })
                    }
                  />
                </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Benefit dan Harga Promo</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  required
                  value={newProject.benefitHarga}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      benefitHarga: e.target.value,
                    })
                  }
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Give Away</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  required
                  value={newProject.giveaway}
                  onChange={(e) =>
                    setNewProject({ ...newProject, giveaway: e.target.value })
                  }
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Info Link Pendaftaran & Contact</Form.Label>
                <Form.Control
                  type="text"
                  required
                  value={newProject.pendaftaran}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      pendaftaran: e.target.value,
                    })
                  }
                />
              </Form.Group>
              
              <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Priority</Form.Label>
                      <Form.Select
                        required
                        value={newProject.priority}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            priority: e.target.value,
                          })
                        }
                      >
                        <option>Pilih Priority</option>
                        <option value="Low">Low</option>
                        <option value="Middle">Middle</option>
                        <option value="High">High</option>
                      </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Deadline</Form.Label>
                    <Form.Control
                      type="date"
                      required
                      value={newProject.deadline}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          deadline: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Tambahan Komentar</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newProject.komentar}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      komentar: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button className="custom-btn custom-btn-primary" onClick={handleAddProject}>
              Add Project
            </Button>
          </Modal.Footer>
        </Modal>
        {/* selesai */}

        <ModalComment
          taskId={selectedTaskId}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />

        <Row>
          {categories.map((category) => (
            <Col key={category} md={3} className="mb-4">
              <Column
                category={category}
                projects={filteredProjects}
                setProjects={setProjects}
                onProjectClick={handleProjectClick}
                onEditProject={handleEditProject}
                userRole={currentUser.role}
              />
            </Col>
          ))}
        </Row>
      </DndProvider>
    </div>
  );
}

export default Dashboard;
