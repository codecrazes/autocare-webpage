"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/components/NotificationContext/NotificationContext';
import Logo from '@/components/Logo/Logo';
import GoogleLoginButton from '@/components/GoogleButton/GoogleButton';
import PrimaryInput from '@/components/PrimaryInput/PrimaryInput';
import SecondaryButton from '@/components/SecondaryButton/SecondaryButton';
import SecondaryInput from '@/components/SecondaryInput/SecondaryInput';

interface FormData {
    username: string;
    password: string;
    rememberMe: boolean;
}

interface IsRequired {
    email: boolean;
    password: boolean;
}

const Login: React.FC = () => {
    const router = useRouter();
    const { addNotification } = useNotification();

    const [formData, setFormData] = useState<FormData>({
        username: '',
        password: '',
        rememberMe: false,
    });

    const [isRequired, setIsRequired] = useState<IsRequired>({
        email: false,
        password: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleFocus = (field: keyof IsRequired) => {
        setIsRequired((prev) => ({
            ...prev,
            [field]: false,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            addNotification('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');
            setIsRequired({
                email: !formData.username,
                password: !formData.password,
            });
            return;
        }

        console.log('Chamando endpoint de autenticação');
        const response = true;

        if (response) {
            addNotification('success', 'Sucesso', 'Login bem-sucedido!');
            const token = 'dummy_token';

            if (formData.rememberMe) {
                localStorage.setItem('token', token);
            } else {
                sessionStorage.setItem('token', token);
            }

            router.push('/');
        } else {
            addNotification('error', 'Erro', 'Falha no login. Verifique suas credenciais e tente novamente.');
        }
    };

    const handleRegisterClick = () => {
        router.push('/register');
    };

    const handleForgetPasswordClick = () => {
        console.log('Forget password clicked');
        addNotification('info', 'Esqueceu a senha', 'Adicionar lógica de recuperação de senha.');
    };

    const handleLogoClick = () => {
        router.push('/');
    };

    const handleGoogleLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        console.log('Google login button clicked');
        addNotification('info', 'Google Login', 'Tentativa de login via Google.');
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="absolute top-0 left-0 p-6">
                <Logo link="/" onClick={handleLogoClick} />
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-[422px] h-[532px]">
                <h1 className="text-2xl font-medium mb-4">Entrar</h1>
                <GoogleLoginButton onClick={handleGoogleLogin} aria-label="Login com Google" />
                <span className="text-gray-600 text-sm mt-4 mb-4">Ou use sua conta</span>
                <form className="w-full flex flex-col gap-4" noValidate onSubmit={handleSubmit}>
                    <PrimaryInput
                        type="text"
                        placeholder="Email"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        onFocus={() => handleFocus('email')}
                        required={isRequired.email}
                        aria-label="Email"
                        className={`w-full ${isRequired.email ? 'border-red-500' : ''}`}
                    />
                    <SecondaryInput
                        placeholder="Senha"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => handleFocus('password')}
                        required={isRequired.password}
                        aria-label="Senha"
                        className={`w-full ${isRequired.password ? 'border-red-500' : ''}`}
                    />
                    <div className="flex items-center justify-between mt-4">
                        <label className="flex items-center text-gray-600 text-sm">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="mr-2"
                                aria-label="Lembre de mim"
                            />
                            Lembre de mim
                        </label>
                    </div>
                    <SecondaryButton text="Entrar" type="submit" aria-label="Entrar" className="w-full mt-4" />
                    <div className="text-center mt-4">
                        <a className="text-blue-500 text-sm cursor-pointer" onClick={handleForgetPasswordClick} aria-label="Esqueceu sua senha?">
                            Esqueceu sua senha?
                        </a>
                    </div>
                    <div className="text-center mt-2">
                        <span className="text-sm text-gray-600">
                            Não tem uma conta?{' '}
                            <a className="text-blue-500 cursor-pointer" onClick={handleRegisterClick} aria-label="Registrar-se">
                                Registre-se
                            </a>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
