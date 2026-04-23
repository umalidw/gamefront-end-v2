
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function (props) {
  const navigate = useNavigate();
  const [points, setPoints] = useState(0);
  const [scoreId, setScoreId] = useState(0);
  const [scoreDetailsId, setScoreDetailsId] = useState(0);

  const endGame = useCallback(() => {
    let sId = sessionStorage.getItem("SCORE_ID");
    let detailsId = sessionStorage.getItem("SCORE_DETAILS_ID");
    axios({
      url: `https://api.learnfi.online/api/v1/game/end`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
      },
      data: {
        score_id: sId ? sId : scoreId,
        score_details_id: detailsId ? detailsId : scoreDetailsId,
        end_type: "AUTO_END",
      },
    }).then((response) => {
      if (response.data.success) {
        setPoints(response?.data?.body?.total_point);
      }
    });
  }, [scoreId, scoreDetailsId]);

  useEffect(() => {
    let pnts = sessionStorage.getItem("POINTS");
    let sId = sessionStorage.getItem("SCORE_ID");
    let detailsId = sessionStorage.getItem("SCORE_DETAILS_ID");
    if (pnts) setPoints(pnts);
    if (sId) setScoreId(sId);
    if (detailsId) setScoreDetailsId(detailsId);
    endGame();
  }, [endGame]);

  const newGame = () => {
    axios({
      url: "https://api.learnfi.online/api/v1/game/start",
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
      },
    }).then((response) => {
      if (response?.data?.success) {
        sessionStorage.setItem(
          "SCORE_ID",
          response.data.body.score_id ? response.data.body.score_id : null
        );
        sessionStorage.setItem(
          "SCORE_DETAILS_ID",
          response.data.body.score_details_id
            ? response.data.body.score_details_id
            : null
        );
        sessionStorage.setItem(
          "URL",
          response.data.body.question ? response.data.body.question : null
        );
        navigate("/quiz");
      }
    });
  };

  return (
    <div className="end-cover">
      <div className="d-flex justify-content-center end-main">
        <div className={"w-50 mt-3"}>
          <div
            className={"d-flex justify-content-center"}
            style={{ width: "100%" }}
          >
            <div className={"text-center"}>
              <h3>GAME OVER</h3>
              <h1
                style={{ fontSize: "20px", marginTop: "20px" }}
                className={"points-label"}
              >
                POINTS : {points}
              </h1>
            </div>
          </div>

          <div className={"w-100 mt-4 d-flex justify-content-center"}>
            <div
              className={
                "yellow-box text-center d-flex align-items-center justify-content-center"
              }
            >
              <div>
                <h4
                  className="end-text mb-4"
                  onClick={newGame}
                  style={{ cursor: "pointer" }}
                >
                  New Game{" "}
                  <span
                    style={{
                      color: "yellow",
                      fontSize: "24px",
                      marginLeft: "10px",
                    }}
                  >
                    ➪
                  </span>
                </h4>
                <h4 onClick={() => navigate('/point-table')} style={{ cursor: "pointer", marginBottom: "60px" }}>
                  View Point Table{" "}
                  <span
                    style={{
                      color: "yellow",
                      fontSize: "24px",
                      marginLeft: "10px",
                    }}
                  >
                    ➪
                  </span>
                </h4>
                <h4
                  onClick={() => navigate("/home")}
                  style={{ color: "red", cursor: "pointer" }}
                >
                  Exit
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
