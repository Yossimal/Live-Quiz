import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAxios } from '../../hooks/useAxios';
import { useQuery } from 'react-query';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { PlayerType, QuestionType, QuizType, QuestionOptionType } from '../../types/dataObjects';
import { adimnSocket } from '../../common/sockets'
import Error from "../../components/Error";
import Loader from "../../components/Loader"
import CurrentQuestionOnLiveGame from '../../components/CurrentQuestionOnLiveGame';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';


export default function OnlineGameAdmin() {
    const { id } = useParams<{ id: string }>();
    const { instance } = useAxios();

    const [players, setPlayers] = useState<PlayerType[]>();
    const [gameToken, setGameToken] = useLocalStorage('gameToken', '');
    const [timeLeft, setTimeLeft] = useState<number>(0);

    const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['online-game'],
        queryFn:
            async () => {
                const { data } = await instance!.get<QuizType>(`/quiz/${id}`);
                return data;
            }
    });

    useEffect(() => {
        if (!data) return;
        adimnSocket.connect();
        adimnSocket.on('connect', () => {
            console.log('connected');

            adimnSocket.emit('openGame', data.id);

            adimnSocket.on('getGameToken', token => {
                console.log(`token: ${token}`);
                setGameToken(token);
            });

            adimnSocket.on('newPlayer', player => {
                setPlayers(prev => {
                    if (!prev) return [player];
                    return [...prev, player];
                });
            });

            adimnSocket.on('timeLeft', time => {
                setTimeLeft(time);
            });

            adimnSocket.on('currentQuestion', question => {
                setCurrentQuestion(question);
            });

            adimnSocket.on('totalAnswerResult', result => {
                console.log(result);
            });
        });

        return () => {
            adimnSocket.off('connect', () => {
                console.log('disconnected');
            });
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

            <h2>Game Link: {`http://localhost:5173/live/game/${gameToken}`}</h2>

            <Button
                label="Start Game"
                className="p-button-success w-2"
                onClick={() => adimnSocket.emit('startGame', gameToken)}
            />

            <div>
                {currentQuestion &&
                    <CurrentQuestionOnLiveGame
                        question={currentQuestion}
                        onSelectedOption={onSelectedOption}
                        time={timeLeft} />
                }
            </div>

            <div className='mb-auto'>
                {players &&
                    players.map(player => {
                        return (
                            <div key={player.id} className='flex-auto'>
                                <Avatar
                                    label={player.name}
                                    size="large"
                                    className="p-overlay-badge"
                                    style={getRandomColor()}>
                                    {player.score && <Badge value={player.score} />}
                                </Avatar>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}



