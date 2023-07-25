import { Message } from 'primereact/message';

export default function Error({ error }: { error: Error }) {

    return (
        <div className="card flex align-items-center justify-content-center">
            <Message text={error.message} />
        </div>
    )
}