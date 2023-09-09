import React from "react";
import './QuizCard.css';
import {useHistory} from "react-router-dom";

const QuizCard = ({id, title, score, url}) => {
    const history = useHistory()

    const handleEditClick = (e) => {
        e.stopPropagation()
        history.push(`/edit/${id}`)
    }

    const handleWatchVideo = (e) => {
        e.stopPropagation()
        window.open(url, '_blank')
    }

    return (
        <div className="card bg-light shadow mb-2 cursor-pointer quiz-card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                    <h3>{ title }</h3>
                    <div>
                        {
                            score !== null &&
                                <span className="mx-2">Last score: {score}</span>
                        }
                        {
                            url !== null &&
                            <button className="btn btn-primary mx-2" onClick={handleWatchVideo}>Watch</button>
                        }
                        <button className="btn btn-warning" onClick={handleEditClick}>Edit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizCard;
