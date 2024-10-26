"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Logo from './LogoHide';
import ProgressBar from './ProgressBar';
import PrimaryButton from '../PrimaryButton/PrimaryButton';

interface AddressData {
    id: number;
    street: string;
    neighborhood: string;
    number: string;
    city: string;
    state: string;
    zip_code: string;
}

interface ConfirmAddressProps {
    currentStep: number;
    handlePreviousStep: () => void;
    handleNextStep: () => void;
    changeUpdateAddress: () => void;
    addressData: AddressData;
}

const ConfirmAddress: React.FC<ConfirmAddressProps> = ({
    currentStep,
    handlePreviousStep,
    handleNextStep,
    changeUpdateAddress,
    addressData,
}) => {
    return (
        <div className="flex flex-col items-center h-screen bg-white relative">
            <div
                className="absolute left-7 top-5 cursor-pointer"
                onClick={handlePreviousStep}
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>

            <Logo />
            <ProgressBar currentStep={currentStep} totalSteps={7} />

            <div className="flex flex-col items-start w-[600px] p-5">
                <h1 className="text-black text-3xl font-normal mb-5">
                    Localizamos esse endereço cadastrado, está correto?
                </h1>
                <ul>
                    <li className="text-black text-lg font-normal mb-2">
                        {addressData.street}, {addressData.number}, {addressData.neighborhood}, {addressData.city} - {addressData.state}, {addressData.zip_code}
                    </li>
                </ul>

                <div className="flex flex-row justify-between w-full pt-4 items-baseline">
                    <PrimaryButton text="Sim, prosseguir" onClick={handleNextStep} />
                    <a
                        onClick={changeUpdateAddress}
                        className="text-blue-500 underline cursor-pointer"
                    >
                        Preciso atualizar meu endereço -&gt;
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ConfirmAddress;
