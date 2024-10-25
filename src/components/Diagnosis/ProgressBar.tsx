interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className="diagnosis-progress-bar bg-gray-200 rounded-full w-[600px] h-[10px]">
            <div
                className="diagnosis-progress bg-green-500 rounded-full h-[10px]"
                style={{ width: `${progressPercentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
