import React from 'react';
import Image from 'next/image';

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

export default GoogleLoginButton;
