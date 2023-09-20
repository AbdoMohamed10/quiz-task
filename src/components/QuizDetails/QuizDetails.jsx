import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import axios from "axios";
import question from "../QuizForm/Question/Question";

const QuizDetails = () => {
    const { id } = useParams()
    const history = useHistory()
    const [quiz, setQuiz] = useState({})
    const [loading, setLoading] = useState(true)
    const [questionAnswers, setQuestionAnswers] = useState([])
    const [finishDisabled, setFinishDisabled] = useState(false)
    const [score, setScore] = useState(0)

    const getQuiz = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/quizzes/${id}`).then(res => {
            setQuiz(res.data)
            setLoading(false)
        }).catch(err => {
            setLoading(false)
        })
    }

    const handleAnswerQuestion = (question, answer) => {
        let questionAnswersFiltered = questionAnswers.filter(qa => qa.question.id !== question.id)

        if(questionAnswers.some(qa => qa.question.id === question.id && qa.selectedAnswer.is_true)) {
            setScore(prevState => prevState-5)
        }

        if(answer.is_true) {
            setScore(prevState => prevState+5)
        }

        setQuestionAnswers([...questionAnswersFiltered, {question, selectedAnswer: answer}])

    }

    const handleFinishQuiz = () => {
        if(questionAnswers.length > 0 && quiz.questions_answers.length === questionAnswers.length) {
            setFinishDisabled(true)
            let questionsAnswersUpdated = []
            questionAnswers.forEach(question => {
                let selectedQuestion = {...question.question}
                selectedQuestion['answer_id'] = question.selectedAnswer.id
                questionsAnswersUpdated.push(selectedQuestion)
                getQuestionFeedback(question)
            })
            handleUpdateQuiz(questionsAnswersUpdated)
        } else {
            alert('Please answer all questions')
        }

    }

    const getQuestionFeedback = (question) => {
        if(question.selectedAnswer.is_true) {
            document.getElementById(`feedbackTrue-${question.question.id}`).classList.remove('d-none')
            document.getElementById(`feedbackFalse-${question.question.id}`).classList.add('d-none')
        } else {
            document.getElementById(`feedbackTrue-${question.question.id}`).classList.add('d-none')
            document.getElementById(`feedbackFalse-${question.question.id}`).classList.remove('d-none')
        }
    }

    const handleUpdateQuiz = (questionsAnswers) => {
        let data = {
            score,
            questions_answers: questionsAnswers
        }
        axios.patch(`${process.env.REACT_APP_API_URL}/quizzes/${quiz.id}`, data, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, PATCH',
                'Content-Type': 'application/json',
            }
        }).then(res => {
            document.getElementById('score').classList.remove('d-none')
        }).catch(err => {

        })
    }

    const handleGoBack = () => {
        history.push('/')
    }

    useEffect(() => {
        getQuiz()
    }, [id])

    return (
        <div className="card bg-light p-3">
            {
                !loading && Object.keys(quiz).length > 0 ?
                    <div className="row">
                        <h3>{quiz.title}</h3>
                        <p>{quiz.description}</p>
                        <hr />
                        {
                            quiz.questions_answers.length > 0 && quiz.questions_answers.map((question, index) => (
                                <div key={question.id} className="col-md-12">
                                    <h4>Q{index+1}: {question.text}</h4>
                                    <div className="row">
                                        {
                                            question.answers.length > 0 && question.answers.map(answer => (
                                                <div key={answer.id} className="col-md-6 d-flex justify-content-between align-items-center">
                                                    <label htmlFor={`answer-${question.id}-${answer.id}`}>{answer.text}</label>
                                                    <input type="radio" id={`answer-${question.id}-${answer.id}`} name={`answer-${question.id}`} onChange={() => handleAnswerQuestion(question, answer)} />
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="alert alert-success my-2 d-none" id={`feedbackTrue-${question.id}`}>{question.feedback_true}</div>
                                    <div className="alert alert-danger my-2 d-none" id={`feedbackFalse-${question.id}`}>{question.feedback_false}</div>
                                    <hr className="my-3" />
                                </div>
                            ))
                        }
                        <div className="col-md-12 alert alert-info d-none" id="score">
                            <h5>Your score is {score}</h5>
                        </div>
                        <div className="col-md-12">
                            <button className="btn btn-success" disabled={finishDisabled} onClick={handleFinishQuiz}>Finish</button>
                            <button className="btn btn-dark mx-2" onClick={handleGoBack}>Back</button>
                        </div>
                    </div>
                :
                    <div className="text-center p-4">
                        <div className="spinner-border" role="status"></div>
                    </div>
            }
        </div>
    );
}

export default QuizDetails;
