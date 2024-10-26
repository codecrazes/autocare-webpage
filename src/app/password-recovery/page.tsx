"use client"

import { useState, FocusEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import apiFetch from '../../utils/APIFetch';
import { useNotification } from '../../components/NotificationContext/NotificationContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Logo from '@/components/Logo/Logo';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons/faGooglePlusG';
import { faApple } from '@fortawesome/free-brands-svg-icons/faApple';
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons/faMicrosoft';

const PasswordRecovery = () => {
    const router = useRouter();
    const { addNotification } = useNotification();

    const [email, setEmail] = useState<string>('');
    const [requestStatus, setRequestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [isRequired, setIsRequired] = useState<{ email: boolean }>({ email: false });

    const handleFocus = (field: 'email') => {
        setIsRequired((prev) => ({
            ...prev,
            [field]: false,
        }));
    };

    const redirectToEmailProvider = (provider: 'google' | 'apple' | 'microsoft') => {
        const urls = {
            google: 'https://mail.google.com',
            apple: 'https://www.icloud.com',
            microsoft: 'https://outlook.live.com',
        };
        window.location.href = urls[provider];
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!email) {
            addNotification('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');
            setIsRequired({ email: true });
            return;
        }

        setRequestStatus('loading');

        try {
            await apiFetch(`/users/new-password/${email}`, { method: 'PUT' });
            setRequestStatus('success');
            addNotification('success', 'Sucesso', 'Email de recuperação enviado com sucesso!');
        } catch (error: any) {
            console.error('Erro ao enviar email de recuperação:', error);
            setRequestStatus('error');
            addNotification('error', 'Erro', error.response?.data?.detail || 'Ocorreu um erro ao enviar o email de recuperação.');
        }
    };

    let content;
    if (requestStatus === 'loading') {
        content = <p className="text-center">Aguarde enquanto enviamos o email de recuperação...</p>;
    } else if (requestStatus === 'success') {
        content = (
            <div className="flex flex-col items-center bg-white rounded-lg shadow-md p-6">
                <h1 className="text-xl font-semibold">Email de recuperação enviado!</h1>
                <p>Verifique sua caixa de entrada para instruções.</p>
                <span>Acesse seu provedor</span>
                <div className="flex gap-4 mt-4">
                    <button
                        className="w-[50px] h-[50px] p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                        onClick={() => redirectToEmailProvider('google')}
                    >
                        <FontAwesomeIcon icon={faGooglePlusG} className="text-xl" />
                    </button>
                    <button
                        className="w-[50px] h-[50px] p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                        onClick={() => redirectToEmailProvider('apple')}
                    >
                        <FontAwesomeIcon icon={faApple} className="text-xl" />
                    </button>
                    <button
                        className="w-[50px] h-[50px] p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                        onClick={() => redirectToEmailProvider('microsoft')}
                    >
                        <FontAwesomeIcon icon={faMicrosoft} className="text-xl" />
                    </button>
                </div>
            </div>
        );
    } else if (requestStatus === 'error') {
        content = (
            <div className="flex flex-col items-center">
                <div className="cursor-pointer" onClick={() => router.refresh()}>
                    <FontAwesomeIcon icon={faArrowLeft} className="text-2xl" />
                </div>
                <h1 className="text-xl font-semibold">Ocorreu um erro ao enviar o email de recuperação</h1>
                <p className="text-center mt-2">Por favor, verifique o email inserido e tente novamente.</p>
            </div>
        );
    } else {
        content = (
            <form noValidate onSubmit={handleSubmit} className="flex flex-col items-center bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold mb-4">Recuperação de Senha</h1>
                <input
                    type="email"
                    placeholder="Digite seu email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => handleFocus('email')}
                    required={isRequired.email}
                    className={`w-72 p-3 rounded-lg border ${isRequired.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring`}
                />
                <button
                    type="submit"
                    className="mt-6 w-72 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-700 transition-all"
                >
                    Enviar e-mail de Recuperação
                </button>
            </form>
        );
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="absolute top-4 left-4">
                <Logo link="/" onClick={() => router.push('/')} />
            </div>
            <div className='w-[400px]'>
                {content}
            </div>
        </div>
    );
};

export default PasswordRecovery;
