"use client";

import Image from 'next/image';
import Button from "../PrimaryButton/PrimaryButton";

export default function Model3d() {
    const handleLoginClick = () => {
        console.log('Login clicked!');
    };

    return (
        <div className="flex flex-col md:flex-row items-center md:items-center justify-center p-4 h-[900px]">
            <div className="flex flex-col w-[500px] pt-[60px] pl-[100px]">
                <p className="text-left text-[38px] font-roboto mb-4">
                    Diagnóstico Visual em 3D
                </p>
                <p className="text-[20px] text-gray-600 mb-6">
                    Veja onde está o problema com a tecnologia de Modelagem 3D
                </p>
                <Button text="Iniciar Diagnóstico" onClick={handleLoginClick} />
            </div>
            <div className="flex justify-center">
                <Image 
                    src="/img/model-3d.png"
                    alt="modelo de carro 3D"
                    width={1150}
                    height={850}
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    );
}
