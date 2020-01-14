import React from 'react';
import { Link } from "react-router-dom";
import './index.css';  

const HomePage = (props) => {
    return (
        <div className="home-container">
            <h1>Home page</h1>
            <Link to="/my-books">login</Link>
        </div>
    );
}

export default HomePage;
