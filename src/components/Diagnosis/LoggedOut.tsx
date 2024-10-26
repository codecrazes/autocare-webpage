"use client"

import Logo from '@/components/Diagnosis/Logo';
import ProgressBar from '@/components/Diagnosis/ProgressBar';
import { useRouter } from 'next/navigation';

interface LoggedOutSectionProps {
    currentStep: number;
    handleNextStep: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const LoggedOutSection: React.FC<LoggedOutSectionProps> = ({ currentStep, handleNextStep }) => {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <div className="flex flex-col items-center">
            <Logo />
            <ProgressBar currentStep={currentStep} totalSteps={7} />
            <div className="diagnosisForm-content flex flex-col items-start w-[600px] h-full p-5">
                <h1 className="text-black font-inter text-3xl font-normal leading-snug">
                    Bem-vindo ao Diagnóstico Inteligente da AutoCare
                </h1>
                <p className="text-gray-600 font-inter text-xl font-normal leading-relaxed mt-3">
                    Nossa inteligência artificial resolverá seu problema com rapidez, fazendo apenas algumas perguntas.
                </p>
                <p className="text-gray-600 font-inter text-xl font-normal leading-relaxed mt-3">
                    Já possui uma conta?
                </p>
                <div className="diagnosis-content-div flex flex-row justify-between w-full items-baseline mt-4 cursor-pointer">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-2 font-medium text-sm w-[130px]"
                        onClick={() => handleNavigation('/login')}
                    >
                        <span className="block py-2">Login</span>
                    </button>
                    <a
                        className="text-blue-600 underline cursor-pointer text-xl"
                        onClick={handleNextStep}
                    >
                        Continuar sem login ->
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoggedOutSection;
