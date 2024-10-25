"use client";

import { useState, FormEvent, ChangeEvent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import Logo from './LogoHide';
import ProgressBar from './ProgressBar';
import PrimaryInput from '../PrimaryInput/PrimaryInput';
import PrimarySelect from '../PrimarySelect/PrimarySelect';
import PrimaryButton from '../PrimaryButton/PrimaryButton';
import { carBrands } from '@/utils/Data';

type FormVehicleData = {
    brand: string;
    model: string;
    year: string;
};

interface NoVehicleProps {
    currentStep: number;
    handlePreviousStep: (e: React.MouseEvent<HTMLDivElement>) => void;
    handleVehicleRegister: (e?: FormEvent) => void;
    isRequired: { brand: boolean; model: boolean; year: boolean };
    formVehicleData: FormVehicleData;
    setFormVehicleData: React.Dispatch<React.SetStateAction<FormVehicleData>>;
    setIsRequired: React.Dispatch<React.SetStateAction<{ brand: boolean; model: boolean; year: boolean }>>;
}

const NoVehicle: React.FC<NoVehicleProps> = ({
    currentStep,
    handlePreviousStep,
    handleVehicleRegister,
    isRequired,
    formVehicleData,
    setFormVehicleData,
    setIsRequired,
}) => {
    const router = useRouter();

    const [showCustomBrandInput, setShowCustomBrandInput] = useState<boolean>(false);

    const handleBrandChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const selectedBrand = e.target.value;
        setFormVehicleData({ ...formVehicleData, brand: selectedBrand });

        if (selectedBrand === "Veículo não está na lista") {
            setFormVehicleData({ ...formVehicleData, brand: '' });
            setShowCustomBrandInput(true);
        } else {
            setShowCustomBrandInput(false);
        }
    };

    const handleFocus = (field: keyof FormVehicleData) => {
        setIsRequired((prev) => ({
            ...prev,
            [field]: false,
        }));
    };

    return (
        <div className="relative flex flex-col items-center">
            <div className="absolute top-5 left-7 cursor-pointer" onClick={handlePreviousStep}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <Logo />
            <ProgressBar currentStep={currentStep} totalSteps={5} />
            <div className="flex flex-col items-start w-3/4 p-5">
                <h1 className="text-3xl font-normal mb-4">Forneça as informações do seu veículo</h1>
                <p className="text-lg text-gray-500 mb-6">
                    Para prosseguir, precisamos de algumas informações sobre o veículo que está com problemas.
                </p>
                <form className="w-full flex flex-col gap-4">
                    {showCustomBrandInput ? (
                        <PrimaryInput
                            placeholder="Digite a marca do veículo"
                            name="brand"
                            value={formVehicleData.brand}
                            onFocus={() => handleFocus('brand')}
                            onChange={(e) => setFormVehicleData({ ...formVehicleData, brand: e.target.value })}
                            required={isRequired.brand}
                        />
                    ) : (
                        <PrimarySelect
                            name="brand"
                            value={formVehicleData.brand}
                            onFocus={() => handleFocus('brand')}
                            onChange={handleBrandChange}
                            required={isRequired.brand}
                            options={[
                                { label: 'Selecione a marca do veículo', value: '' },
                                ...carBrands.map((brand) => ({ label: brand, value: brand })),
                            ]}
                        />
                    )}
                    <PrimaryInput
                        placeholder="Modelo"
                        name="model"
                        value={formVehicleData.model}
                        onFocus={() => handleFocus('model')}
                        onChange={(e) => setFormVehicleData({ ...formVehicleData, model: e.target.value })}
                        required={isRequired.model}
                    />
                    <PrimaryInput
                        placeholder="Ano"
                        name="year"
                        value={formVehicleData.year}
                        onFocus={() => handleFocus('year')}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,4}$/.test(value)) {
                                setFormVehicleData({ ...formVehicleData, year: value });
                            }
                        }}
                        required={isRequired.year}
                    />
                </form>
                <div className="flex justify-between items-center w-full mt-4">
                    <PrimaryButton text="Cadastrar veículo" onClick={handleVehicleRegister} />
                    <a
                        onClick={() => router.push('/faq')}
                        className="text-blue-500 underline cursor-pointer"
                    >
                        Preciso de ajuda →
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NoVehicle;
