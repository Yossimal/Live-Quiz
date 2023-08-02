import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import {
    PlayerType,
    QuestionType,
    AnswerResultType,
    GameData,
    PlayerInGameType
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
import GameOverDialog from "./GameOverDialog";


export default function OnlineGameAdmin() {
    const { id } = useParams<{ id: string }>();
    const toast = useRef<Toast>(null);

    const [players, setPlayers] = useState<PlayerType[]>([]);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(
        null
    );
    const [answerResults, setAnswerResults] = useState<Map<number, AnswerResultType[]>>(new Map());
    const [plyersScore, setPlyersScore] = useState<PlayerInGameType[]>([]);
    const [isGameOver, setIsGameOver] = useState<boolean>(false);

    const [gameData, setGameData] = useSession<GameData | null>(
        "gameData",
        null
    );
    const [gameToken, setGameToken] = useLocalStorage("gameToken", "");

    useEffect(() => {
        if (!players) return;

        const plyersScoreTemp: { playerName: string; score: number }[]
            = players.map((player) => {
                return { playerName: player.name, score: player.score };
            });
        setPlyersScore(plyersScoreTemp);
    }, [players]);

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
        if (!player) return;
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
        if (!question) return;
        setCurrentQuestion(question);
    };

    const onTotalAnswerResult = (result: AnswerResultType[]) => {
        console.log("result", result);
        if (!result?.length) return;
        setAnswerResults((prev) => {
            const newMap = new Map(prev);
            newMap.set(result[0].questionId, result);
            return newMap;
        });
        setPlayers(prev => prev.map((player) => {
            const playerResult = result.find((r) => r.playerId === player.id);
            console.log("playerResult", playerResult, 'player', player);
            if (!playerResult) return player;
            return { ...player, score: playerResult.score + player.score };
        }));
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

    const onGameOver = () => {
        setIsGameOver(true);
        setPlyersScore((prev) => {
            const newScore = [...prev];
            newScore.sort((a, b) => b.score - a.score);
            return newScore;
        });
    }

    useEffect(() => {
        adimnSocket.on("currentQuestion", onCurrentQuestion);
        return () => {
            adimnSocket.off("currentQuestion", onCurrentQuestion);
        };
    }, [currentQuestion]);

    useEffect(() => {
        adimnSocket.on("totalAnswersResults", onTotalAnswerResult);
        return () => {
            adimnSocket.off("totalAnswersResults", onTotalAnswerResult);
        };
    }, [answerResults, players]);

    useEffect(() => {
        adimnSocket.on("gameData", onGemaData);
        return () => {
            adimnSocket.off("gameData", onGemaData);
        };
    }, [gameData]);

    useEffect(() => {
        adimnSocket.on("timeLeft", onLeftTime);
        return () => {
            adimnSocket.off("timeLeft", onLeftTime);
        };
    }, [timeLeft]);

    useEffect(() => {
        adimnSocket.on("getGameToken", onGetGameToken);
        return () => {
            adimnSocket.off("getGameToken", onGetGameToken);
        };
    }, [gameToken]);

    useEffect(() => {
        adimnSocket.on("newPlayer", onNewPlayer);
        return () => {
            adimnSocket.off("newPlayer", onNewPlayer);
        };
    }, [players]);

    useEffect(() => {
        adimnSocket.on('gameOver', onGameOver);
        return () => {
            adimnSocket.off('gameOver', onGameOver);
        }
    }, [isGameOver, plyersScore]);

    useEffect(() => {
        adimnSocket.connect();
        adimnSocket.on("connect", onConnect);
        adimnSocket.on("gameError", onGameError);

        return () => {
            adimnSocket.off("connect", onConnect);
            adimnSocket.off("gameError", onGameError);
            adimnSocket.disconnect();
        };
    }, []);

    if (!gameData) return <ProgressSpinner className='m-5' />;

    return (
        <>
            <audio autoPlay loop>
                <source src='/background_music.mp3' />
            </audio>

            <GameOverDialog isShow={isGameOver} winner={plyersScore[0]} />

            <div className='flex  bg-purple-800'>
                {!gameStarted && <div className="flex flex-column align-items-center justify-content-center">
                    <div className='text-center text-6xl text-blue-100 font-bold mb-3'>Scan To Join To The
                        {<span className='text-purple-100 text-6xl font-bold mb-3 font-italic'> {gameData.name}</span>} Quiz:</div>
                    <Tooltip target=".qrcode" mouseTrack mouseTrackLeft={10} />
                    <QRCode
                        data-pr-tooltip={`${CLIENT_URL}/live/game/${gameToken}`}
                        className='qrcode surface-200 shadow-8 m-4'
                        value={`${CLIENT_URL}/live/game/${gameToken}`} />
                    <p>{`${CLIENT_URL}/live/game/${gameToken}`}</p>

                    <Button
                        label="Start Game"
                        icon="pi pi-play"
                        className=""
                        onClick={() => adimnSocket.emit("startGame", gameToken)}
                    />

                    {players &&
                        <Players players={players} />}
                    <Toast ref={toast} />
                </div>}

                <div className='m-2 flex-auto'>
                    {currentQuestion &&
                        <LiveGame
                            gameData={gameData}
                            question={currentQuestion}
                            time={timeLeft} />
                    }
                </div>

                <div className='m-2 flex-auto'>
                    {gameStarted && (
                        <DataTable value={plyersScore}>
                            <Column field="playerName" header="Player Name"></Column>
                            <Column field="score" header="Score"></Column>
                        </DataTable>

                    )}
                </div>
            </div>
        </>
    );
}


