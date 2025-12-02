import { useState, useEffect } from "react";
import { db } from "../../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Table, Button } from "react-bootstrap";
import * as XLSX from "xlsx"; // Untuk ekspor ke Excel
import "../Dashboard/Dashboard.css";

const ReportPage = () => {
  const [doneProjects, setDoneProjects] = useState([]);

  useEffect(() => {
    const fetchDoneProjects = async () => {
      try {
        const q = query(collection(db, "task"), where("status", "==", "Done"));
        const querySnapshot = await getDocs(q);
        const projects = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDoneProjects(projects);
      } catch (error) {
        console.error("Error fetching done projects:", error);
      }
    };

    fetchDoneProjects();
  }, []);

  const handleDownloadExcel = () => {
    const filteredData = doneProjects.map(
      ({
        judul,
        assignedTo,
        deadline,
        priority,
        type,
        event,
        tempat,
        narasumber,
      }) => ({
        Judul: judul,
        Assignment: assignedTo,
        Deadline: deadline,
        Priority: priority,
        Type: type,
        Event: event,
        Tempat: tempat,
        Narasumber: narasumber,
      })
    );
    const ws = XLSX.utils.json_to_sheet(filteredData);

    ws["!cols"] = [
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 30 },
      { wch: 10 },
      { wch: 15 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Done Projects");
    XLSX.writeFile(wb, "Done_Projects_Report.xlsx");
  };

  return (
    <div className="board-container">
      <div className="board-header">
        <h2 className="board-title">Report - Done Projects</h2>
        <Button className="custom-btn custom-btn-primary" onClick={handleDownloadExcel}>
          Download Excel
        </Button>
      </div>

      <div className="report-container">
        <Table hover responsive className="report-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Title</th>
              <th>Assignment</th>
              <th>Deadline</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {doneProjects.map((project, index) => (
              <tr key={project.id}>
                <td>{index + 1}</td>
                <td>{project.judul}</td>
                <td>{project.assignedTo}</td>
                <td>{project.deadline}</td>
                <td>
                  <span
                    className={`badge bg-${
                      project.priority === "High"
                        ? "danger"
                        : project.priority === "Middle"
                        ? "warning"
                        : "info"
                    }`}
                  >
                    {project.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default ReportPage;
