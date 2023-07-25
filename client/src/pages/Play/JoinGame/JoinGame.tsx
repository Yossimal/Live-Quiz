import { userSocket } from "../../../common/sockets";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";


export default function JoinGame() {
    const navigate = useNavigate();

    const [name, setName] = useState<string>("");
    const { gameToken } = useParams<{ gameToken: string }>();

    useEffect(() => {
        if (!gameToken) return;
        userSocket.connect();
        userSocket.on('connect', () => {
            console.log('connected');
            userSocket.on('playerJoined', player => {
                console.log(player);
                navigate(`/live/quiz/${gameToken}/play/${player.id}`);
            });
        });
    }, [gameToken]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold">Join Game</h1>
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
        </div>
    )
}
