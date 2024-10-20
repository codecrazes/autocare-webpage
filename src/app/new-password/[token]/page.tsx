"use client"

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import apiFetch from '../../../utils/APIFetch';
import { useNotification } from '../../../components/NotificationContext/NotificationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import closedEye from '../../../../public/img/closed-eye.svg';
import openEye from '../../../../public/img/open-eye.svg';
import Logo from '@/components/Logo/Logo';

interface FormData {
    password: string;
    confirmPassword: string;
}

interface IsRequired {
    password: boolean;
    confirmPassword: boolean;
}

interface TokenProps {
    params: { token?: string };
}

const NewPassword = ({ params }: TokenProps) => {
    const router = useRouter();

    const { token } = params;
    const { addNotification } = useNotification();

    const [formData, setFormData] = useState<FormData>({
        password: '',
        confirmPassword: '',
    });

    const [isRequired, setIsRequired] = useState<IsRequired>({
        password: false,
        confirmPassword: false,
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleFocus = (field: keyof IsRequired) => {
        setIsRequired((prev) => ({
            ...prev,
            [field]: false,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const { password, confirmPassword } = formData;

        if (!password || !confirmPassword) {
            addNotification('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');
            setIsRequired({
                password: !password,
                confirmPassword: !confirmPassword,
            });
            return;
        }

        if (password !== confirmPassword) {
            addNotification('error', 'Erro', 'As senhas não coincidem.');
            setIsRequired({
                password: true,
                confirmPassword: true,
            });
            return;
        }

        setRequestStatus('loading');

        try {
            await apiFetch(`/auth/new-password/${token}?password=${password}`);
            setRequestStatus('success');
            addNotification('success', 'Sucesso', 'Senha redefinida com sucesso!');
            router.push('/login');
        } catch (error: any) {
            console.error('Erro ao redefinir a senha:', error);
            setRequestStatus('error');
            addNotification('error', 'Erro', 'Ocorreu um erro ao redefinir a senha.');
        }
    };

    let content;
    if (requestStatus === 'loading') {
        content = <p className="text-center">Aguarde enquanto redefinimos sua senha...</p>;
    } else if (requestStatus === 'success') {
        content = (
            <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6">
                <div className='flex flex-row'>
                    <div className="cursor-pointer" onClick={() => router.push('/login')}>
                        <FontAwesomeIcon icon={faArrowLeft} className="text-2xl text-gray-800" />
                    </div>
                    <h1 className="text-xl font-semibold mt-4">Senha redefinida com sucesso!</h1>
                </div>
                <p className="text-gray-600">Você já pode fazer login com sua nova senha.</p>
            </div>
        );
    } else if (requestStatus === 'error') {
        content = (
            <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6">
                <div className='flex flex-row'>
                    <div className="cursor-pointer" onClick={() => router.push('/login')}>
                        <FontAwesomeIcon icon={faArrowLeft} className="text-2xl text-gray-800" />
                    </div>
                    <h1 className="text-xl font-semibold mt-4">Ocorreu um erro ao redefinir a senha.</h1>
                </div>
                <p className="text-gray-600">Por favor, tente novamente.</p>
            </div>
        );
    } else {
        content = (
            <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6">
                <div className='flex flex-row'>
                    <div className="cursor-pointer mr-2" onClick={() => router.push('/login')}>
                        <FontAwesomeIcon icon={faArrowLeft} className="text-2xl text-gray-800" />
                    </div>
                    <h1 className="text-xl font-semibold">Redefinir Senha</h1>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col items-center mt-4">
                    <div className="relative w-72 mt-4">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Senha"
                            value={formData.password}
                            onChange={handleChange}
                            onFocus={() => handleFocus('password')}
                            className={`w-full h-12 px-4 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 ${isRequired.password ? 'border border-red-500' : ''}`}
                        />
                        <Image
                            src={showPassword ? closedEye : openEye}
                            alt="Toggle password visibility"
                            onClick={togglePasswordVisibility}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            width={20}
                            height={20}
                        />
                    </div>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirme a senha"
                        onFocus={() => handleFocus('confirmPassword')}
                        className={`w-72 h-12 px-4 mt-4 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 ${isRequired.confirmPassword ? 'border border-red-500' : ''}`}
                    />
                    <button type="submit" className="w-72 h-12 mt-6 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
                        Redefinir Senha
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="absolute top-6 left-6">
                <Logo link="/" onClick={() => router.push('/')} />
            </div>
            <div className='w-[400px]'>
                {content}
            </div>
        </div>
    );
};

export default NewPassword;
