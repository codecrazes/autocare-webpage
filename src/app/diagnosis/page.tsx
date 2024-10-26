"use client";

import { useState, useEffect, FormEvent, MouseEvent } from 'react';
import jsPDF from 'jspdf';
import LoggedInSection from '@/components/Diagnosis/LoggedIn';
import LoggedOutSection from '@/components/Diagnosis/LoggedOut';
import Logo from '@/components/Logo/Logo';
import MoreThanOneVehicle, { Vehicle as MoreThanOneVehicleType, Vehicle } from '@/components/Diagnosis/MoreThanOneVehicle';
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
import DiagnosisQuestions from '@/components/Diagnosis/DiagnosisFirstQuestion';
import DiagnosisFirstQuestion from '@/components/Diagnosis/DiagnosisFirstQuestion';
import DiagnosisSecondQuestion from '@/components/Diagnosis/DiagnosisSecondQuestion';


interface FormVehicleData {
    brand: string;
    year: string;
    model: string;
}

interface IsRequired {
    brand: boolean;
    year: boolean;
    model: boolean;
    description: boolean;
    street: boolean;
    neighborhood: boolean;
    number: boolean;
    city: boolean;
    state: boolean;
    zip_code: boolean;
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
    const [symptomsMapping, setSymptomsMapping] = useState<{ [key: string]: string[] }>({});
    const [diagnosisQuestions, setDiagnosisQuestions] = useState([
        { id: 1, question: "O veículo faz algum barulho estranho?" },
        { id: 2, question: "Há perda de potência no motor?" },
    ]);
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [firstResponse, setFirstResponse] = useState<boolean | null>(null);
    const [secondResponse, setSecondResponse] = useState<boolean | null>(null);
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
        description: true, 
        street: false,
        neighborhood: false,
        number: false,
        city: false,
        state: false,
        zip_code: false,
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

    // useEffect(() => {
    //     if (problemGenerated) {
    //         setLoading(true);
    //         const token = getToken();

