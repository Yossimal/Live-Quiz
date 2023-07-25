import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAxios } from '../../hooks/useAxios';
import { useQuery } from 'react-query';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { PlayerType, QuestionType, QuizType, QuestionOptionType, AnswerResultType } from '../../types/dataObjects';
import { adimnSocket } from '../../common/sockets'
import Error from "../../components/Error";
import Loader from "../../components/Loader"
import CurrentQuestionOnLiveGame from '../../components/CurrentQuestionOnLiveGame';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';


export default function OnlineGameAdmin() {
    const { id } = useParams<{ id: string }>();
    const { instance } = useAxios();

    const [players, setPlayers] = useState<PlayerType[]>();
    const [gameToken, setGameToken] = useLocalStorage('gameToken', '');
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [gameStarted, setGameStarted] = useState<boolean>(false);


    const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['online-game'],
        queryFn:
            async () => {
                const { data } = await instance!.get<QuizType>(`/quiz/${id}`);
                return data;
            }
    });

    const onConnect = () => {
        if (!data) return;
        console.log('connected');
        adimnSocket.emit('openGame', data.id);
    }

    const onGetGameToken = (token: string) => {
        console.log(`token: ${token}`);
        setGameToken(token);
    }

    const onNewPlayer = (player: PlayerType) => {
        setPlayers(prev => {
            if (!prev) return [player];
            return [...prev, player];
        });
    }

    const onLeftTime = (time: number) => {
        setTimeLeft(time);
    }
    const onCurrentQuestion = (question: QuestionType) => {
        if (!gameStarted) {
            setGameStarted(true);
        }
        setCurrentQuestion(question);
    }

    const onTotalAnswerResult = (result: AnswerResultType[]) => {
        console.log(result);
    }

    useEffect(() => {
        adimnSocket.connect();
        adimnSocket.on('connect', onConnect);
        adimnSocket.on('getGameToken', onGetGameToken);
        adimnSocket.on('newPlayer', onNewPlayer);
        adimnSocket.on('timeLeft', onLeftTime);
        adimnSocket.on('currentQuestion', onCurrentQuestion);
        adimnSocket.on('totalAnswerResult', onTotalAnswerResult);

        return () => {
            adimnSocket.off('connect', onConnect);
            adimnSocket.off('getGameToken', onGetGameToken);
            adimnSocket.off('newPlayer', onNewPlayer);
            adimnSocket.off('timeLeft', onLeftTime);
            adimnSocket.off('currentQuestion', onCurrentQuestion);
            adimnSocket.off('totalAnswerResult', onTotalAnswerResult);
            adimnSocket.disconnect();
        }
    }, [data]);


    if (isLoading) return <Loader />
    if (isError) return <Error error={error as Error} />
    if (!data) return <h1>no data</h1>;

    const quiz = data;

    const onSelectedOption = (option: QuestionOptionType) => {
        console.log(option);
    };

    const getRandomColor = () => {
        return {
            backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
            color: '#' + Math.floor(Math.random() * 16777215).toString(16)
        }
    }

    return (
        <div className='flex flex-column justify-content-center align-items-center'>
            <h1>{quiz.name}</h1>

            {!gameStarted && <h2>Game Link: {`http://localhost:5173/live/game/${gameToken}`}</h2>}

            {!gameStarted && <Button
                label="Start Game"
                className="p-button-success w-2"
                onClick={() => adimnSocket.emit('startGame', gameToken)}
            />}

            <div className='w-6'>
                {currentQuestion &&
                    <CurrentQuestionOnLiveGame
                        question={currentQuestion}
                        onSelectedOption={onSelectedOption}
                        time={timeLeft} />
                }
            </div>

            <div className='absolute bottom-0 mb-3 flex-row flex justify-content-center align-items-center gap-5'>
                {players &&
                    players.map(player => {
                        return (
                            <div key={player.id} className='flex-auto card'>
                                <Tooltip target=".avtar" mouseTrack mouseTrackLeft={10} />

                                <Avatar
                                    data-pr-tooltip={player.name}
                                    label={player.name.charAt(0).toUpperCase()}
                                    size="large"
                                    className="p-overlay-badge avtar"
                                    style={getRandomColor()}>
                                    {player.score !== 0 && <Badge value={player.score} />}
                                </Avatar>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}



