import React, {useEffect, useState} from "react";

const Answer = ({ answer, answers, setAnswers, questionId, formType }) => {
    const [answerText, setAnswerText] = useState(formType === 'edit' ? answer.text : '')
    const [isTrue, setIsTrue] = useState(formType === 'edit' ? answer.is_true : false)

    const handleSetTrue = (e) => {
        if(e.target.checked) {
            let answersList = [...answers]
            answersList.forEach(ans => {
                if(ans.id !== answer.id)
                    ans.is_true = false
            })
            setAnswers(answersList)
            setIsTrue(true)
        } else {
            setIsTrue(false)
        }
    }

    const handleSetText = (e) => {
        setAnswerText(e.target.value)
    }

    const addAnswer = (answer) => {
        let answersList = [...answers]
        let answerIndex = answersList.map(ans => ans.id).indexOf(answer.id)
        answersList[answerIndex] = answer
        setAnswers(answersList)
    }

    const removeAnswer = (answerId) => {
        let answersList = [...answers]
        answersList = answersList.filter(ans => ans.id !== answerId)
        setAnswers(answersList)
    }

    useEffect(() => {
        addAnswer({
            id: answer.id,
            text: answerText,
            is_true: isTrue
        })
    }, [answerText, isTrue])

    return (
        <div className="row">
            <div className="col-md-6 my-2">
                <input type="text" className="form-control" onChange={handleSetText} value={answerText} placeholder="Answer" required={true} />
            </div>
            <div className="col-md-3 my-2">
                <label className="mx-2">Right Answer</label>
                <input type="radio" name={`trueAnswer-${questionId}`} onChange={handleSetTrue} defaultChecked={isTrue} required={true} />
            </div>
            {
                answers.length > 2 &&
                    <div className="col-md-3 my-2">
                        <button className="btn btn-danger" type="button" onClick={() => removeAnswer(answer.id)}>Remove</button>
                    </div>
            }
        </div>
    );
}

export default Answer
