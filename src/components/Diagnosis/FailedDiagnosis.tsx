"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Logo from './LogoHide';
import ProgressBar from './ProgressBar';
import PrimaryButton from '../PrimaryButton/PrimaryButton';

interface FailedDiagnosisProps {
    currentStep: number;
    handlePreviousStep: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const FailedDiagnosis: React.FC<FailedDiagnosisProps> = ({
    currentStep,
    handlePreviousStep,
}) => {
    const router = useRouter();

    return (
        <div className="relative w-[795px] h-screen bg-white flex flex-col items-center">
            <div className="absolute top-5 left-7 cursor-pointer" onClick={handlePreviousStep}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <Logo />
            <ProgressBar currentStep={currentStep} totalSteps={5} />

            <div className="flex flex-col items-start w-[600px] h-full p-5">
                <h1 className="text-black text-3xl font-normal">
                    Infelizmente não conseguimos diagnosticar seu problema por aqui
                </h1>
                <p className="text-gray-500 text-lg font-normal mt-4">
                    Mas não se preocupe, nosso time de especialista vai te ajudar!
                </p>
                <p className="text-gray-500 text-lg font-normal mb-4">
                    Agende uma visita a uma das nossas ofícinas parceiras...
                </p>

                <div className="flex flex-row justify-between w-full pt-4 items-baseline">
                    <PrimaryButton text="Localizar oficina" onClick={() => router.push("/services")} />
                    <a
                        onClick={() => router.push("/faq")}
                        className="text-blue-600 underline text-lg cursor-pointer"
                    >
                        Preciso de ajuda →
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FailedDiagnosis;
