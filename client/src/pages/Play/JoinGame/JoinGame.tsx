import { userSocket } from "../../../common/sockets";
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { PlayerType } from "../../../types/dataObjects";


export default function JoinGame() {
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();

    const [name, setName] = useState<string>("");
    const { gameToken } = useParams<{ gameToken: string }>();
    const gameName = useRef<string>("");

    const onConnect = () => {
        console.log('connected');
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

    const onPlayerJoined = (player: PlayerType) => {
        if (!gameToken) return;
        console.log(`player ${JSON.stringify(player)}`);
        gameName.current = player.gameName;
        navigate(`/live/game/${gameToken}/play/${player.id}`, {
            state: {
                player
            }
        });
    }

    useEffect(() => {
        userSocket.connect();
        userSocket.on('connect', onConnect);
        userSocket.on('gameError', onGameError);
        userSocket.on('playerJoined', onPlayerJoined);

        return () => {
            userSocket.off('connect', onConnect);
            userSocket.off('playerJoined', onPlayerJoined);
            userSocket.off('gameError', onGameError);
            userSocket.disconnect();
        }
    }, []);

    return (
        <div className="flex flex-column align-items-center justify-content-center gap-3">
            <h1 className="text-3xl font-bold">Join To {gameName.current}</h1>
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
                onClick={() => userSocket.emit('joinGame', gameToken!, name)}
            />
            <Toast ref={toast} />
        </div>
    )
}
