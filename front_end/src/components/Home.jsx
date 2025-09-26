import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container bg-light">
            <div className="container d-flex justify-content-center align-items-center min-vh-100">
                <div className="row">
                    <div className="col-md-10 offset-md-1">
                        <div className="card text-center shadow-lg p-4 bg-white">
                            <h1 className="mb-4">Welcome to Student Performance Analyzer</h1>
                            <p className="lead">
                                Upload your student data and get predictions on their performance.
                                Our system analyzes their records to predict outcomes.
                            </p>
                            <button 
                                className="btn btn-primary mt-3"
                                onClick={() => navigate("/prediction")}
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;