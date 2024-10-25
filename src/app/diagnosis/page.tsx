"use client";

import { useState, useEffect, FormEvent, MouseEvent } from 'react';
import jsPDF from 'jspdf';
import LoggedInSection from '@/components/Diagnosis/LoggedIn';
import LoggedOutSection from '@/components/Diagnosis/LoggedOut';
import Logo from '@/components/Logo/Logo';
import MoreThanOneVehicle from '@/components/Diagnosis/MoreThanOneVehicle';
import OneVehicle from '@/components/Diagnosis/OneVehicle';
import apiFetch from '../../utils/APIFetch';
import { useNotification } from '@/components/NotificationContext/NotificationContext';
import { useRouter } from 'next/navigation';
import NoVehicle from '@/components/Diagnosis/NoVehicle';
import UpdateAddress from '@/components/Diagnosis/UpdateAddress';
import ConfirmAddress from '@/components/Diagnosis/ConfirmAddress';
import RegisterAddress from '@/components/Diagnosis/RegisterAddress';
import DiagnosisForm from '@/components/Diagnosis/DiagnosisForm';
import FailedDiagnosis from '@/components/Diagnosis/FailedDiagnosis';
import SuccessDiagnosis from '@/components/Diagnosis/SuccessDiagnosis';
import { imgData } from '@/utils/Data';
import Spinner from '@/components/Spinner/Spinner';

interface Vehicle {
    brand: string;
    year: number;
    model: string;
    id: number;
}

interface FormVehicleData {
    brand: string;
    year: string;
    model: string;
}

interface IsRequired {
    brand: boolean;
    year: boolean;
    model: boolean;
    description?: boolean;
}

interface AddressData {
    id: number;
    street: string;
    neighborhood: string;
    number: string;
    city: string;
    state: string;
    zip_code: string;
}

interface FormAddressData {
    id: string;
    street: string;
    neighborhood: string;
    number: string;
    city: string;
    state: string;
    zip_code: string;
}

interface ErrorResponse {
    response?: {
        status: number;
        data: {
            detail: { msg: string }[];
        };
    };
}

interface FormIaData {
    description: string;
    vehicle_id: string;
}

interface Diagnosis {
    id: number;
    vehicle_problem_id: number;
    symptoms: string;
    predicted_problem: string;
    description: string;
    service: string;
    price: string;
    price_details: string;
}


