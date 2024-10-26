"use client";

import PrimaryButton from '../PrimaryButton/PrimaryButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import Logo from './LogoHide';
import ProgressBar from './ProgressBar';

interface DiagnosisFirstQuestionProps {
    question: string;
    setFirstResponse: (response: boolean | null) => void;
    handleNextStep: () => void;
    handlePreviousStep: (e: React.MouseEvent<HTMLDivElement>) => void;
    currentStep: number;
}

const DiagnosisFirstQuestion: React.FC<DiagnosisFirstQuestionProps> = ({
    question,
    setFirstResponse,
    handleNextStep,
    handlePreviousStep,
    currentStep,
}) => {
    const handleYes = () => {
        setFirstResponse(true);
        handleNextStep();
    };

    const handleNo = () => {
        setFirstResponse(false);
        handleNextStep();
    };

    return (
        <div className="relative w-[795px] h-screen bg-white flex flex-col items-center">
            <div className="absolute top-5 left-7 cursor-pointer" onClick={handlePreviousStep}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <Logo />
            <ProgressBar currentStep={currentStep} totalSteps={7} />

            <div className="w-[600px] flex flex-col items-start py-5">
                <p className="text-lg font-medium text-gray-700 mb-6">
                    {question}
                </p>

                <div className="flex justify-between w-[150px]">
                    <PrimaryButton text="Sim" onClick={handleYes} />
                    <PrimaryButton text="Não" onClick={handleNo} />
                </div>
            </div>
        </div>
    );
};

export default DiagnosisFirstQuestion;
