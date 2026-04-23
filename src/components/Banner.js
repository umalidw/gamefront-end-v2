import { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import headerImg from "../assets/pngwing.png";
import { ArrowRightCircle, PersonCircle, StarFill } from "react-bootstrap-icons";
import "animate.css";
import TrackVisibility from "react-on-screen";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Banner = () => {
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState("");
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const toRotate = ["Navishka Darshana"];
  const period = 2000;
  const navigation = useNavigate();
  const user = JSON.parse(localStorage.getItem("User"));

  const loopNumRef = useRef(loopNum);
  const isDeletingRef = useRef(isDeleting);
  const textRef = useRef(text);

  useEffect(() => {
    loopNumRef.current = loopNum;
  }, [loopNum]);

  useEffect(() => {
    isDeletingRef.current = isDeleting;
  }, [isDeleting]);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    console.log(user);
    const tick = () => {
      let i = loopNumRef.current % toRotate.length;
      let fullText = toRotate[i];
      let currentText = textRef.current;
      let updatedText = isDeletingRef.current
        ? fullText.substring(0, currentText.length - 1)
        : fullText.substring(0, currentText.length + 1);

      setText(updatedText);

      if (isDeletingRef.current) {
        setDelta((prevDelta) => prevDelta / 2);
      }

      if (!isDeletingRef.current && updatedText === fullText) {
        setIsDeleting(true);
        setDelta(period);
      } else if (isDeletingRef.current && updatedText === "") {
        setIsDeleting(false);
        setLoopNum((prevLoopNum) => prevLoopNum + 1);
        setDelta(500);
      }
    };

    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => {
      clearInterval(ticker);
    };
  }, [delta, user, period]);


  const startGame = () => {
    axios({
      url: "https://api.smartgm.it.com/api/v1/game/start",
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
      },
    }).then((response) => {
      if (response?.data?.success) {
        sessionStorage.setItem(
          "SCORE_ID",
          response?.data.body.score_id ? response.data.body.score_id : null
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
        navigation("/quiz");
      }
    });
  };

  return (
    <section className="banner" id="home">
      <Container>
        <div className="profile-sec">
          <h5>
            <span className="person-icon"><PersonCircle size={22} /></span>
            
            <span>
              {user.username} - <span className="level">{user.userDetails.level_eum}</span>{" "}
              <span className="points">
                <StarFill size={16} />
                <span>{user.userDetails.level}</span>
              </span>
            </span>
          </h5>
        </div>
        <Row className="aligh-items-center">
          <Col xs={12} md={6} xl={7}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__fadeIn" : ""
                  }
                >
                  <span className="tagline">Welcome To My Smile Game</span>
                  <h1>{`Hi! I'm `} <span className="txt-rotate" dataPeriod="1000" data-rotate='[ "Learnfi.lk", "Learnfi.lk"]'><span className="wrap">{text}</span></span></h1>
                  <h1  style={{ fontSize: "30px", color:"#f9ca24" }}>Building AWS Architectures</h1>

                  <p>
                    Celestial Odyssey is an action-adventure role-playing game that transports players to the vast and mesmerizing world of Etherea.
                    As a chosen hero, players will embark on a thrilling journey through a realm filled
                    with mythical creatures, ancient civilizations, and mysterious artifacts. The game features a diverse
                    open-world environment, offering players the freedom to explore and choose their path. Players will have the chance to engage in epic battles with various creatures, complete challenging quests, and uncover the secrets of an ancient prophecy.
                  </p>
                  <button style={{ fontSize: "30px", color:"#f9ca24" }} onClick={startGame}>
                    Start Game <ArrowRightCircle size={35} />
                  </button>
                </div>
              )}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <TrackVisibility>
              {({ isVisible }) => (
                <div
                  className={
                    isVisible ? "animate__animated animate__zoomIn" : ""
                  }
                >
                  <img src={headerImg} alt="Header Img" />
                </div>
              )}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
