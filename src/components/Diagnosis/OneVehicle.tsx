"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Logo from './LogoHide';
import ProgressBar from './ProgressBar';
import PrimaryButton from '../PrimaryButton/PrimaryButton';

type Vehicle = {
    model: string;
    brand: string;
};

interface OneVehicleProps {
    currentStep: number;
    vehicles: Vehicle[];
    handlePreviousStep: (e: React.MouseEvent<HTMLDivElement>) => void;
    handleSelectVehicle: () => void;
    handleNewVehicle: () => void;
}

const OneVehicle: React.FC<OneVehicleProps> = ({
    currentStep,
    vehicles,
    handlePreviousStep,
    handleSelectVehicle,
    handleNewVehicle,
}) => {
    const router = useRouter();

    return (
        <div className="relative flex flex-col items-center">
            <div className="absolute top-5 left-7 cursor-pointer" onClick={handlePreviousStep}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <Logo />
            <ProgressBar currentStep={currentStep} totalSteps={5} />
            <div className="flex flex-col items-start w-3/4 p-5">
                <h1 className="text-3xl font-normal mb-4">
                    Hum, parece que você precisa de ajuda com esse veículo, certo?
                </h1>
                <div className="flex flex-col gap-4 items-center justify-center w-full mt-[10px] mb-[10px]">
                    {vehicles.map((vehicle) => (
                        <div key={vehicle.model} className="w-60 h-[300px] flex flex-col p-5 rounded-3xl shadow-md">
                            <div className="flex-1">
                                <h1 className="text-lg font-semibold">{vehicle.model}</h1>
                                <p className="text-gray-600">{vehicle.brand}</p>
                            </div>
                            <div className="w-full h-40">
                                <Image
                                    src="/img/car1.png"
                                    alt="Car"
                                    width={200}
                                    height={200}
                                    className="rounded-3xl"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center w-full mt-4">
                    <PrimaryButton text="Sim, prosseguir" onClick={handleSelectVehicle} />
                    <button
                        onClick={handleNewVehicle}
                        className="text-blue-500 underline cursor-pointer"
                    >
                        Preciso de ajuda com outro veículo →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OneVehicle;
