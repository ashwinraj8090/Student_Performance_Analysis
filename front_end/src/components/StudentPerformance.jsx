import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from "recharts";


// Custom tooltip component to display the letter grade
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "5px",
        }}
      >
        <p className="label">{`${label} : ${payload[0].payload.letterGrade}`}</p>
      </div>
    );
  }
  return null;
};

const StudentPerformance = () => {
  // Get the student id from URL parameters
  const { studentId } = useParams();
  // Get predictions data passed via state
  const { predictions } = useLocation().state || {};

  if (!predictions || predictions.length === 0) {
    return <div>No prediction data available.</div>;
  }

  // Filter data for the selected student ensuring a 'subject' field exists
  const studentData = predictions.filter(
    (record) => record.student_id === studentId && record.subject
  );

  if (studentData.length === 0) {
    return <div>No subject performance data available for student {studentId}.</div>;
  }

  // Map letter grades to numeric values for charting (A=5, B=4, C=3, D=2, F=1)
  const gradeToNumeric = { A: 5, B: 4, C: 3, D: 2, F: 1 };

  // Prepare chart data
  const chartData = studentData.map((record) => ({
    subject: record.subject,
    numericGrade: gradeToNumeric[record.Predicted_Grade] || 0,
    letterGrade: record.Predicted_Grade,
  }));

  // Function to assign bar colors based on grade category
  const getColor = (grade) => {
    if (grade === "A" || grade === "B") return "green";  // Good
    if (grade === "C") return "orange";                   // Average
    if (grade === "D" || grade === "F") return "red";      // At Risk
    return "gray"; // Fallback
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Performance of {studentId}</h2>
      <br /><br />
      <div className="d-flex justify-content-center">
        <BarChart
          width={600}
          height={400}
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis dataKey="subject" />
          <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="numericGrade" name="Grade">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.letterGrade)} />
            ))}
          </Bar>
        </BarChart>
      </div>
    </div>
  );
};

export default StudentPerformance;
