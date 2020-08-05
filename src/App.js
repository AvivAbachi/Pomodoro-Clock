import React, { useEffect, useState, useRef } from "react";
import "./styles.css";
import useInterval from "./hooks/useInterval";

import {
  FlexboxGrid,
  Panel,
  Divider,
  Grid,
  Row,
  Icon,
  IconButton,
  Button,
  ButtonGroup
} from "rsuite";

const INTERVAL_SPEED = 1;
const BEEP_SRC =
  "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";

const App = () => {
  const [breaks, setBreaks] = useState(5);
  const [session, setSession] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [seasonPhase, setSeasonPhase] = useState(true);
  const [current, setCurrent] = useState();
  const beepRef = useRef();

  const handelReset = () => {
    setIsRunning(false);
    setSeasonPhase(true);
    setBreaks(5);
    setSession(25);
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  };

  const handelPhase = () => {
    setSeasonPhase(!seasonPhase);
    setCurrent((!seasonPhase ? session : breaks) * 60);
    beepRef.current.play();
    beepRef.current.currentTime = 0;
  };

  useInterval(
    () => (current <= 0 ? handelPhase() : setCurrent(prev => prev - 1)),
    isRunning ? INTERVAL_SPEED : null
  );

  useEffect(
    () => !isRunning && setCurrent((seasonPhase ? session : breaks) * 60),
    // eslint-disable-next-line
    [breaks, session]
  );

  const handelLength = dispatch => {
    if (!isRunning) {
      const canADD = value => (value >= 60 ? 60 : value + 1);
      const canDEC = value => (value <= 1 ? 1 : value - 1);
      switch (dispatch) {
        case "add_break":
          setBreaks(canADD(breaks));
          break;
        case "dec_break":
          setBreaks(canDEC(breaks));
          break;
        case "add_session":
          setSession(canADD(session));
          break;
        case "dec_session":
          setSession(canDEC(session));
          break;
        default:
          break;
      }
    }
  };
  const secToTime = _sec => {
    let min = (_sec - (_sec %= 60)) / 60;
    let sec = _sec;
    const addZero = x => (9 < x ? x : "0" + x);
    return addZero(min) + ":" + addZero(sec);
  };

  return (
    <FlexboxGrid justify="center" align="middle" className={"bg"}>
      <Panel shaded className={"timer"}>
        <Grid fluid>
          <h1>Pomodoro Clock</h1>
          <Row>
            <h2 id="time-left" style={{ color: current < 60 ? "#f44336" : "" }}>
              {secToTime(current)}
            </h2>
            <h5 id="timer-label">{seasonPhase ? "Session" : "Break"}</h5>

            <TimerControl
              reset={() => handelReset()}
              startPause={() => setIsRunning(!isRunning)}
              running={isRunning}
            />
          </Row>
          <Divider />
          <FlexboxGrid justify="space-between">
            <TimerLengthControl
              id={"session"}
              title={"Session Length"}
              control={session}
              setControl={handelLength}
            />
            <TimerLengthControl
              id={"break"}
              title={"Break Length"}
              control={breaks}
              setControl={handelLength}
            />
          </FlexboxGrid>
          <Divider />
          <a href="https://github.com/AvivAbachi">Create by Aviv Abachi</a>
        </Grid>
      </Panel>
      <audio ref={beepRef} id="beep" preload="auto" src={BEEP_SRC} />
    </FlexboxGrid>
  );
};

const TimerLengthControl = React.memo(props => {
  return (
    <div className="center">
      <h5 id={props.id + "-label"}>{props.title}</h5>
      <ButtonGroup vertical>
        <IconButton
          icon={<Icon icon="chevron-up" />}
          color="blue"
          id={props.id + "-increment"}
          onClick={() => props.setControl("add_" + props.id)}
        />
        <Button appearance="ghost" id={props.id + "-length"}>
          {props.control}
        </Button>
        <IconButton
          icon={<Icon icon="chevron-down" />}
          color="blue"
          id={props.id + "-decrement"}
          onClick={() => props.setControl("dec_" + props.id)}
        />
      </ButtonGroup>
    </div>
  );
});

const TimerControl = React.memo(props => {
  return (
    <FlexboxGrid justify="space-around" className="timer_control">
      <IconButton
        icon={<Icon icon="stop" />}
        color="red"
        id="reset"
        placement="right"
        onClick={props.reset}
      >
        Stop
      </IconButton>
      <IconButton
        placement="right"
        icon={<Icon icon={props.running ? "pause" : "play"} />}
        color={props.running ? "yellow green" : "green"}
        id="start_stop"
        onClick={props.startPause}
      >
        {props.running ? "Pause" : "Start"}
      </IconButton>
    </FlexboxGrid>
  );
});

export default App;
