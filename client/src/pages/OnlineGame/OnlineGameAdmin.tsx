import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAxios } from '../../hooks/useAxios';
import { useQuery } from 'react-query';
import { QuestionType, QuizType } from '../../types/dataObjects';

const socket = io('http://localhost:3000', {
    autoConnect: false
});


export default function OnlineGameAdmin() {
    //const { id } = useParams<{ id: string }>();
    const id = 1;
    // const navigate = useNavigate();
    // const { instance } = useAxios();
    // useEffect(() => {
    //     if (!instance) navigate("/");
    // }, [instance]);

    // const [currentQuestion, setCurrentQuestion] = useState<QuestionType | null>(null);


    // const { data, isLoading, error } = useQuery({
    //     queryKey: ['online-game'],
    //     queryFn:
    //         async () => {
    //             const { data } = await instance!.get<QuizType>(`/quiz/${id}`);
    //             return data;
    //         }
    // });

    // if (isLoading) return <h1>loading</h1>;
    // if (error) return <h1>error</h1>;
    // if (!data) return <h1>no data</h1>;

    useEffect(() => {
        socket.connect();
        socket.on('connect', () => {
            console.log('connected');
            // socket.emit('open-game', id);

            // socket.on('get-token-game', (token) => {
            //     console.log(`token game: ${token}`);
            // });
        });

        return () => {
            socket.off('connect', () => {
                console.log('disconnected');
            });
        }
    }, []);

    return (
        <div>
            <h1>Online Game Admin</h1>
            <div>

            </div>
        </div>
    )
}



