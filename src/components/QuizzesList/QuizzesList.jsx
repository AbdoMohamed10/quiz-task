import React, {useEffect, useState} from "react";
import axios from "axios";
import QuizCard from "../QuizCard/QuizCard";
import {Link, useHistory} from "react-router-dom";

const QuizzesList = () => {
    const history = useHistory()
    const [quizzes, setQuizzes] = useState([])
    const [loading, setLoading] = useState(false)

    const getQuizzes = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/quizzes`).then(res => {
            setQuizzes(res.data)
            setLoading(true)
        }).catch(err => {
            setLoading(false)
        })
    }

    const handleQuizClick = (e, id) => {
        e.stopPropagation()
        history.push(`/quiz/${id}`)
    }

    useEffect(() => {
        getQuizzes()
    }, [])

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Quizzes</h2>
                <Link to="/create" className="btn btn-primary">Add quiz</Link>
            </div>
            <div>
                {
                    loading && quizzes.length > 0 ?
                        quizzes.map(quiz => (
                            <div key={quiz.id} onClick={(e) => handleQuizClick(e, quiz.id)}>
                                <QuizCard id={quiz.id} title={quiz.title} />
                            </div>
                        ))
                    :
                        loading && quizzes.length === 0 ?
                            <h4>No Quizzes</h4>
                        :
                            <div className="text-center p-4">
                                <div className="spinner-border" role="status"></div>
                            </div>
                }
            </div>
        </div>
    );
}

export default QuizzesList;
