import { Tooltip } from "primereact/tooltip";
import { PlayerType } from "../../types/dataObjects";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";

export default function Players({ players }: { players: PlayerType[] }) {

    const getRandomColor = () => {
        return {
            backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
            color: '#' + Math.floor(Math.random() * 16777215).toString(16)
        }
    }

    return (
        <div className='mt-5 flex-row flex justify-content-center align-items-center gap-5'>
            {players.map(player => {
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
            })}
        </div>
    )
}