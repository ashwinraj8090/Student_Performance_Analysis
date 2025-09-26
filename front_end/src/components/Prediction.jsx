import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Prediction = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handlePredict = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/predict", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Prediction Result:", response.data);
            navigate("/result", { state: { predictions: response.data } });
        } catch (error) {
            console.error("Error predicting:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="prediction-container">
            <div className="container prediction-content">
                <h2 align="center">Student Grade Prediction</h2>
                <br />
                <div className="row">
                    <div className="col-md-6 offset-md-3 text-center">
                        <label htmlFor="fileInput" className="form-label">Upload File</label>
                        <input
                            type="file"
                            id="fileInput"
                            className="form-control"
                            accept=".xls, .xlsx, .csv , .json"
                            onChange={handleFileChange}
                        />
                        <br />
                        <button onClick={handlePredict} className="btn btn-primary" disabled={loading}>
                            {loading ? "Predicting..." : "Predict"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Prediction;