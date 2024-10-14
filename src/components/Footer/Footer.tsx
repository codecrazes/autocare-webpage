import Image from "next/image";

export default function Footer() {
  return (
    <div className="mt-10 w-full h-[14vh] bg-[#F5F5F7] flex flex-row items-center justify-between">
      <div className="flex flex-col ml-16">
        <a className="text-gray-700">© 2024 Autocare.</a>
        <a className="text-gray-700">Termos de uso | Política de privacidade</a>
      </div>

      <div className="flex mr-16 gap-4">
        <div>
          <Image src="/img/icon-face.png" alt="ícone Facebook" width={30} height={30} />
        </div>
        <div>
          <Image src="/img/icon-insta.png" alt="ícone Instagram" width={30} height={30} />
        </div>
        <div>
          <Image src="/img/icon-link.png" alt="ícone LinkedIn" width={30} height={30} />
        </div>
      </div>
    </div>
  );
}
