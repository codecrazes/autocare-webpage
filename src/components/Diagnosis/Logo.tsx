import Image from 'next/image';

const Logo: React.FC = () => {
    return (
        <div className="diagnosisForm-logo">
            <Image className="diagnosisForm-logo-icon" src="/img/assistant-logo.svg" alt="Logo" width={800} height={100} />
        </div>
    );
};

export default Logo;
