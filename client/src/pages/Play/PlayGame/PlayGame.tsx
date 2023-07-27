import { userSocket } from "../../../common/sockets";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  QuestionType,
  QuestionOptionType,
  PlayerType,
  AnswerResultType,
  GameData,
} from "../../../types/dataObjects";
import { Toast } from "primereact/toast";
import { Badge } from "primereact/badge";
import { useSession } from "../../../hooks/useSession";
import LiveGame from "../../../components/LiveGame";
import { ProgressSpinner } from "primereact/progressspinner";

export default function PlayGame() {
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(
    null
  );
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const { gameToken, playerName } = useParams<{
    gameToken: string;
    playerName: string;
  }>();
  const [player, setPlayer] = useSession<PlayerType | null>("player", null);
  const [gameData, setGameData] = useSession<Nullable<GameData>>(
    "gameData",
    null
  );

  const toast = useRef<Toast>(null);

  const onConnect = () => {
    if (!gameToken || !playerName) throw "gameToken or name is null";
    if (player) {
      console.log(`player ${JSON.stringify(player)}`);
      return;
    }
    userSocket.emit("joinGame", gameToken, playerName);
    userSocket.emit("getGameData", gameToken);
  };

  const onCurrentQuestion = (question: QuestionType) => {
    setCurrentQuestion(question);
  };

  const onTimeLeft = (time: number) => {
    setTimeLeft(time);
  };

  const onAnswerResult = (result: AnswerResultType) => {
    toast.current?.show({
      severity: result.isRight ? "success" : "error",
      summary: result.isRight ? "Correct" : "Wrong",
      detail: result.isRight
        ? "Your answer is correct"
        : "Your answer is wrong",
      life: 3000,
    });
    setScore((prev) => prev + result.score);
  };

  const onPlayerJoined = (player: PlayerType) => {
    console.log(`player ${JSON.stringify(player)}`);
    setPlayer(player);
  };

  const onGemaData = (data: GameData) => {
    setGameData(data);
  };

  useEffect(() => {
    userSocket.connect();
    userSocket.on("connect", onConnect);
    userSocket.on("currentQuestion", onCurrentQuestion);
    userSocket.on("timeLeft", onTimeLeft);
    userSocket.on("answerResult", onAnswerResult);
    userSocket.on("playerJoined", onPlayerJoined);
    userSocket.on("gameData", onGemaData);

    return () => {
      userSocket.off("connect", onConnect);
      userSocket.off("currentQuestion", onCurrentQuestion);
      userSocket.off("timeLeft", onTimeLeft);
      userSocket.off("answerResult", onAnswerResult);
      userSocket.off("playerJoined", onPlayerJoined);
      userSocket.off("gameData", onGemaData);
      userSocket.disconnect();
    };
  }, []);

  const onSelectedOption = (option: QuestionOptionType) => {
    if (!gameToken) throw "gameToken is null";
    userSocket.emit("submitAnswer", gameToken, player?.id!, option.id);
  };

  if (!gameData) return <ProgressSpinner />;

  return (
    <div className="flex flex-column align-items-center">
      {!currentQuestion && (
        <h1 className="text-center">Welcome {player?.name}</h1>
      )}
      {currentQuestion ? (
        <LiveGame
          gameData={gameData}
          question={currentQuestion}
          time={timeLeft}
          onSelectedOption={onSelectedOption}
        />
      ) : (
        <h1>Waiting for question</h1>
      )}
      {currentQuestion && (
        <Badge
          className="w-min"
          value={score}
          size="xlarge"
          severity="success"
        ></Badge>
      )}
      <Toast ref={toast} />
    </div>
  );
}
