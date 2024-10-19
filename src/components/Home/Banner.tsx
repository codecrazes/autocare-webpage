"use client"

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Button from '../PrimaryButton/PrimaryButton';

export default function Banner() {
    const router = useRouter();

    const handleLoginClick = () => {
        router.push('/diagnosis');
    };

    return (
        <div className="w-full flex justify-center items-start relative">
            <div className="pt-44 max-w-6xl absolute text-center">
                <h1 className="text-white text-4xl md:text-5xl font-medium leading-tight tracking-tight">
                    Diagnósticos Precisos, Reparos Confiáveis
                </h1>
                <p className="text-white text-lg md:text-xl font-light leading-tight mt-2">
                    Com ajuda de IA identificamos problemas veiculares com precisão
                </p>
                <div className="mt-4">
                    <Button text="Iniciar Diagnósticos" onClick={handleLoginClick} />
                </div>
            </div>
            <Image 
                src="/img/car-banner.png" 
                alt="banner do carro" 
                width={1448} 
                height={600} 
                className="w-full h-[90vh] object-cover" 
                priority
            />
        </div>
    );
}
