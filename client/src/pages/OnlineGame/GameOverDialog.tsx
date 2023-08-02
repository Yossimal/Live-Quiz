import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { PlayerInGameType } from "../../types/dataObjects";

type Props = {
    isShow: boolean;
    winner: PlayerInGameType
}

export default function GameOverDialog({ isShow, winner }: Props) {
    const navigate = useNavigate();

    return (
        <Dialog
            draggable={false}
            header="Game Over!"
            visible={isShow}
            position="top"

            style={{ width: "50vw" }}
            onHide={() => {
                navigate('/home')
            }}
            footer={
                <div>
                    <Button label="Ok" onClick={() => {
                        navigate('/home')
                    }} />
                </div>
            }
        >
            <div className='flex flex-column justify-content-center align-items-center'>
                <div className='text-6xl text-purple-300 font-bold mb-3'>Game Over</div>
                <div className='text-6xl text-purple-700 font-bold mb-3'>Winner: {winner?.playerName}</div>
                <div className='text-6xl text-yellow-200 font-bold mb-3'>Score: {winner?.score}</div>
            </div>
        </Dialog>
    )
}