const Diagnosis: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [vehicle, setVehicle] = useState<boolean>(false);
    const [moreThanOneVehicle, setMoreThanOneVehicle] = useState<boolean>(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const { addNotification } = useNotification();
    const [address, setAddress] = useState<boolean>(false);
    const [updateAddress, setUpdateAddress] = useState<boolean>(false);
    const [addressData, setAddressData] = useState<string | AddressData>("");
    const [problemGenerated, setProblemGenerated] = useState<boolean>(false);
    const [diagnosisGenerated, setDiagnosisGenerated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [problemId, setProblemId] = useState<number>(0);
    const [formIaData, setFormIaData] = useState<FormIaData>({
        description: '',
        vehicle_id: ''
    });
    const [diagnosis, setDiagnosis] = useState<Diagnosis>({
        id: 0,
        vehicle_problem_id: 0,
        symptoms: '',
        predicted_problem: '',
        description: '',
        service: '',
        price: '',
        price_details: ''
    });
    const [formVehicleData, setFormVehicleData] = useState<FormVehicleData>({
        brand: '',
        year: '',
        model: '',
    });
    const [isRequired, setIsRequired] = useState<IsRequired>({
        brand: false,
        year: false,
        model: false,
        description: false,
    });
    const [formAddressData, setFormAddressData] = useState<FormAddressData>({
        id: '',
        street: '',
        neighborhood: '',
        number: '',
        city: '',
        state: '',
        zip_code: ''
    });
    const router = useRouter();

    const getToken = (): string | null => {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    };

    useEffect(() => {
        if (problemGenerated) {
            setLoading(true);
            const token = getToken();

            apiFetch(`/diagnosis?problem_id=${problemId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    console.log('Diagnóstico gerado com sucesso:', response);
                    addNotification('success', 'Sucesso', 'Diagnóstico gerado com sucesso!');
                    localStorage.setItem('diagnosisId', response.id.toString());
                    setDiagnosisGenerated(true);
                    setLoading(false);
                })
                .catch((error) => {
                    if (error.response?.status === 422) {
                        setLoading(false);
                        console.error('Erro de validação:', error.response.data.detail);
                        addNotification('error', 'Erro', `Erro ao gerar diagnóstico: ${error.response.data.detail.map((e: any) => e.msg).join(', ')}`);
                    } else {
                        setLoading(false);
                        console.error('Erro ao gerar diagnóstico:', error);
                        addNotification('error', 'Erro', 'Erro ao gerar diagnóstico.');
                    }
                });
        }
    }, [problemGenerated]);

    useEffect(() => {
        const id = localStorage.getItem('diagnosisId');
        if (id) {
            setLoading(true);
            const token = getToken();

            apiFetch(`/diagnosis/?diagnosis_id=${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    let symptomsDisplay = '';

                    if (typeof response.symptoms === 'string') {
                        const formattedSymptoms = response.symptoms
                            .replace(/^\[|\]$/g, '')
                            .replace(/'/g, '');
                        symptomsDisplay = formattedSymptoms.split(',').map(item => item.trim()).join(', ');
                    } else if (Array.isArray(response.symptoms)) {
                        symptomsDisplay = response.symptoms.join(', ');
                    } else {
                        symptomsDisplay = response.symptoms;
                    }

                    console.log('Diagnosis response:', response);

                    setDiagnosis({
                        id: response.id,
                        vehicle_problem_id: response.vehicle_problem_id,
                        symptoms: symptomsDisplay,
                        predicted_problem: response.predicted_problem,
                        description: response.problem_details.description,
                        service: response.problem_details.service,
                        price: response.problem_details.price,
                        price_details: response.problem_details.price_details
                    });
                })
                .catch((error) => {
                    console.error('Erro ao buscar dados do diagnóstico:', error);
                }).finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [diagnosisGenerated]);

    useEffect(() => {
        const token = getToken();
        setLoading(true);
        if (token) {
            setIsLoggedIn(true);
            const savedStep = localStorage.getItem('currentStep');
            if (savedStep) {
                setCurrentStep(parseInt(savedStep));
            }

            const id = localStorage.getItem('diagnosisId');
            if (id) {
                setDiagnosisGenerated(true);
            }

            const vehicleId = localStorage.getItem('selectedVehicleId');
            if (vehicleId) {
                setVehicle(true);
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            const token = getToken();
            apiFetch('/vehicle/list', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    const vehiclesData: Vehicle[] = response.vehicles;
                    setVehicles(vehiclesData);

                    if (vehiclesData.length === 1) {
                        setVehicle(true);
                    }
                    if (vehiclesData.length > 1) {
                        setVehicle(true);
                        setMoreThanOneVehicle(true);
                    }
                })
                .catch((error) => {
                    console.error('Erro ao buscar dados do usuário', error);
                });
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn) {
            setAddress(false);
            setUpdateAddress(false);
            const token = getToken();

            apiFetch('/address', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                    console.log('Dados do endereço:', response);
                    const addressData: AddressData = response;
                    setAddressData(addressData);

                    console.log('Endereço:', addressData);

                    if (addressData) {
                        setAddress(true);
                    }
                })
                .catch((error) => {
                    console.error('Erro ao buscar dados do endereço', error);
                });
        }
    }, [isLoggedIn]);

    const handleNextStep = (e?: MouseEvent<HTMLButtonElement | HTMLAnchorElement> | FormEvent) => {
        if (e) {
            e.preventDefault();
        }
        setCurrentStep((prevStep) => {
            const nextStep = prevStep + 1;
            localStorage.setItem('currentStep', nextStep.toString());
            return nextStep;
        });
    };

    const handlePreviousStep = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setCurrentStep((prevStep) => {
            const prevStepValue = prevStep - 1;
            localStorage.setItem('currentStep', prevStepValue.toString());
            return prevStepValue;
        });
    };

    const handleVehicleRegister = (e?: FormEvent) => {
        e.preventDefault();

        if (
            !formVehicleData.brand ||
            !formVehicleData.year ||
            !formVehicleData.model ||
            formVehicleData.brand === 'Selecione a marca do veículo'
        ) {
            addNotification('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');
            setIsRequired({
                brand: !formVehicleData.brand,
                year: !formVehicleData.year,
                model: !formVehicleData.model,
            });
            return;
        }

        const token = getToken();
        apiFetch('/vehicle/', {
            method: 'POST',
            body: JSON.stringify(formVehicleData),
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                addNotification('success', 'Sucesso', 'Veículo cadastrado com sucesso!');
                setVehicle(true);
            })
            .catch((error) => {
                if (error.response && error.response.status === 422) {
                    addNotification(
                        'error',
                        'Erro',
                        `Erro ao cadastrar veículo: ${error.response.data.detail.map((e: any) => e.msg).join(', ')}`
                    );
                } else {
                    addNotification('error', 'Erro', 'Erro ao cadastrar veículo.');
                }
            });

        handleNextStep(e);
    };

    const handleSelectVehicles = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle);
        localStorage.setItem('selectedVehicleId', vehicle.id.toString());
    };

    const handleSelectVehicle = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement, globalThis.MouseEvent> | FormEvent<Element>) => {
        vehicles.map(vehicle => {
            setSelectedVehicle(vehicle);
            localStorage.setItem('selectedVehicleId', vehicle.id.toString());
        });

        handleNextStep(e);
    };

    const handleNewVehicle = () => {
        setVehicle(false);
    };

    const handleUpdateAddress = async (e: FormEvent<HTMLFormElement | HTMLButtonElement>): Promise<void> => {
        e.preventDefault();

        if (!formAddressData.street || !formAddressData.number || !formAddressData.neighborhood || !formAddressData.city || !formAddressData.state || !formAddressData.zip_code) {
            addNotification('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');
            setIsRequired({
                street: !formAddressData.street,
                number: !formAddressData.number,
                neighborhood: !formAddressData.neighborhood,
                city: !formAddressData.city,
                state: !formAddressData.state,
                zip_code: !formAddressData.zip_code
            });
            return;
        }

        const token = getToken();

        try {
            const response = await apiFetch('/address', {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const id = response.id;
            setFormAddressData({ ...formAddressData, id });

            await apiFetch(`/address/`, {
                method: 'PUT',
                body: JSON.stringify(formAddressData),
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            addNotification('success', 'Sucesso', 'Endereço atualizado com sucesso!');
            setAddress(true);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const errorMessage = error.response.data.detail.map((e: any) => e).join(', ');
                addNotification('error', 'Erro', `Erro ao atualizar endereço: ${errorMessage}`);
            } else {
                addNotification('error', 'Erro', 'Erro ao atualizar endereço.');
            }
        }

        handleNextStep(e);
    };

    const handleAddressRegister = async (e: FormEvent<HTMLFormElement | HTMLButtonElement>): Promise<void> => {
        e.preventDefault();

        if (!formAddressData.street || !formAddressData.number || !formAddressData.neighborhood ||
            !formAddressData.city || !formAddressData.state || !formAddressData.zip_code) {
            addNotification('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');
            setIsRequired({
                street: !formAddressData.street,
                neighborhood: !formAddressData.neighborhood,
                number: !formAddressData.number,
                city: !formAddressData.city,
                state: !formAddressData.state,
                zip_code: !formAddressData.zip_code
            });
            return;
        }

        const token = getToken();

        try {
            const response = await apiFetch('/address', {
                method: 'POST',
                body: JSON.stringify(formAddressData),
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            console.log('Endereço cadastrado com sucesso:', response);
            addNotification('success', 'Sucesso', 'Endereço cadastrado com sucesso!');
            setAddress(true);
            setAddressData(response);
        } catch (error) {
            const err = error as ErrorResponse;
            if (err.response && err.response.status === 422) {
                const errorMessage = err.response.data.detail.map((e) => e.msg).join(', ');
                addNotification('error', 'Erro', `Erro ao cadastrar endereço: ${errorMessage}`);
            } else {
                console.error('Erro ao cadastrar endereço:', error);
                addNotification('error', 'Erro', 'Erro ao cadastrar endereço.');
            }
        }

        handleNextStep(e);
    };

    const handleIaDiagnosis = (e: FormEvent): void => {
        e.preventDefault();

        if (!formIaData.description) {
            addNotification('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');
            setIsRequired({ description: !formIaData.description });
            return;
        }

        const selectedVehicle = localStorage.getItem('selectedVehicleId') ?
            JSON.parse(localStorage.getItem('selectedVehicleId') as string) : null;

        if (!selectedVehicle) {
            addNotification('error', 'Erro', 'Por favor, selecione um veículo.');
            return;
        }

        setLoading(true);

        console.log('Veículo selecionado:', selectedVehicle);

        let updatedFormIaData: FormIaData = { ...formIaData, vehicle_id: selectedVehicle };

        console.log('Dados do formulário:', updatedFormIaData);

        const token = getToken();

        apiFetch('/problem', {
            method: 'POST',
            body: JSON.stringify(updatedFormIaData),
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log('Problema cadastrado com sucesso:', response);
                addNotification('success', 'Sucesso', 'Problema cadastrado com sucesso!');
                setProblemGenerated(true);
                setProblemId(response.id);
                setLoading(false);
            })
            .catch((error) => {
                setProblemGenerated(false);
                if (error.response?.status === 422) {
                    setLoading(false);
                    console.error('Erro de validação:', error.response.data.detail);
                    addNotification('error', 'Erro', `Erro ao gerar diagnóstico: ${error.response.data.detail.map((e: any) => e.msg).join(', ')}`);
                } else {
                    setLoading(false);
                    console.error('Erro ao gerar diagnóstico:', error);
                    addNotification('error', 'Erro', 'Erro ao gerar diagnóstico.');
                }
            });

        handleNextStep(e);
    };

    const handleLocate = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();

        let addressString = '';
        if (typeof addressData !== 'string') {
            addressString = `${addressData.street}, ${addressData.number}, ${addressData.neighborhood}, ${addressData.city}, ${addressData.state}, ${addressData.zip_code}`;
        }

        const queryParams = new URLSearchParams({
            address: addressString,
            available_services: diagnosis.service,
        });

        router.push(`/services?${queryParams.toString()}`);
    };

    const generatePDF = (): void => {
        const doc = new jsPDF();

        const backgroundColor = "#F5F5F7";
        const headerColor = "#0071E3";
        const textColor = "#000000";

        doc.setFillColor(backgroundColor);
        doc.rect(0, 0, 210, 297, 'F');

        doc.addImage(imgData, 'PNG', 50, 30, 100, 20);

        doc.setFillColor(headerColor);
        doc.rect(0, 0, 210, 20, 'F');
        doc.setTextColor("#FFFFFF");
        doc.setFontSize(16);
        doc.text("Orçamento veícular", 10, 15);

        const textDetails = [
            { title: "Problema Identificado:", content: diagnosis.predicted_problem },
            { title: "Descrição:", content: diagnosis.description },
            { title: "Sintomas Informados:", content: diagnosis.symptoms },
            { title: "Serviço Recomendado:", content: diagnosis.service },
        ];

        let currentY = 70;

        textDetails.forEach(({ title, content }) => {
            doc.setFontSize(14);
            doc.setTextColor(textColor);
            doc.text(title, 10, currentY);
            doc.setFontSize(12);
            doc.text("\u2022 " + (content || ""), 10, currentY + 10);
            currentY += 20;
        });

        const startX = 10;
        const startY = currentY + 10;
        const cellWidth = 60;
        const cellHeight = 10;

        doc.setFontSize(12);
        doc.text("Preço Médio do Reparo", startX + 5, startY + 12);
        doc.rect(startX, startY + 5, cellWidth, cellHeight);
        doc.rect(startX, startY + 15, cellWidth, cellHeight);
        doc.text(diagnosis.price || "", startX + 5, startY + 22);

        doc.setFontSize(12);
        doc.text("Peças e Valores:", startX + 65, startY + 12);
        doc.rect(startX + 60, startY + 5, cellWidth + 65, cellHeight);
        doc.rect(startX + 60, startY + 15, cellWidth + 65, cellHeight);
        doc.text(diagnosis.price_details || "", startX + 65, startY + 22);

        doc.setFillColor(headerColor);
        doc.rect(0, 277, 210, 20, 'F');
        doc.setTextColor("#FFFFFF");
        doc.setFontSize(10);
        doc.text("Página 1", 10, 285);
        doc.text("Autocare", 180, 285, { align: 'right' });

        doc.save('diagnostico_veicular.pdf');
    };


    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="absolute top-6 left-6">
                <Logo link="/" onClick={() => router.push('/')} />
            </div>
            <div className="bg-white w-[795px]">
                {currentStep === 1 && (
                    <>
                        {isLoggedIn ? (
                            <LoggedInSection currentStep={currentStep} handleNextStep={handleNextStep} />
                        ) : (
                            <LoggedOutSection currentStep={currentStep} handleNextStep={handleNextStep} />
                        )}
                    </>
                )}
                {currentStep === 2 && (
                    <>
                        {vehicle ? (
                            <>
                                {moreThanOneVehicle ? (
                                    <MoreThanOneVehicle
                                        vehicles={vehicles}
                                        selectedVehicle={selectedVehicle}
                                        currentStep={currentStep}
                                        handlePreviousStep={handlePreviousStep}
                                        handleSelectVehicles={handleSelectVehicles}
                                        handleSaveSelectVehicle={handleSelectVehicle}
                                        handleNewVehicle={handleNewVehicle}
                                    />
                                ) : (
                                    <OneVehicle
                                        vehicles={vehicles}
                                        currentStep={currentStep}
                                        handlePreviousStep={handlePreviousStep}
                                        handleSelectVehicle={handleSelectVehicle}
                                        handleNewVehicle={handleNewVehicle}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                <NoVehicle
                                    currentStep={currentStep}
                                    handlePreviousStep={handlePreviousStep}
                                    handleVehicleRegister={handleVehicleRegister}
                                    isRequired={isRequired}
                                    formVehicleData={formVehicleData}
                                    setFormVehicleData={setFormVehicleData}
                                    setIsRequired={setIsRequired}
                                />
                            </>
                        )}
                    </>
                )}
                {currentStep === 3 && (
                    <>
                        {address ? (
                            <>
                                {updateAddress ? (
                                    <>
                                        <UpdateAddress
                                            currentStep={currentStep}
                                            handlePreviousStep={handlePreviousStep}
                                            handleUpdateAddress={handleUpdateAddress}
                                            isRequired={isRequired}
                                            formAddressData={formAddressData}
                                            setFormAddressData={setFormAddressData}
                                            setIsRequired={setIsRequired}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <ConfirmAddress
                                            currentStep={currentStep}
                                            handlePreviousStep={handlePreviousStep}
                                            handleNextStep={handleNextStep}
                                            changeUpdateAddress={() => setUpdateAddress(true)}
                                            addressData={addressData}
                                        />
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <RegisterAddress
                                    currentStep={currentStep}
                                    formAddressData={formAddressData}
                                    handlePreviousStep={handlePreviousStep}
                                    setFormAddressData={setFormAddressData}
                                    handleAddressRegister={handleAddressRegister}
                                    isRequired={isRequired}
                                />
                            </>
                        )}
                    </>
                )}
                {currentStep === 4 && (
                    <>
                        <DiagnosisForm
                            currentStep={currentStep}
                            handlePreviousStep={handlePreviousStep}
                            handleIaDiagnosis={handleIaDiagnosis}
                            isRequired={isRequired}
                            formIaData={formIaData}
                            setFormIaData={setFormIaData}
                            setIsRequired={setIsRequired}
                        />
                    </>
                )}
                {currentStep === 5 && (
                    <>
                        {loading ? (
                            <div className='w-full h-full flex justify-center items-center'>
                                <Spinner />
                            </div>
                        ) : (
                            diagnosisGenerated ? (
                                <SuccessDiagnosis
                                    currentStep={currentStep}
                                    handlePreviousStep={handlePreviousStep}
                                    diagnosis={diagnosis}
                                    handleLocate={handleLocate}
                                    generatePDF={generatePDF}
                                />
                            ) : (
                                <FailedDiagnosis
                                    currentStep={currentStep}
                                    handlePreviousStep={handlePreviousStep}
                                />
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Diagnosis;
