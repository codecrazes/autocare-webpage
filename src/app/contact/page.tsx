"use client"

import React, { useState } from 'react';
import Image from 'next/image';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div>
      <div className="bg-gray-100">
        <div className="relative flex flex-col items-center">
          <div className="relative w-full h-[400px] overflow-hidden">
            <Image src="/img/carro.png" alt="Banner" layout="fill" objectFit="cover" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
              <h2 className="text-4xl font-medium">Entre em contato</h2>
              <p className="text-2xl font-light mt-2">Precisa de ajuda? Entre em contato conosco!</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-white rounded-lg py-10">
          <div className="flex flex-col items-center justify-center w-full max-w-xl">
            <form onSubmit={handleSubmit} className="flex flex-col w-full p-4 space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Nome Completo"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-gray-200 text-black border-none rounded-md p-3"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-gray-200 text-black border-none rounded-md p-3"
              />
              <textarea
                name="message"
                placeholder="Mensagem"
                value={formData.message}
                onChange={handleChange}
                required
                className="bg-gray-200 text-black border-none rounded-md p-3 h-32 resize-none"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-md p-3 hover:bg-blue-600 transition duration-200"
              >
                Enviar mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
