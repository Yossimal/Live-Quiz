import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
  PlayerType,
  QuestionType,
  AnswerResultType,
  GameData,
} from "../../types/dataObjects";
import { adimnSocket } from "../../common/sockets";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import QRCode from "react-qr-code";
import { Toast } from "primereact/toast";
import Players from "./Players";
import LiveGame from "../../components/LiveGame";
import { DataTable } from "primereact/datatable";
import { useSession } from "../../hooks/useSession";
import { Column } from "primereact/column";
import { CLIENT_URL } from "../../common/consts";
import { ProgressSpinner } from "primereact/progressspinner";

export default function OnlineGameAdmin() {
  const { id } = useParams<{ id: string }>();
  const toast = useRef<Toast>(null);

  const [players, setPlayers] = useState<PlayerType[]>();
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(
    null
  );
  const [answerResults, setAnswerResults] = useState<AnswerResultType[]>([]);

  const [gameData, setGameData] = useSession<GameData | null>(
    "gameData",
    null
  );
  const [gameToken, setGameToken] = useLocalStorage("gameToken", "");

  let plyersScore: { playerName: string; score: number }[] = [];
  useEffect(() => {
    if (!players || !answerResults) return;
    plyersScore = players.map((player) => {
      const score = answerResults
        .filter((result) => result.playerId === player.id)
        .reduce((prev, curr) => prev + curr.score, 0);
      return { playerName: player.name, score };
    });
  }, [players, answerResults]);

  const onConnect = () => {
    if (!id) return;
    const quizId = parseInt(id);
    console.log("connected");
    adimnSocket.emit("openGame", quizId);
  };

  const onGetGameToken = (token: string) => {
    console.log(`token: ${token}`);
    setGameToken(token);
    adimnSocket.emit("getGameData", token);
  };

  const onNewPlayer = (player: PlayerType) => {
    setPlayers((prev) => {
      if (!prev) return [player];
      return [...prev, player];
    });
  };

  const onLeftTime = (time: number) => {
    setTimeLeft(time);
  };
  const onCurrentQuestion = (question: QuestionType) => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    setCurrentQuestion(question);
  };

  const onTotalAnswerResult = (result: AnswerResultType) => {
    console.log(result);
    setAnswerResults((prev) => [...prev, result]);
  };

  const onGameError = (error: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: error,
      life: 3000,
    });
  };

  const onGemaData = (data: GameData) => {
    setGameData(data);
  };

  useEffect(() => {
    adimnSocket.connect();
    adimnSocket.on("connect", onConnect);
    adimnSocket.on("getGameToken", onGetGameToken);
    adimnSocket.on("newPlayer", onNewPlayer);
    adimnSocket.on("timeLeft", onLeftTime);
    adimnSocket.on("currentQuestion", onCurrentQuestion);
    adimnSocket.on("answerResult", onTotalAnswerResult);
    adimnSocket.on("gameError", onGameError);
    adimnSocket.on("gameData", onGemaData);

    return () => {
      adimnSocket.off("connect", onConnect);
      adimnSocket.off("getGameToken", onGetGameToken);
      adimnSocket.off("newPlayer", onNewPlayer);
      adimnSocket.off("timeLeft", onLeftTime);
      adimnSocket.off("currentQuestion", onCurrentQuestion);
      adimnSocket.off("answerResult", onTotalAnswerResult);
      adimnSocket.off("gameError", onGameError);
      adimnSocket.off("gameData", onGemaData);
      adimnSocket.disconnect();
    };
  }, []);

    console.log(`${CLIENT_URL}/live/game/${gameToken}`);
    if(!gameData) return <ProgressSpinner className='m-5' />

    return (
        <div className='flex h-full flex-column justify-content-start align-items-center bg-purple-800'>
            {!gameStarted &&
                <div className='m-3 flex flex-column justify-content-center align-items-center'>
                    <div className='text-6xl text-blue-100 font-bold mb-3'>Scaen To Join To The
                        {<span className='text-purple-100 text-6xl font-bold mb-3'> {gameData.name}</span>} Quiz:</div>
                    <Tooltip target=".qrcode" mouseTrack mouseTrackLeft={10} />
                    <QRCode
                        data-pr-tooltip={`${CLIENT_URL}/live/game/${gameToken}`}
                        className='qrcode surface-200 shadow-8 m-4'
                        value={`${CLIENT_URL}/live/game/${gameToken}`} />
                </div>
            }

      {!gameStarted && (
        <Button
          label="Start Game"
          icon="pi pi-play"
          className=""
          onClick={() => adimnSocket.emit("startGame", gameToken)}
        />
      )}

            <div className='w-6'>
                {currentQuestion &&
                    <LiveGame
                        gameData={gameData}
                        question={currentQuestion}
                        time={timeLeft} />
                }
            </div>

      {plyersScore.length > 0 && (
        <DataTable value={plyersScore}>
          <Column field="playerName" header="Player Name"></Column>
          <Column field="score" header="Score"></Column>
        </DataTable>
      )}

      {players && <Players players={players} />}
      <Toast ref={toast} />
    </div>
  );
}