    //         apiFetch(`/diagnosis?problem_id=${problemId}`, {
    //             method: 'POST',
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         })
    //             .then((response) => {
    //                 console.log('Diagnóstico gerado com sucesso:', response);
    //                 addNotification('success', 'Sucesso', 'Diagnóstico gerado com sucesso!');
    //                 localStorage.setItem('diagnosisId', response.id.toString());
    //                 setDiagnosisGenerated(true);
    //                 setLoading(false);
    //             })
    //             .catch((error) => {
    //                 if (error.response?.status === 422) {
    //                     setLoading(false);
    //                     console.error('Erro de validação:', error.response.data.detail);
    //                     addNotification('error', 'Erro', `Erro ao gerar diagnóstico: ${error.response.data.detail.map((e: any) => e.msg).join(', ')}`);
    //                 } else {
    //                     setLoading(false);
    //                     console.error('Erro ao gerar diagnóstico:', error);
    //                     addNotification('error', 'Erro', 'Erro ao gerar diagnóstico.');
    //                 }
    //             });
    //     }
    // }, [problemGenerated]);

    useEffect(() => {
        if (problemGenerated) {
            setLoading(true);
            const token = getToken();
            const vehicleId = localStorage.getItem('selectedVehicleId');

            apiFetch(`/diagnosis/v2`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    vehicle_problem_id: problemId,
                    vehicle_id: vehicleId,
                    symptoms: symptoms
                })
            })
                .then((response) => {
                    console.log('Diagnóstico gerado com sucesso:', response);
                    addNotification('success', 'Sucesso', 'Diagnóstico gerado com sucesso!');
                    localStorage.setItem('diagnosisId', response.id.toString());
                    setDiagnosisGenerated(true);
                    setLoading(false);
                })
                .catch((error) => {
                    addNotification('error', 'Erro', 'Erro ao gerar diagnóstico.');
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        symptomsDisplay = formattedSymptoms.split(',').map((item: string) => item.trim()).join(', ');
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

    const handlePreviousStep = () => {
        setCurrentStep((prevStep) => {
            const prevStepValue = prevStep - 1;
            localStorage.setItem('currentStep', prevStepValue.toString());
            return prevStepValue;
        });
    };

    const handleVehicleRegister = () => {
        if (
            !formVehicleData.brand ||
            !formVehicleData.year ||
            !formVehicleData.model ||
            formVehicleData.brand === 'Selecione a marca do veículo'
        ) {
            addNotification('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');
            setIsRequired((prev) => ({
                ...prev,
                brand: !formVehicleData.brand,
                year: !formVehicleData.year,
                model: !formVehicleData.model,
            }));
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
                const err = error as ErrorResponse;
                if (err.response && err.response.status === 422) {
                    addNotification(
                        'error',
                        'Erro',
                        `Erro ao cadastrar veículo: ${error.response.data.detail.map((e: any) => e.msg).join(', ')}`
                    );
                } else {
                    addNotification('error', 'Erro', 'Erro ao cadastrar veículo.');
                }
            });

        handleNextStep();
    };

    const handleSelectVehicles = (vehicle: MoreThanOneVehicleType) => {
        setSelectedVehicle({
            brand: vehicle.brand,
            year: vehicle.year,
            model: vehicle.model,
            id: vehicle.id
        });
        localStorage.setItem('selectedVehicleId', vehicle.id.toString());
    };

    const handleSelectVehicle = () => {
        vehicles.map(vehicle => {
            setSelectedVehicle(vehicle);
            localStorage.setItem('selectedVehicleId', vehicle.id.toString());
        });
    
        handleNextStep();
    };

    const handleNewVehicle = () => {
        setVehicle(false);
    };

    const handleUpdateAddress = async (): Promise<void> => {
        if (!formAddressData.street || !formAddressData.number || !formAddressData.neighborhood || !formAddressData.city || !formAddressData.state || !formAddressData.zip_code) {
            addNotification('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');
            setIsRequired((prev) => ({
                ...prev,
                street: !formAddressData.street,
                number: !formAddressData.number,
                neighborhood: !formAddressData.neighborhood,
                city: !formAddressData.city,
                state: !formAddressData.state,
                zip_code: !formAddressData.zip_code
            }));
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
            if ((error as ErrorResponse).response?.status === 422) {
                const err = error as ErrorResponse;
                const errorMessage = err.response?.data.detail.map((e: any) => e.msg).join(', ') || 'Erro desconhecido';
                addNotification('error', 'Erro', `Erro ao atualizar endereço: ${errorMessage}`);
            } else {
                addNotification('error', 'Erro', 'Erro ao atualizar endereço.');
            }
        }

        handleNextStep();
    };

    const handleAddressRegister = async (): Promise<void> => {
        if (
            !formAddressData.street ||
            !formAddressData.number ||
            !formAddressData.neighborhood ||
            !formAddressData.city ||
            !formAddressData.state ||
            !formAddressData.zip_code
        ) {
            setIsRequired((prev) => ({
                ...prev,
                street: !formAddressData.street,
                neighborhood: !formAddressData.neighborhood,
                number: !formAddressData.number,
                city: !formAddressData.city,
                state: !formAddressData.state,
                zip_code: !formAddressData.zip_code,
            }));
            return;
        }
    
        const token = getToken();
    
        try {
            const response = await apiFetch('/address', {
                method: 'POST',
                body: JSON.stringify(formAddressData),
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
    
        handleNextStep();
    };

    const handleIaDiagnosis = async (e: FormEvent): Promise<void> => {
        e.preventDefault();

        if (!formIaData.description) {
            addNotification('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');
            setIsRequired((prev) => ({ ...prev, description: !formIaData.description }));
            return;
        }

        const selectedVehicle = localStorage.getItem('selectedVehicleId')
            ? JSON.parse(localStorage.getItem('selectedVehicleId') as string)
            : null;

        if (!selectedVehicle) {
            addNotification('error', 'Erro', 'Por favor, selecione um veículo.');
            return;
        }

        setLoading(true);

        console.log('Veículo selecionado:', selectedVehicle);

        let updatedFormIaData: FormIaData = { ...formIaData, vehicle_id: selectedVehicle };

        console.log('Dados do formulário:', updatedFormIaData);

        const token = getToken();

        try {
            const response = await apiFetch('/problem', {
                method: 'POST',
                body: JSON.stringify(updatedFormIaData),
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Problema cadastrado com sucesso:', response);
            addNotification('success', 'Sucesso', 'Problema cadastrado com sucesso!');
            setProblemId(response.id);

            const iaResponse = await fetch(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyC7cv9t4bGQuWtRt9YBbbolxBDBRvtYNsI',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    {
                                        text: `Você é um assistente virtual especializado em diagnóstico de problemas automotivos. Sua tarefa é gerar duas perguntas de sim/não para ajudar a identificar os sintomas descritos por um usuário. As perguntas devem ser claras, concisas e objetivas.\n\nOs sintomas que você deve identificar são os seguintes, identifique APENAS os sintomas informados, não invente sintomas, use SOMENTE esses que vou te passar agora:\n\n[Ruído ao frear, Pedal de freio baixo, Freios rangendo, Dificuldade para dar partida, Motor falhando em marcha lenta, Ruídos na suspensão, Carro balançando excessivamente, Motor esquentando rápido, Cheiro de líquido de arrefecimento, Freios não assistem corretamente, Luz de freio acesa no painel, Marcha escorregando, Embreagem patinando, Direção puxando para um lado, Carro balançando excessivamente, Vibração ao acelerar, Ruídos na suspensão, Motor ruidoso, Desempenho do motor reduzido, Luzes do painel fracas, Luzes do farol fracas, Manchas de óleo no chão, Vazamento de óleo, Nível de líquido de arrefecimento baixo, Superaquecimento do motor, Equipamentos elétricos não funcionando, Fusíveis queimando frequentemente, Dificuldade ao acionar o freio de mão, Freio de mão travado, Manchas de óleo no chão, Cheiro de óleo queimado, Dificuldade ao acionar o freio de mão, Bateria descarregada, Pedal da embreagem duro, Dificuldade ao acionar o freio de mão, Ruídos ao frear, Freios rangendo, Carro balançando excessivamente, Freio de mão travado, Manchas de óleo no chão, Vazamento de combustível, Luz de pressão dos pneus acesa, Direção puxando para um lado, Ruídos na suspensão, Carro balançando excessivamente, Luzes internas fracas, Equipamentos elétricos não funcionando, Dificuldade para trocar de marcha, Embreagem patinando, Ruído alto no motor, Desempenho do motor reduzido, Falha no sensor de estacionamento, Luz de controle de estabilidade acesa, Direção pesada, Luzes do painel fracas, Carro balançando excessivamente, Suspensão barulhenta, Pedal da embreagem duro, Marcha escorregando, Luzes internas fracas, Luzes do painel fracas, Luz de controle de estabilidade acesa, Sistema de estacionamento autônomo não funciona, Falhas no alarme, Equipamentos elétricos não funcionando, Vibração ao acelerar, Motor ruidoso, Marcha escorregando, Embreagem patinando, Dificuldade para trocar de marcha, Motor falhando em marcha lenta, Equipamentos elétricos não funcionando, Luzes piscando, Pedal de freio baixo, Ruído ao frear, Falhas no alarme, Luzes internas fracas, Motor ruidoso, Aumento no consumo de combustível, Ruído ao frear, Luz de controle de estabilidade acesa, Equipamentos elétricos não funcionando, Luzes piscando, Luzes externas do carro não funcionam, Luzes do painel fracas, Direção puxando para um lado, Ruídos ao girar o volante, Carro balançando excessivamente, Luzes do painel fracas, Luzes internas fracas, Luzes do painel fracas, Manchas de óleo no chão, Cheiro de óleo queimado, Sistema de estacionamento autônomo não funciona, Luz de controle de estabilidade acesa, Suspensão barulhenta, Carro balançando excessivamente, Nível de líquido de arrefecimento baixo, Superaquecimento do motor, Vazamento de combustível, Manchas de óleo no chão, Marcha escorregando, Embreagem patinando, Falhas no alarme, Luzes internas fracas, Bateria descarregada, Luzes internas fracas, Direção pesada, Luzes do painel fracas, Pedal de freio baixo, Luz de controle de estabilidade acesa, Carro balançando excessivamente, Ruídos na suspensão, Vibração ao acelerar, Desempenho do motor reduzido]\n\n**Exemplo de entrada:**\n\n> Estou ouvindo ruídos ao frear e os freios estão rangendo.\n\n**Exemplo de saída em JSON:**\n\n{\n"perguntas": [\n"Você sente alguma vibração no pedal do freio?",\n"O ruído ao frear aumenta com a velocidade?"\n],\n"mapeamento_sintomas": {\n"sim_sim": ["Freios não assistem corretamente", "Ruído ao frear"],\n"sim_nao": ["Freios não assistem corretamente", "Freios rangendo"],\n"nao_sim": ["Ruído ao frear", "Freios rangendo"]\n}\n}\n\nENTRADA: \n\n- ${response.description}\n\nOBS: Você deve responder EXATAMENTE no formato especificado, não quero mais nenhuma explicação ou outro texto, responda SOMENTE com o json:\n\n{\n"perguntas": [],\n"mapeamento_sintomas": {\n"sim_sim": [],\n"sim_nao": [],\n"nao_sim": []\n}\n\nalém disso não invente sintomas para colocar na chave mapeamento_sintomas, APENAS os sintomas que eu te passei, isso é muito importante, repetindo use SOMENTE os sintomas da lista que eu te enviei!!}`
                                    }
                                ]
                            }
                        ]
                    })
                }
            );

            const iaData = await iaResponse.json();

            const perguntas = iaData.candidates[0]?.content?.parts[0]?.text
                ? JSON.parse(iaData.candidates[0].content.parts[0].text).perguntas
                : [];

            const formattedQuestions = perguntas.map((question: string, index: number) => ({
                id: index + 1,
                question
            }));

            const mapeamento_sintomas = iaData.candidates[0]?.content?.parts[0]?.text
                ? JSON.parse(iaData.candidates[0].content.parts[0].text).mapeamento_sintomas
                : [];

            if (mapeamento_sintomas) {
                setSymptomsMapping(mapeamento_sintomas);
            }

            setDiagnosisQuestions(formattedQuestions);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Erro ao gerar diagnóstico:', error);
            addNotification('error', 'Erro', 'Erro ao gerar diagnóstico.');
        }

        handleNextStep(e);
    };

    const handleLocate = (): void => {

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

    const generateDiagnosis = () => {
        const responses: { [key: string]: boolean | null } = {
            1: firstResponse,
            2: secondResponse,
        };

        console.log("Respostas:", responses);

        let responseKey = "";
        const questionIds = Object.keys(responses).sort((a, b) => Number(a) - Number(b));

        questionIds.forEach((questionId, index) => {
            const answer = responses[questionId as keyof typeof responses] ? "sim" : "nao";
            responseKey += index > 0 ? `_${answer}` : answer;
        });

        console.log('Chave de resposta gerada:', responseKey);
        console.log('Mapeamento de sintomas:', symptomsMapping);

        setSymptoms(symptomsMapping[responseKey] || []);

        setProblemGenerated(true);
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
                                        {typeof addressData !== 'string' && (
                                            <ConfirmAddress
                                                currentStep={currentStep}
                                                handlePreviousStep={handlePreviousStep}
                                                handleNextStep={handleNextStep}
                                                changeUpdateAddress={() => setUpdateAddress(true)}
                                                addressData={addressData}
                                            />
                                        )}
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
                        <DiagnosisFirstQuestion
                            question={diagnosisQuestions[0]?.question || ''}
                            setFirstResponse={setFirstResponse}
                            handleNextStep={handleNextStep}
                            handlePreviousStep={handlePreviousStep}
                            currentStep={currentStep}
                        />
                    </>
                )}
                {currentStep === 6 && (
                    <>
                        <DiagnosisSecondQuestion
                            question={diagnosisQuestions[1]?.question || ''}
                            setSecondResponse={setSecondResponse}
                            handleNextStep={handleNextStep}
                            handlePreviousStep={handlePreviousStep}
                            currentStep={currentStep}
                            generateDiagnosis={generateDiagnosis}
                        />
                    </>
                )}
                {currentStep === 7 && (
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
