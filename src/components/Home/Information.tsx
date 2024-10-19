"use client";

import Image from 'next/image';

export default function InformationAutocare() {
    return (
        <div className="flex flex-col items-center gap-10 pb-24 bg-white">
            <p className="text-4xl font-medium mt-10">Por que escolher Autocare?</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-8">
                <div className="shadow-md rounded-3xl p-6 bg-gray-100 w-[700px] h-[500px] flex items-center justify-center">
                    <Image
                        src="/img/car-information.png"
                        alt="imagem carro"
                        width={600}
                        height={400}
                        className="rounded-xl object-cover"
                        priority
                    />
                </div>
                <div className="grid grid-cols-1 gap-6 md:w-1/2 lg:w-1/3">
                    <div className="flex items-center bg-white p-4 rounded-3xl shadow-md">
                        <Image
                            src="/img/icon-find.png"
                            alt="lupa"
                            width={60}
                            height={60}
                            className="mr-4"
                        />
                        <div>
                            <p className="text-lg font-bold">Serviços Personalizados e Convenientes</p>
                            <p className="text-sm">Selecione serviços automotivos sob medida para as suas necessidades, com flexibilidade de datas e locais.</p>
                        </div>
                    </div>
                    <div className="flex items-center bg-white p-4 rounded-3xl shadow-md">
                        <Image
                            src="/img/icon-date.png"
                            alt="agenda"
                            width={60}
                            height={60}
                            className="mr-4"
                        />
                        <div>
                            <p className="text-lg font-bold">Segurança e Confiança</p>
                            <p className="text-sm">Seu carro em boas mãos, com especialistas dedicados ao cuidado que ele merece.</p>
                        </div>
                    </div>
                    <div className="flex items-center bg-white p-4 rounded-3xl shadow-md">
                        <Image
                            src="/img/icon-smile.png"
                            alt="emoji sorrindo"
                            width={60}
                            height={60}
                            className="mr-4"
                        />
                        <div>
                            <p className="text-lg font-bold">Economia de Tempo</p>
                            <p className="text-sm">Receba atendimento rápido e eficiente, para você voltar à estrada sem preocupações.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
