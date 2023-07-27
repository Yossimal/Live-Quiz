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
        <div className='my-5 flex-row overflow-auto flex justify-content-center align-items-center gap-5'>
            {players.map(player => {
                return (
                    <div key={player.id} className='flex-auto card'>
                        <Tag
                            value={player.name}
                            className="p-3 text-2xl font-bold"
                            style={getRandomColor()}>
                        </Tag>
                    </div>
                )
            })}
        </div>
    )
}