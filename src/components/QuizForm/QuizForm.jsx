import React, {useEffect, useState} from "react";
import Question from "./Question/Question";
import axios from "axios";
import {useHistory, useParams} from "react-router-dom";

const QuizForm = ({ type }) => {
    const { id } = useParams()
    const history = useHistory()
    const [quiz, setQuiz] = useState({})
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [url, setUrl] = useState('')
    const [questions, setQuestions] = useState([{id: 1, text: '', feedback_false: '', feedback_true: '', answer_id: null, answers: []}])
    const [lastQuestionUniqueId, setLastQuestionUniqueId] = useState(1)
    const [submitText, setSubmitText] = useState('Save')
    const [submitLoading, setSubmitLoading] = useState(false)
    const [loading, setLoading] = useState(true)

    const handleAddQuestionComponent = () => {
        let newQuestion = {
            id: lastQuestionUniqueId+1,
            text: "",
            feedback_false: "",
            feedback_true: "",
            answer_id: null,
            answers: []
        }
        setQuestions(prevState => {
            return [...prevState, newQuestion]
        })
        setLastQuestionUniqueId(prevState => prevState+1)
    }

    const handleSave = (e) => {
        e.preventDefault();

        setSubmitLoading(true)
        setSubmitText('Loading...')

        if(type === 'edit') {
            handleEdit()
        } else {
            handleCreate()
        }
    }

    const handleCreate = () => {
        const now = Date.now();
        const date = new Date(now).toISOString().split('T')[0]
        const time = new Date(now).toISOString().split('T')[1].split('.')[0]
        const created = date + ' ' + time

        let data = {
            title,
            description,
            url,
            score: null,
            created,
            modified: null,
            questions_answers: questions
        }

        axios.post(`${process.env.REACT_APP_API_URL}/quizzes`, data).then(res => {
            setSubmitLoading(false)
            setSubmitText('Save')
            history.push('/')
        }).catch(err => {
            setSubmitLoading(false)
            setSubmitText('Save')
        })
    }

    const handleEdit = () => {
        const now = Date.now();
        const date = new Date(now).toISOString().split('T')[0]
        const time = new Date(now).toISOString().split('T')[1].split('.')[0]
        const modified = date + ' ' + time

        let data = {
            title,
            description,
            url,
            score: quiz.score,
            created: quiz.created,
            modified,
            questions_answers: questions
        }

        axios.put(`${process.env.REACT_APP_API_URL}/quizzes/${id}`, data).then(res => {
            setSubmitLoading(false)
            setSubmitText('Save')
            history.push('/')
        }).catch(err => {
            setSubmitLoading(false)
            setSubmitText('Save')
        })
    }

    const handleCancel = () => {
        history.push('/')
    }

    const getQuizData = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/quizzes/${id}`).then(res => {
            setTitle(res.data.title)
            setDescription(res.data.description)
            setUrl(res.data.url)
            setQuestions(res.data.questions_answers)
            setLastQuestionUniqueId(res.data.questions_answers[res.data.questions_answers.length - 1].id)
            setQuiz(res.data)

            setLoading(false)
        }).catch(err => {
            setLoading(false)
        })
    }
    useEffect(() => {
        if(type === 'edit') {
            getQuizData()
        }
    }, [])

    return (
        <div>
            <h3><span className="text-capitalize">{type}</span> quiz</h3>
            {
                type === 'edit' && loading ?
                    <div className="text-center p-4">
                        <div className="spinner-border" role="status"></div>
                    </div>
                :
                    <form className="row p-3 bg-light rounded" onSubmit={handleSave}>
                        <div className="col-md-6 my-2">
                            <input type="text" className="form-control" onChange={(e) => setTitle(e.target.value)} value={title} placeholder="Title" required={true} />
                        </div>
                        <div className="col-md-6 my-2">
                            <input type="url" className="form-control" onChange={(e) => setUrl(e.target.value)} placeholder="URL" value={url} />
                        </div>
                        <div className="col-md-6 my-2">
                            <textarea className="form-control" rows="4" onChange={(e) => setDescription(e.target.value)} placeholder="Description" value={description}></textarea>
                        </div>
                        <div className="col-md-12">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4>Questions</h4>
                                <button className="btn btn-success" type="button" onClick={handleAddQuestionComponent}>Add question</button>
                            </div>
                            {
                                questions.length > 0 && questions.map(question => (
                                    <div key={question.id} className="col-md-12">
                                        <Question question={question} questions={questions} setQuestions={setQuestions} formType={type} />
                                        <hr className="my-2" />
                                    </div>
                                ))
                            }
                        </div>
                        <div className="col-md-6 my-2">
                            <button className="btn btn-success" type="submit" disabled={submitLoading}>{submitText}</button>
                            <button className="btn btn-danger mx-2" type="button" disabled={submitLoading} onClick={handleCancel}>Cancel</button>
                        </div>
                    </form>
            }
        </div>
    );
}

export default QuizForm;
