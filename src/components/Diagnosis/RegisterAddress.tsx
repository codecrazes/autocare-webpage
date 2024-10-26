import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { addressList } from '@/utils/Data';
import Logo from './LogoHide';
import ProgressBar from './ProgressBar';
import PrimaryInput from '../PrimaryInput/PrimaryInput';
import PrimaryButton from '../PrimaryButton/PrimaryButton';

interface AddressData {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
}

interface RegisterAddressComponentProps {
    currentStep: number;
    formAddressData: AddressData;
    handlePreviousStep: (e: React.MouseEvent<HTMLDivElement>) => void;
    setFormAddressData: React.Dispatch<React.SetStateAction<AddressData>>;
    handleAddressRegister: () => void;
    isRequired: Record<keyof AddressData, boolean>;
}

const RegisterAddressComponent: React.FC<RegisterAddressComponentProps> = ({
    currentStep,
    formAddressData,
    handlePreviousStep,
    setFormAddressData,
    handleAddressRegister,
    isRequired,
}) => {
    const router = useRouter();
    const [isRequiredState, setIsRequired] = useState(isRequired);

    const handleFocus = (field: keyof AddressData) => {
        setIsRequired((prev) => ({
            ...prev,
            [field]: false,
        }));
    };

    const fillRandomAddress = (): void => {
        const randomAddress = addressList[Math.floor(Math.random() * addressList.length)];
        setFormAddressData(randomAddress);
    };

    return (
        <div className="relative w-[795px] h-screen bg-white flex flex-col items-center">
            <div className="absolute top-5 left-7 cursor-pointer" onClick={handlePreviousStep}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <Logo />
            <ProgressBar currentStep={currentStep} totalSteps={7} />

            <div className="flex flex-col items-start w-[600px] py-5">
                <h1 className="text-2xl font-semibold">
                    Por favor, forneça seu endereço
                </h1>
                <p className="text-lg text-gray-600 mt-1">
                    Precisamos dessa informação para encontrar o parceiro mais próximo de você!
                </p>

                <form className="flex flex-col gap-2 w-full">
                    <PrimaryInput
                        type="text"
                        placeholder="Logradouro"
                        name="street"
                        value={formAddressData.street}
                        onFocus={() => handleFocus('street')}
                        onChange={(e) =>
                            setFormAddressData({ ...formAddressData, street: e.target.value })
                        }
                        required={isRequiredState.street}
                    />
                    <PrimaryInput
                        type="text"
                        placeholder="Número"
                        name="number"
                        value={formAddressData.number}
                        onFocus={() => handleFocus('number')}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setFormAddressData({ ...formAddressData, number: value });
                        }}
                        required={isRequiredState.number}
                    />
                    <PrimaryInput
                        type="text"
                        placeholder="Bairro"
                        name="neighborhood"
                        value={formAddressData.neighborhood}
                        onFocus={() => handleFocus('neighborhood')}
                        onChange={(e) =>
                            setFormAddressData({
                                ...formAddressData,
                                neighborhood: e.target.value,
                            })
                        }
                        required={isRequiredState.neighborhood}
                    />
                    <PrimaryInput
                        type="text"
                        placeholder="Cidade"
                        name="city"
                        value={formAddressData.city}
                        onFocus={() => handleFocus('city')}
                        onChange={(e) =>
                            setFormAddressData({ ...formAddressData, city: e.target.value })
                        }
                        required={isRequiredState.city}
                    />
                    <PrimaryInput
                        type="text"
                        placeholder="Estado"
                        name="state"
                        value={formAddressData.state}
                        onFocus={() => handleFocus('state')}
                        onChange={(e) =>
                            setFormAddressData({ ...formAddressData, state: e.target.value })
                        }
                        required={isRequiredState.state}
                    />
                    <PrimaryInput
                        type="text"
                        placeholder="CEP"
                        name="zip_code"
                        value={formAddressData.zip_code}
                        onFocus={() => handleFocus('zip_code')}
                        onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length > 5) {
                                value = `${value.slice(0, 5)}-${value.slice(5, 8)}`;
                            }
                            setFormAddressData({ ...formAddressData, zip_code: value });
                        }}
                        required={isRequiredState.zip_code}
                    />
                </form>

                <div className="flex justify-between items-center w-full mt-4">
                    <PrimaryButton
                        text="Cadastrar endereço"
                        onClick={handleAddressRegister}
                    />
                    <a
                        className="text-blue-500 mt-4 hover:underline cursor-pointer"
                        onClick={() => router.push('/faq')}
                    >
                        Preciso de ajuda &rarr
                    </a>
                </div>
            </div>

            <button
                type="button"
                className="mt-4 text-blue-500 hover:underline"
                onClick={fillRandomAddress}
            >
                Preencher Aleatoriamente
            </button>
        </div>
    );
};

export default RegisterAddressComponent;
