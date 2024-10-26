"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Logo from './LogoHide';
import ProgressBar from './ProgressBar';
import PrimaryButton from '../PrimaryButton/PrimaryButton';

interface SuccessDiagnosisProps {
    currentStep: number;
    handlePreviousStep: (e: React.MouseEvent<HTMLDivElement>) => void;
    diagnosis: {

        symptoms: string;

        price: string;

    };
    handleLocate: () => void;
    generatePDF: () => void;
}

const SuccessDiagnosis: React.FC<SuccessDiagnosisProps> = ({
    currentStep,
    handlePreviousStep,
    diagnosis,
    handleLocate,
    generatePDF
}) => {
    const router = useRouter();

    return (
        <div className="relative w-[795px] h-screen bg-white flex flex-col items-center">
            <div className="absolute top-5 left-7 cursor-pointer" onClick={handlePreviousStep}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>

            <Logo />
            <ProgressBar currentStep={currentStep} totalSteps={7} />

            <div className="flex flex-col items-start w-[600px] h-full p-5">
                <h1 className="text-black text-3xl font-normal mb-6">Veja o resultado do seu diagnóstico</h1>

                <div>
                    <div className="flex flex-row items-center w-[553px] h-[75px] rounded-[34px] bg-gray-100 mb-4">
                        <div className='p-6'>
                            <Image src="/img/pin.svg" alt="Pin" width={27} height={27} />
                        </div>
                        <p className="text-gray-600 text-lg font-normal">
                            Problemas identificados: {diagnosis.symptoms}
                        </p>
                    </div>

                    <div className="flex flex-row items-center w-[553px] h-[75px] rounded-[34px] bg-gray-100 mb-4">
                        <div className='p-6'>
                            <Image src="/img/dollar.svg" alt="Dollar" width={27} height={27} />
                        </div>
                        <p className="text-gray-600 text-lg font-normal">Auto orçamento: {diagnosis.price},00</p>
                    </div>

                    <div className="flex flex-row items-center w-[553px] h-[75px] rounded-[34px] bg-gray-100 mb-4 cursor-pointer" onClick={generatePDF}>
                        <div className='p-6'>
                            <Image src="/img/link.svg" alt="Diagnóstico" width={27} height={27} />
                        </div>
                        <p className="text-gray-600 text-lg font-normal">
                            <u>Fazer Download do orçamento</u>
                        </p>
                    </div>
                </div>

                <p className="w-[471px] text-gray-600 text-lg font-normal mt-3">
                    Vamos achar a oficina mais próxima para realizar o serviço!
                </p>

                <div className="flex flex-row justify-between w-full pt-4 items-baseline">
                    <PrimaryButton text="Localizar oficina" onClick={handleLocate} />
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

export default SuccessDiagnosis;
