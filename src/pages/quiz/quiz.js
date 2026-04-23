
import React, {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom";
import axios from "axios";
import { ArrowLeftCircle } from "react-bootstrap-icons";



export default function (props) {
    const navigate = useNavigate();
    const [answer,setAnswer] = useState('');
    const [time,setTime] = useState(60000);
    const [points,setPoints] = useState(0);
    const [url,setUrl] = useState(null);
    const [scoreId,setScoreId] = useState('');
    const [scoreDetailsId,setScoreDetailsId] = useState('');
    const [isCorrect,setIsCorrect] = useState(null);

    useEffect (() => {
       let score_id = sessionStorage.getItem('SCORE_ID')
       let score_details_id = sessionStorage.getItem('SCORE_DETAILS_ID')
       let url = sessionStorage.getItem('URL')
       if(score_id) {setScoreId(score_id)}
       if(score_details_id) {setScoreDetailsId(score_details_id)}
       if(url) {setUrl(url)}
   },[])

    useEffect(() => {
        if (time === 0){
            sessionStorage.setItem('POINTS',points)
            sessionStorage.setItem('SCORE_ID',scoreId)
            sessionStorage.setItem('SCORE_DETAILS_ID',scoreDetailsId)
            // navigate({pathname:'/end'})
            navigate('/end')
        }
        setTimeout(() => {
            setTime(time - 1000);
        },1000);
    },[time, points, scoreId, scoreDetailsId, navigate]);

    const getTime = (miliseconds) => {
        let total_seconds = parseInt(Math.floor(miliseconds/1000));
        let total_minutes = parseInt(Math.floor(total_seconds/60));

        let seconds = parseInt(total_seconds % 60)
        let minutes = parseInt(total_minutes % 60)

        return `${minutes} : ${seconds}`
    };


    const submitAnswer = () => {
            axios({
                url:`https://api.smartgm.it.com/api/v1/game/answer/check`,
                method:'POST',
                headers:{"Authorization":`Bearer ${localStorage.getItem('ACCESS_TOKEN')}`},
                data : {
                    'score_id' : scoreId,
                    'score_details_id' : scoreDetailsId,
                    'answer' : answer
                }
            }).then((response) => {
                if (response.data.success){
                    setPoints(response.data.body.point ? response.data.body.point : 0)
                    setScoreId(response.data.body.score_id)
                    setScoreDetailsId(response.data.body.score_details_id)
                    setUrl(response.data.body.question ? response.data.body.question : '')
                    setIsCorrect(response.data.body.is_true ? response.data.body.is_true : false)
                }
            })
    }





    return (
        <div className="quiz-cover">
            
            <div className="d-flex justify-content-center quiz-main">
            <div className="back-button" role="button" onClick={()=>{
               window.history.back()
            }}>
            <ArrowLeftCircle size={28} />
            </div>
                <div className={"w-50 mt-3"}>
                    <div className={'d-flex justify-content-between'} style={{width:'100%'}}>
                        <h3>Guess the number</h3>
                        <button className={'points-btn'}>Points {points}</button>
                    </div>

                    <div className={'w-100 text-center mt-3'}>
                        {isCorrect !== null &&  <h2 className={`${isCorrect ? 'correctTxt' :'wrongTxt'}`}>{isCorrect ? 'Correct' : 'Wrong'}</h2> }
                    </div>

                    <img className={'mt-2 quiz-img'} style={{width:'100%',height:'380px'}} src={url ? url : `https://www.sanfoh.com/uob/smile/data/sb8c05af345eb7fad2aed276a12n704.png`} alt="Quiz question" />

                    <div className={'row w-100 mt-5'} style={{width:'100%'}}>
                        <div className={'col-8'}>
                            <h3 className={'timing-text'}>{getTime(time)}</h3>
                        </div>
                        <div className={'col-4 d-flex justify-content-end'}>
                            <input value={answer} onChange={(e) => setAnswer(e.target.value)} className={'answer-input'}/>
                            <button disabled={answer === ''} onClick={submitAnswer} className={`points-btn ${answer === '' && 'disabled-btn'}`}>Guess</button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}
