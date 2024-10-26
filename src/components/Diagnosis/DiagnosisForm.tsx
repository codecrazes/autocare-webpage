"use client";

import { FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import ProgressBar from './ProgressBar';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import { problemList } from '@/utils/Data';
import Logo from './LogoHide';

type FormIaData = {
    description: string;
};

interface DiagnosisFormProps {
    currentStep: number;
    handlePreviousStep: (e: React.MouseEvent<HTMLDivElement>) => void;
    handleIaDiagnosis: (e?: FormEvent) => void;
    isRequired: { description: boolean };
    formIaData: FormIaData;
    setFormIaData: React.Dispatch<React.SetStateAction<FormIaData>>;
    setIsRequired: React.Dispatch<React.SetStateAction<{ description: boolean }>>;
}

const DiagnosisForm: React.FC<DiagnosisFormProps> = ({
    currentStep,
    handlePreviousStep,
    handleIaDiagnosis,
    isRequired,
    formIaData,
    setFormIaData,
    setIsRequired,
}) => {
    const router = useRouter();

    const fillRandomProblem = (): void => {
        const randomProblem = problemList[Math.floor(Math.random() * problemList.length)];
        setFormIaData({ ...formIaData, description: randomProblem });
    }

    const handleFocus = (field: keyof FormIaData) => {
        setIsRequired((prev) => ({
            ...prev,
            [field]: false,
        }));
    };

    return (
        <div className="relative w-[795px] h-screen bg-white flex flex-col items-center">
            <div className="absolute top-5 left-7 cursor-pointer" onClick={handlePreviousStep}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <Logo />
            <ProgressBar currentStep={currentStep} totalSteps={7} />

            <div className="w-[600px] flex flex-col items-start py-5">
                <h1 className="text-2xl font-normal">Ótimo, agora poderia descrever o seu problema?</h1>
                <p className="text-lg text-gray-600 mt-2">
                    Descreva o problema da melhor forma possível para que nossa IA entenda
                </p>

                <form className="flex flex-col w-full mt-5">
                    <textarea
                        className="w-full h-40 bg-gray-100 rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                        placeholder="Qual o problema?"
                        name="problem"
                        value={formIaData.description}
                        onFocus={() => handleFocus('description')}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                            setFormIaData({ ...formIaData, description: e.target.value })
                        }
                        required={isRequired.description}
                        maxLength={500}
                    />
                </form>

                <div className="flex justify-between w-full mt-5">
                    <button className="bg-blue-500 hover:bg-blue-400 text-white p-3 rounded-full w-12 h-12" onClick={handleIaDiagnosis}>
                        <Image className="w-5" src="/img/arrow-rigth.svg" alt="seta para direita" width={24} height={24} />
                    </button>

                    <a
                        className="text-blue-600 underline cursor-pointer"
                        onClick={() => router.push('/services')}
                    >
                        Já sei o meu problema →
                    </a>
                </div>
            </div>
            <button
                type="button"
                className="mt-4 text-blue-500 hover:underline"
                onClick={fillRandomProblem}
            >
                Preencher Aleatoriamente
            </button>
        </div>
    );
};

export default DiagnosisForm;
