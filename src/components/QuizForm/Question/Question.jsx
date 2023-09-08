import React, {useEffect, useState} from "react";
import Answer from "../Answer/Answer";

const Question = ({ question, questions, setQuestions, formType }) => {
    const [questionText, setQuestionText] = useState(formType === 'edit' ? question.text : '')
    const [feedbackTrue, setFeedbackTrue] = useState(formType === 'edit' ? question.feedback_true : '')
    const [feedbackFalse, setFeedbackFalse] = useState(formType === 'edit' ? question.feedback_false : '')
    const [answers, setAnswers] = useState(formType === 'edit' && question.answers.length > 0 ? [...question.answers] : [{id: 1, text: '', is_true: false}, {id: 2, text: '', is_true: false}])
    const [lastAnswerUniqueId, setLastAnswerUniqueId] = useState(formType === 'edit' && question.answers.length > 0 ? question.answers[question.answers.length - 1].id : 2)

    const handleAddAnswerComponent = () => {
        let newAnswer = {
            id: lastAnswerUniqueId+1,
            text: '',
            is_true: false
        }
        setAnswers(prevState => {
            return [...prevState, newAnswer]
        })
        setLastAnswerUniqueId(prevState => prevState+1)
    }

    const addQuestion = (question) => {
        let questionsList = [...questions]
        let questionIndex = questionsList.map(ans => ans.id).indexOf(question.id)
        questionsList[questionIndex] = question
        setQuestions(questionsList)
    }

    const removeQuestion = (questionId) => {
        let questionsList = [...questions]
        questionsList = questionsList.filter(ans => ans.id !== questionId)
        setQuestions(questionsList)
    }

    useEffect(() => {
        addQuestion({
            id: question.id,
            text: questionText,
            feedback_false: feedbackFalse,
            feedback_true: feedbackTrue,
            answer_id: null,
            answers: answers
        })
    }, [questionText, feedbackFalse, feedbackTrue, answers])

    return (
        <div className="row my-3">
            <div className="col-md-6 my-2">
                <input type="text" className="form-control" onChange={(e) => setQuestionText(e.target.value)} value={questionText} placeholder="Question" required={true} />
            </div>
            <div className="col-md-6 my-2">
                <input type="text" className="form-control" onChange={(e) => setFeedbackTrue(e.target.value)} value={feedbackTrue} placeholder="Feedback True" required={true} />
            </div>
            <div className="col-md-6 my-2">
                <input type="text" className="form-control" onChange={(e) => setFeedbackFalse(e.target.value)} value={feedbackFalse} placeholder="Feedback False" required={true} />
            </div>
            {
                questions.length > 1 &&
                <div className="col-md-6 my-2">
                    <div className="col-md-3 my-2">
                        <button className="btn btn-danger" type="button" onClick={() => removeQuestion(question.id)}>Remove question</button>
                    </div>
                </div>
            }
            <div className="px-5 row">
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                    <h4>Answers</h4>
                    <button className="btn btn-success" type="button" onClick={handleAddAnswerComponent}>Add answer</button>
                </div>
                {
                    answers.length > 0 && answers.map(answer => (
                        <div key={answer.id} className="col-md-6">
                            <Answer answer={answer} answers={answers} setAnswers={setAnswers} questionId={question.id} formType={formType} />
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default Question
