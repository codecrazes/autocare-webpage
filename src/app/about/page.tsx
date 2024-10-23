"use client";

import Image from 'next/image';

export default function Home() {
    return (
        <div className="flex flex-col">
            <div className="flex flex-col items-center mb-20">
                <div className="relative w-full h-[400px] overflow-hidden">
                    <Image
                        src="/img/about-banner.png"
                        alt="Banner sobre nós"
                        layout="fill"
                        objectFit="cover"
                        className="z-0"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                        <h2 className="text-[48px] font-medium leading-[92.5%] tracking-[-0.96px]">
                            Conheça Nossa História e Propósito
                        </h2>
                        <p className="text-[32px] font-light leading-[92.5%] tracking-[-0.64px]">
                            Comprometidos em criar soluções que realmente fazem a diferença para você
                        </p>
                    </div>
                </div>
                <h1 className="text-[36px] font-bold mt-8 text-black">
                    Sobre nós
                </h1>
                <div className="flex flex-col items-center text-center text-black text-[30px] font-normal w-[1103px] space-y-6 mt-4">
                    <p>
                        Nossa equipe surgiu com a missão de transformar o setor automotivo com soluções inovadoras e eficazes. Desde o início, fomos movidos pela paixão por resolver problemas e pela dedicação em fornecer um serviço de alta qualidade. Sempre focados em melhorar a experiência dos nossos clientes.
                    </p>
                    <p>
                        Cada membro do nosso time traz uma combinação única de habilidades e experiências, contribuindo para nosso sucesso coletivo. Com uma visão clara e um compromisso inabalável com a excelência, continuamos a liderar e inovar, garantindo que nossas soluções atendam às necessidades do mercado e superem as expectativas.
                    </p>
                    <p>
                        Nossa história é uma jornada de evolução e conquistas, e estamos entusiasmados para continuar escrevendo novos capítulos ao lado de nossos clientes e parceiros.
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-8 mt-12 w-full max-w-[1500px]">
                    <div className="flex flex-col items-center">
                        <Image
                            src="/img/caroline.png"
                            alt="Caroline Assis"
                            width={196}
                            height={196}
                            className="mb-2"
                        />
                        <p className="text-[24px] font-bold">Caroline Assis</p>
                        <p>RM557596</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Image
                            src="/img/enzo.png"
                            alt="Enzo Moura"
                            width={196}
                            height={196}
                            className="mb-2"
                        />
                        <p className="text-[24px] font-bold">Enzo Moura</p>
                        <p>RM556532</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <Image
                            src="/img/luis.png"
                            alt="Luis Henrique"
                            width={196}
                            height={196}
                            className="mb-2"
                        />
                        <p className="text-[24px] font-bold">Luis Henrique</p>
                        <p>RM558883</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
