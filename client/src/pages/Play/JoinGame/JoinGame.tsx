import { userSocket } from "../../../common/sockets";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { GameData } from "../../../types/dataObjects";
import { useSession } from "../../../hooks/useSession";
import Loader from "../../../components/Loader";


export default function JoinGame() {
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();

    const [name, setName] = useState<string>("");
    const { gameToken } = useParams<{ gameToken: string }>();
    const [gameData, setGameData] = useSession<GameData | null>('game', null);

    const onConnect = () => {
        if (!gameToken) return;
        console.log('connected');
        userSocket.emit('getGameData', gameToken);
    }

    const onGetGameData = (game: GameData) => {
        console.log(`game data: ${JSON.stringify(game)}`);
        setGameData(game);
    }

    const onGameError = (error: string) => {
        console.log(error);
        toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: error,
            life: 3000
        });
    }

    useEffect(() => {
        userSocket.connect();
        userSocket.on('connect', onConnect);
        userSocket.on('gameData', onGetGameData);
        userSocket.on('gameError', onGameError);

        return () => {
            userSocket.off('connect', onConnect);
            userSocket.off('gameError', onGameError);
            userSocket.off('gameData', onGetGameData);
            userSocket.disconnect();
        }
    }, []);

    if (!gameData) return <Loader />;

    return (
        <div className="flex flex-column align-items-center justify-content-center gap-3">
            <h1 className="text-3xl font-bold">Join To {gameData.name}</h1>
            <InputText
                className="w-1/2"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Button
                className="w-1/2 mt-2"
                label="Join"
                disabled={!name || !gameToken}
                onClick={() => navigate(`/live/game/${gameToken}/play/${name}`, {
                    state: {
                        game: gameData
                    }
                })}
            />
            <h5 className="mt-5">{gameData.description}</h5>
            <Toast ref={toast} />
        </div>
    )
}
