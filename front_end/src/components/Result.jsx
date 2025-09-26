import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Pagination, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { predictions } = location.state || { predictions: [] };

    // Get unique subjects for filtering
    const subjects = [...new Set(predictions.map(item => item.subject))];

    // State management for pagination and filtering
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedSubject, setSelectedSubject] = useState(subjects[0] || "");

    const rowsPerPage = 10;

    // Handle page change
    const handlePageChange = (newPage) => setCurrentPage(newPage);

    // Handle category and subject filter changes
    const handleCategoryChange = (e) => { setSelectedCategory(e.target.value); setCurrentPage(1); };
    const handleSubjectChange = (e) => { setSelectedSubject(e.target.value); setCurrentPage(1); };

    // Filter data based on selected subject and category
    const subjectFilteredData = predictions.filter(item => item.subject === selectedSubject);
    const filteredData = subjectFilteredData.filter(item => 
        selectedCategory === "All" || item.Predicted_Category === selectedCategory
    );

    // Paginate data for table display
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

    // Prepare Pie chart data
    const categoryCounts = subjectFilteredData.reduce((acc, item) => {
        acc[item.Predicted_Category] = (acc[item.Predicted_Category] || 0) + 1;
        return acc;
    }, {});
    const pieData = {
        labels: ["At Risk", "Average", "Good"],
        datasets: [{
            data: [categoryCounts["At Risk"] || 0, categoryCounts["Average"] || 0, categoryCounts["Good"] || 0],
            backgroundColor: ["#ff4d4d", "#ff9900", "#4caf50"]
        }]
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center">Prediction Results</h2>
            <br />
            <div className="row mb-3">
                <div className="col-md-6">
                    <Form.Group controlId="subjectFilter">
                        <Form.Label>Filter by Subject:</Form.Label>
                        <Form.Control as="select" value={selectedSubject} onChange={handleSubjectChange}>
                            {subjects.map((subject, idx) => (
                                <option key={idx} value={subject}>{subject}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </div>
                <div className="col-md-6">
                    <Form.Group controlId="categoryFilter">
                        <Form.Label>Filter by Category:</Form.Label>
                        <Form.Control as="select" value={selectedCategory} onChange={handleCategoryChange}>
                            <option value="All">All</option>
                            <option value="At Risk">At Risk</option>
                            <option value="Average">Average</option>
                            <option value="Good">Good</option>
                        </Form.Control>
                    </Form.Group>
                </div>
            </div>
            <div className="row">
                <div className="col-md-8">
                    <Table striped bordered hover responsive>
                        <thead className="table-light">
                            <tr>
                                <th>Student ID</th>
                                <th>Internal Score</th>
                                <th>Study Hours</th>
                                <th>Assignments Completed</th>
                                <th>Attendance</th>
                                <th>Predicted Grade</th>
                                <th>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((item, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip id={`tooltip-${idx}`}>View individual grades</Tooltip>}
                                        >
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    navigate(`/student/${item.student_id}`, { state: { predictions } });
                                                }}
                                            >
                                                {item.student_id}
                                            </a>
                                        </OverlayTrigger>
                                    </td>
                                    <td>{item.internal_score}</td>
                                    <td>{item.study_hours}</td>
                                    <td>{item.assignments_completed}</td>
                                    <td>{item.attendance}%</td>
                                    <td>{item.Predicted_Grade}</td>
                                    <td style={{
                                        color: item.Predicted_Category === "Good" ? "green" :
                                               item.Predicted_Category === "Average" ? "orange" :
                                               "red",
                                    }}>
                                        {item.Predicted_Category}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Pagination className="justify-content-center">
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {Array.from({ length: Math.ceil(filteredData.length / rowsPerPage) }, (_, i) => (
                            <Pagination.Item
                                key={i + 1}
                                active={i + 1 === currentPage}
                                onClick={() => handlePageChange(i + 1)}
                            >
                                {i + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
                        />
                    </Pagination>
                </div>
                <div className="col-md-4 d-flex align-items-center justify-content-center">
                    <Pie data={pieData} />
                </div>
            </div>
        </div>
    );
};

export default Result;
