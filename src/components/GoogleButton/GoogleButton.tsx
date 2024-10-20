import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import apiFetch from '../../utils/APIFetch';

interface GoogleLoginButtonProps {
    onClick: () => void;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ onClick }) => {
    return (
        <button
            className="w-30 h-10 rounded-full bg-white border border-gray-400 flex items-center justify-start p-2.5 gap-2.5 cursor-pointer"
            onClick={onClick}
        >
            <Image
                src="/img/logo-google.svg"
                alt="Google Logo"
                width={20}
                height={20}
            />
            <div className="font-roboto text-sm font-medium text-gray-800">
                Sign in with Google
            </div>
        </button>
    );
};

const GoogleLoginComponent: React.FC = () => {
    const router = useRouter();
    let isGoogleInitialized = false;

    useEffect(() => {
        const initializeGoogleSignIn = () => {
            if (!isGoogleInitialized) {
                isGoogleInitialized = true;

                const script = document.createElement('script');
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.onload = () => {
                    console.log('Google Sign-In script loaded');
                    if (window.google) {
                        console.log('Initializing Google Sign-In');
                        window.google.accounts.id.initialize({
                            client_id: '744926788933-jonc4p921vmt9qhr58detigs7fiksfr3.apps.googleusercontent.com',
                            callback: handleCredentialResponse
                        });

                        window.google.accounts.id.prompt();
                    }
                };
                script.onerror = () => {
                    console.error('Failed to load Google Sign-In script');
                };
                document.body.appendChild(script);

                return () => {
                    document.body.removeChild(script);
                };
            }
        };

        initializeGoogleSignIn();
    }, []);

    const handleCredentialResponse = async (response: { credential: string }) => {
        console.log('Handling credential response', response);
        if (response.credential) {
            const token = response.credential;
            try {
                const urlencodedData = new URLSearchParams();
                urlencodedData.append('username', 'google_user');
                urlencodedData.append('password', token);

                const res = await apiFetch('/auth/token', {
                    method: 'POST',
                    body: urlencodedData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                localStorage.setItem('token', res.access_token);
                console.log('Login bem-sucedido', res);
                router.push('/');
            } catch (error) {
                console.error('Erro ao fazer login', error);
            }
        } else {
            console.error('No credential received', response);
        }
    };

    return <GoogleLoginButton onClick={() => window.google?.accounts.id.prompt()} />;
};

export default GoogleLoginComponent;
