"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiFetch from '@/utils/APIFetch';
import Logo from '@/components/Logo/Logo';

interface EmailConfirmatedProps {
  params: { token?: string };
}

const EmailConfirmated = ({ params }: EmailConfirmatedProps) => {
  const router = useRouter();
  const { token } = params;
  const [confirmationStatus, setConfirmationStatus] = useState<'pending' | 'confirmed' | 'error'>('pending');

  useEffect(() => {
    if (token) {
      apiFetch(`/auth/confirm/${token}`)
        .then(() => {
          setConfirmationStatus('confirmed');
        })
        .catch((error) => {
          console.error('Erro ao confirmar e-mail:', error);
          setConfirmationStatus('error');
        });
    }
  }, [token]);

  const handleLoginClick = () => {
    router.push('/login');
  };

  let content;
  if (confirmationStatus === 'pending') {
    content = <p>Aguarde enquanto confirmamos seu e-mail...</p>;
  } else if (confirmationStatus === 'confirmed') {
    content = (
      <div className="flex flex-col items-center">
        <h1 className="font-bold mb-5">E-mail confirmado com sucesso!</h1>
        <button
          className="rounded-lg border bg-blue-600 text-white font-bold py-2 px-4 transition-colors duration-300 hover:bg-blue-500"
          onClick={handleLoginClick}
        >
          Entrar
        </button>
      </div>
    );
  } else if (confirmationStatus === 'error') {
    content = (
      <div className="flex flex-col items-center">
        <h1 className="font-bold mb-5">Ocorreu um erro ao confirmar seu e-mail.</h1>
        <p className="text-gray-600">Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="absolute top-6 left-6">
        <Logo link="/" onClick={() => router.push('/')} />
      </div>
      <div className="bg-white rounded-lg shadow-lg p-10 w-full max-w-md text-center">
        {content}
      </div>
    </div>
  );
};

export default EmailConfirmated;
