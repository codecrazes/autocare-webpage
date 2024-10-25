"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Logo from './LogoHide';
import { useRouter } from 'next/navigation';
import ProgressBar from './ProgressBar';
import Image from 'next/image';
import car1 from '../../../public/img/car1.png';
import car2 from '../../../public/img/car2.png';

type Vehicle = {
    model: string;
    brand: string;
};

const carImages = [car1, car2];

interface MoreThanOneVehicleProps {
    vehicles: Vehicle[];
    selectedVehicle: Vehicle | null;
    currentStep: number;
    handlePreviousStep: () => void;
    handleSelectVehicles: (vehicle: Vehicle) => void;
    handleSaveSelectVehicle: () => void;
    handleNewVehicle: () => void;
}

const MoreThanOneVehicle: React.FC<MoreThanOneVehicleProps> = ({
    vehicles,
    selectedVehicle,
    currentStep,
    handlePreviousStep,
    handleSelectVehicles,
    handleSaveSelectVehicle,
    handleNewVehicle,
}) => {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <div className="relative flex flex-col items-center">
            <div className="absolute top-5 left-7 cursor-pointer" onClick={handlePreviousStep}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <Logo />
            <ProgressBar currentStep={currentStep} totalSteps={5} />
            <div className="w-3/4 flex flex-col items-start p-5">
                <h1 className="text-3xl font-normal">Selecione o veículo que está com problemas</h1>
                <div className="flex overflow-x-auto my-4 w-full h-[340px]">
                    {vehicles.map((vehicle, index) => (
                        <div
                            key={`car-${index + 1}`}
                            className={`w-60 h-80 flex flex-col ml-4 p-5 rounded-3xl shadow-md cursor-pointer ${selectedVehicle === vehicle ? 'border-2 border-blue-400' : ''}`}
                            onClick={() => handleSelectVehicles(vehicle)}
                        >
                            <div className={`w-5 h-5 border-2 rounded-full mb-2 transition-colors ${selectedVehicle === vehicle ? 'bg-blue-400 border-blue-400' : 'border-gray-400'}`}></div>
                            <h1 className="text-xl">{vehicle.model}</h1>
                            <p className="text-gray-500">{vehicle.brand}</p>
                            <div className="w-full h-40">
                                <Image className="mt-2 rounded-3xl" src={carImages[index]} alt={`Car ${index + 1}`} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between w-full items-baseline">
                    <button className="bg-blue-500 hover:bg-blue-400 text-white p-3 rounded-full w-12 h-12" onClick={handleSaveSelectVehicle}>
                        <Image className="w-5" src="/img/arrow-rigth.svg" alt="seta para direita" width={24} height={24} />
                    </button>
                    <a onClick={handleNewVehicle} className="text-blue-500 underline cursor-pointer">O veículo não está na lista?</a>
                </div>
            </div>
        </div>
    );
};

export default MoreThanOneVehicle;
