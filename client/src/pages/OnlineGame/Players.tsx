import { Tooltip } from "primereact/tooltip";
import { PlayerType } from "../../types/dataObjects";
import { Tag } from "primereact/tag";

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
                        <Tag
                            value={player.name}
                            className="w-3rem"
                            style={getRandomColor()}>
                        </Tag>
                    </div>
                )
            })}
        </div>
    )
}