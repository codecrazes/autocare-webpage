"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/components/NotificationContext/NotificationContext';
import Logo from '@/components/Logo/Logo';
import StepButtons from '@/components/StepButtons/StepButtons';
import PrimaryInput from '@/components/PrimaryInput/PrimaryInput';
import SecondaryInput from '@/components/SecondaryInput/SecondaryInput';
import SecondaryButton from '@/components/SecondaryButton/SecondaryButton';
import apiFetch from '@/utils/APIFetch';

interface FormData {
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    confirmPassword: string;
    phone_number: string;
}

interface PasswordStrength {
    strength: number;
    message: string;
}

function SignUpForm() {
    const router = useRouter();
    const { addNotification } = useNotification();

    const [formData, setFormData] = useState<FormData>({
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        password: '',
        confirmPassword: '',
        phone_number: ''
    });

    const [currentStep, setCurrentStep] = useState<number>(1);
    const [isRequired, setIsRequired] = useState({
        email: false,
        username: false,
        first_name: false,
        last_name: false,
        password: false,
        confirmPassword: false,
        phone_number: false
    });
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ strength: 0, message: 'Muito Fraca' });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        let formattedValue = value;
        if (name === 'phone_number') {
            formattedValue = formatPhoneNumber(value);
        }

        setFormData((prevFormData) => {
            let newFormData = { ...prevFormData, [name]: formattedValue };

            if (name === 'email') {
                newFormData = {
                    ...newFormData,
                    username: value.split('@')[0]
                };
            }

            return newFormData;
        });

        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    const formatPhoneNumber = (input: string) => {
        const cleaned = input.replace(/\D/g, '');
        let formattedNumber = '';

        if (cleaned.length > 0) formattedNumber = `(${cleaned.slice(0, 2)}`;
        if (cleaned.length >= 3) formattedNumber += `) ${cleaned.slice(2, 7)}`;
        if (cleaned.length >= 8) formattedNumber += `-${cleaned.slice(7, 11)}`;

        return formattedNumber;
    };

    const handleNextStep = (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (currentStep === 1) {
            if (!formData.email || !formData.username) {
                addNotification('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');

                setIsRequired({
                    ...isRequired,
                    email: true,
                    username: true
                });

                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                addNotification('error', 'Erro', 'Formato de e-mail inválido.');

                setIsRequired({
                    ...isRequired,
                    email: true,
                    username: false
                });

                return;
            }
        }

        setCurrentStep(prevStep => prevStep + 1);
    };

    const handlePreviousStep = (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setCurrentStep(prevStep => prevStep - 1);

        setIsRequired({
            email: false,
            username: false,
            first_name: false,
            last_name: false,
            password: false,
            confirmPassword: false,
            phone_number: false
        });
    };

    const handleFocus = (field: keyof FormData) => {
        setIsRequired((prev) => ({
            ...prev,
            [field]: false
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.password || !formData.confirmPassword || !formData.first_name || !formData.last_name) {
            addNotification('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');

            setIsRequired({
                email: true,
                username: true,
                first_name: true,
                last_name: true,
                password: true,
                confirmPassword: true,
                phone_number: false
            });
            return;
        }

        const password = formData.password;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const isValidLength = password.length >= 8;
        const isValidComplexity = [hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length >= 3;

        if (!isValidLength || !isValidComplexity) {
            addNotification('error', 'Erro', 'A senha deve ter pelo menos 8 caracteres, e incluir letras maiúsculas (A-Z), minúsculas (a-z), números (0-9), caracteres especiais (!, @, #, $, etc.).');

            setIsRequired({
                email: false,
                username: false,
                first_name: false,
                last_name: false,
                password: true,
                confirmPassword: true,
                phone_number: false
            });

            return;
        }

        if (formData.password !== formData.confirmPassword) {
            addNotification('error', 'Erro', 'As senhas não coincidem.');

            setIsRequired({
                email: false,
                username: false,
                first_name: false,
                last_name: false,
                password: true,
                confirmPassword: true,
                phone_number: false
            });

            return;
        }

        try {
            const response = await apiFetch('/users/', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Usuário criado:', response.data);
            addNotification('success', 'Sucesso', 'Usuário criado com sucesso!');

            setFormData({
                email: '',
                username: '',
                first_name: '',
                last_name: '',
                password: '',
                confirmPassword: '',
                phone_number: ''
            });

            router.push('/email-confirmation');
        } catch (error: any) {
            console.error('Erro capturado:', error);
            
            console.log('Erro:', error.response);
            console.log('Erro:', error.response.data);
            console.log('Erro:', error.response.data.detail);
            if (error.response && error.response.data && error.response.data.detail) {
                const errorDetail = error.response.data.detail;
                console.log('Detalhes do erro:', errorDetail);

                if (errorDetail === 'Username already exists') {
                    addNotification('error', 'Erro', 'O nome de usuário informado já está em uso.');
                    setCurrentStep(1);
                } else if (errorDetail === 'Email already exists') {
                    addNotification('error', 'Erro', 'Esse e-mail já está cadastrado, tente fazer login.');
                    setCurrentStep(1);
                } else {
                    addNotification('error', 'Erro', `Erro: ${errorDetail}`);
                }
            } else {
                addNotification('error', 'Erro', 'Falha ao criar usuário. Por favor, tente novamente.');
                console.error('Erro sem detalhe esperado:', error);
            }
        }
    };

    const handleLoginClick = () => {
        router.push('/login');
    };

    const calculatePasswordStrength = (password: string): PasswordStrength => {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isValidLength = password.length >= 8;

        let strength = 0;
        if (isValidLength) strength++;
        if (hasUpperCase) strength++;
        if (hasLowerCase) strength++;
        if (hasNumber) strength++;
        if (hasSpecialChar) strength++;

        const messages = [
            'Muito Fraca',
            'Muito Fraca',
            'Fraca',
            'Média',
            'Forte',
            'Muito Forte'
        ];

        return { strength, message: messages[strength] };
    };

    const handleLogoClick = () => {
        router.push('/')
    };

    const handleButtonClick = () => {
        console.log('Account created!');
        router.push('/login')
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="absolute top-6 left-6">
                <Logo link="/" onClick={handleLogoClick} />
            </div>
            <div className="w-full max-w-md bg-white p-6 rounded-md shadow-md">
                <form className="space-y-4" noValidate onSubmit={handleSubmit}>
                    <h1 className="text-2xl font-semibold text-center">Criar Conta</h1>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                        <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(currentStep / 2) * 100}%` }}
                        ></div>
                    </div>
                    {currentStep === 1 && (
                        <>
                            <PrimaryInput
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onFocus={() => setIsRequired({ ...isRequired, email: false })}
                                required={isRequired.email}
                                className="w-full"
                            />
                            <PrimaryInput
                                type="text"
                                placeholder="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                onFocus={() => setIsRequired({ ...isRequired, username: false })}
                                required={isRequired.username}
                                className="w-full"
                            />
                            <StepButtons
                                currentStep={currentStep}
                                handlePreviousStep={handlePreviousStep}
                                handleNextStep={handleNextStep}
                            />
                            <span className="block text-center text-gray-600">
                                Já tem uma conta?{' '}
                                <a
                                    className="text-blue-500 cursor-pointer"
                                    onClick={() => router.push('/login')}
                                >
                                    Entrar
                                </a>
                            </span>
                        </>
                    )}
                    {currentStep === 2 && (
                        <>
                            <PrimaryInput
                                type="text"
                                placeholder="Primeiro Nome"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                onFocus={() => setIsRequired({ ...isRequired, first_name: false })}
                                required={isRequired.first_name}
                                className="w-full"
                            />
                            <PrimaryInput
                                type="text"
                                placeholder="Último Nome"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                onFocus={() => setIsRequired({ ...isRequired, last_name: false })}
                                required={isRequired.last_name}
                                className="w-full"
                            />
                            <SecondaryInput
                                placeholder="Senha"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onFocus={() => setIsRequired({ ...isRequired, password: false })}
                                required={isRequired.password}
                                className="w-full"
                            />
                            <div className="flex items-center space-x-2">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className={`h-2 rounded-full flex-1 ${index < passwordStrength.strength ? 'bg-green-500' : 'bg-gray-300'
                                            }`}
                                    ></div>
                                ))}
                                <span className="text-sm text-gray-500">{passwordStrength.message}</span>
                            </div>
                            <PrimaryInput
                                type="password"
                                placeholder="Confirmar Senha"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                onFocus={() => setIsRequired({ ...isRequired, confirmPassword: false })}
                                required={isRequired.confirmPassword}
                                className="w-full"
                            />
                            <PrimaryInput
                                type="tel"
                                placeholder="Telefone"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                onFocus={() => setIsRequired({ ...isRequired, phone_number: false })}
                                className="w-full"
                            />
                            <StepButtons
                                currentStep={currentStep}
                                handlePreviousStep={handlePreviousStep}
                                handleNextStep={handleNextStep}
                            />
                            <SecondaryButton text="Registrar-se" onClick={(e) => handleSubmit(e as unknown as FormEvent<HTMLFormElement>)} />
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}

export default SignUpForm;
