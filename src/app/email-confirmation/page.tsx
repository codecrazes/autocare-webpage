"use client"

import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo/Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGooglePlusG, faApple, faMicrosoft } from '@fortawesome/free-brands-svg-icons';

const EmailConfirmation: React.FC = () => {
    const router = useRouter();

    const redirectToEmailProvider = (provider: string) => {
        switch (provider) {
            case 'google':
                window.location.href = 'https://mail.google.com';
                break;
            case 'apple':
                window.location.href = 'https://www.icloud.com';
                break;
            case 'microsoft':
                window.location.href = 'https://outlook.live.com';
                break;
            default:
                break;
        }
    };

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="absolute top-6 left-6">
                <Logo link="/" onClick={() => handleNavigation('/')} />
            </div>
            <div className="flex flex-col items-center bg-white rounded-lg shadow-md text-center p-8 w-96">
                <h1 className="text-2xl font-semibold mb-4">Confirmação de e-mail</h1>
                <p className="mb-4">
                    Um e-mail de confirmação foi enviado para o endereço informado. Por favor, verifique sua caixa de entrada e clique no link de confirmação.
                </p>
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
        </div>
    );
};

export default EmailConfirmation;
