import React from "react";
import './QuizCard.css';
import {useHistory} from "react-router-dom";

const QuizCard = ({id, title}) => {
    const history = useHistory()

    const handleEditClick = (e) => {
        e.stopPropagation()
        history.push(`/edit/${id}`)
    }

    return (
        <div className="card bg-light shadow mb-2 cursor-pointer quiz-card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <h3>{ title }</h3>
                    <button className="btn btn-warning" onClick={handleEditClick}>Edit</button>
                </div>
            </div>
        </div>
    );
}

export default QuizCard;
