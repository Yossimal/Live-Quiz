import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';
import { useNavigate } from "react-router-dom";
import { QuizType } from "../../types/dataObjects";
import quizImgPlaceholder from "../../assets/quiz-placeholder.jpg";


export default function QuizItem({ quiz }: { quiz: QuizType }) {
    const navigate = useNavigate();

    return (
        <div className="col-12">
            <div className="flex flex-column lg:flex-row lg:align-items-center p-4 lg:gap-2">
                <img className="shadow-2 lg:w-3 md:w-4 border-round" src={quiz.image || quizImgPlaceholder} alt={quiz.name} />
                <div className="flex flex-column sm:flex-row justify-content-between align-items-center lg:align-items-start flex-1 gap-2">
                    <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                        <div className="text-2xl font-bold text-900">{quiz.name}</div>
                        <span className="flex align-items-center gap-2">
                            <i className="pi pi-user"></i>
                            <span className="font-semibold">{quiz._count?.onlineGames || 0} Plays</span>
                        </span>
                        <div className="flex align-items-center gap-3">
                            <span className="flex align-items-center gap-2">
                                <i className="pi pi-book"></i>
                                <span className="font-semibold">{quiz._count?.questions || 0} Questions</span>
                            </span>
                        </div>
                    </div>
                    <div className="card">
                        <Fieldset legend="Description" toggleable>
                            <p className="m-0">
                                {quiz.description}
                            </p>
                        </Fieldset>
                    </div>
                    <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                        <Button tooltipOptions={{ position: 'top' }} tooltip='Play Quiz' icon="pi pi-play" className="p-button-rounded" onClick={() => navigate(`/home/quiz/play/${quiz.id}`)}></Button>
                        <Button tooltipOptions={{ position: 'bottom' }} tooltip='Edit Quiz' icon="pi pi-pencil" className="p-button-rounded" onClick={() => navigate(`/home/quiz/edit/${quiz.id}`)}></Button>
                    </div>
                </div>
            </div>
        </div>
    );
}