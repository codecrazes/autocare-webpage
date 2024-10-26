"use client";

import Button from "../PrimaryButton/PrimaryButton";

export default function Service() {

    const handleClick = () => {
        console.log('button clicked!');
    };

    return (
        <div className="bg-gray-100 w-full py-12 flex flex-col items-center">
            <p className="text-4xl font-semibold mb-8">Nossos Serviços</p>
            <div
                className="bg-cover bg-center rounded-3xl w-[1208px] h-[400px] mb-8 relative"
                style={{ backgroundImage: "url('/img/mechanic.jpg')" }}
            >
                <p className="absolute top-6 left-8 text-white text-5xl font-bold">
                    Encontre mecânicas de todo o Brasil
                </p>
                <div className="absolute bottom-8 left-8">
                    <Button text="Agendar Serviço" onClick={handleClick}/>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-[1200px]">
                <div className="relative">
                    <div
                        className="bg-cover bg-center rounded-2xl w-[590px] h-[400px] p-4 flex flex-col justify-between"
                        style={{ backgroundImage: "url('/img/car-model-primary.png')" }}
                    >
                        <p className="text-white text-3xl font-bold mb-2 p-4">
                            Busque informações sobre seu veículo
                        </p>
                        <div className="absolute bottom-8 left-8">
                            <Button text="Faça seu Cadastro" onClick={handleClick}/>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div
                        className="bg-cover bg-center rounded-2xl w-[590px] h-[400px] p-4 flex flex-col justify-between"
                        style={{ backgroundImage: "url('/img/car-model-secondary.png')" }}
                    >
                        <p className="text-white text-3xl font-bold mb-2 p-4">
                            Faça um diagnóstico veicular
                        </p>
                        <div className="absolute bottom-8 left-8">
                            <Button text="Iniciar Diagnóstico" onClick={handleClick}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
