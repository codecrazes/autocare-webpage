"use client"

import Image from 'next/image';
import Logo from '@/components/Diagnosis/Logo';
import ProgressBar from '@/components/Diagnosis/ProgressBar';
import { useRouter } from 'next/navigation';

interface LoggedInSectionProps {
    currentStep: number;
    handleNextStep: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const LoggedInSection: React.FC<LoggedInSectionProps> = ({ currentStep, handleNextStep }) => {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <div className="flex flex-col items-center">
            <Logo link="/" onClick={() => handleNavigation('/')} />
            <ProgressBar currentStep={currentStep} totalSteps={7} />
            <div className="diagnosisForm-content flex flex-col items-start w-[600px] h-full p-5">
                <h1 className="text-black font-inter text-3xl font-normal leading-snug">
                    Bem-vindo ao Diagnóstico Inteligente da AutoCare
                </h1>
                <p className="text-gray-600 font-inter text-xl font-normal leading-relaxed mt-3">
                    Nossa inteligência artificial resolverá seu problema com rapidez, fazendo apenas algumas perguntas.
                </p>
                <a
                    href="https://comofuncionaautocare.com.br"
                    className="text-blue-600 underline text-xl mt-4 cursor-pointer"
                >
                    Como funciona
                </a>
                <button
                    className="mt-4 bg-blue-600 hover:bg-blue-700 rounded-full w-[50px] h-[50px] flex justify-center items-center"
                    onClick={handleNextStep}
                >
                    <Image className="diagnosis-content-btn-icon" src="/img/arrow-rigth.svg" alt="seta para direita" width={24} height={24} />
                </button>
            </div>
        </div>
    );
};

export default LoggedInSection;
