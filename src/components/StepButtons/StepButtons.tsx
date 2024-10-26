import React, { FormEvent } from 'react';
import Image from 'next/image';

interface StepButtonsProps {
    currentStep: number;

    handlePreviousStep: (e: FormEvent<HTMLButtonElement>) => void;

    handleNextStep: (e: FormEvent<HTMLButtonElement>) => void;
}

const StepButtons: React.FC<StepButtonsProps> = ({ currentStep, handlePreviousStep, handleNextStep }) => {
    return (
        <div className="flex justify-end gap-2 pl-[225px] pt-2.5 pb-3.5">
            {currentStep === 1 && (
                <>
                    <button
                        className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center cursor-not-allowed opacity-50"
                        disabled
                    >
                        <Image src="/img/arrow-left.svg" alt="seta para esquerda" width={24} height={24} />
                    </button>
                    <button
                        className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center"
                        onClick={handleNextStep}
                    >
                        <Image src="/img/arrow-rigth.svg" alt="seta para direita" width={24} height={24} />
                    </button>
                </>
            )}
            {currentStep === 2 && (
                <>
                    <button
                        className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center"
                        onClick={handlePreviousStep}
                    >
                        <Image src="/img/arrow-left.svg" alt="seta para esquerda" width={24} height={24} />
                    </button>
                    <button
                        className="w-12 h-12 rounded-full bg-neutral-800 cursor-not-allowed opacity-50 flex items-center justify-center"
                        disabled
                    >
                        <Image src="/img/arrow-rigth.svg" alt="seta para direita" width={24} height={24} />
                    </button>
                </>
            )}
        </div>
    );
};

export default StepButtons;
