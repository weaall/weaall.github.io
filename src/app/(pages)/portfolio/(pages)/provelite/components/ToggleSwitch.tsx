import React from 'react';

interface ToggleSwitchProps {
    isToggled: boolean;
    setIsToggled: (isToggled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isToggled, setIsToggled }) => {
    return (
        <div className="relative flex items-center rounded-full bg-gray-100 p-1.5">
            <div
                className={`absolute top-1/2 left-1.5 w-[5.5rem] h-10 rounded-full shadow-md transition-transform duration-500 ease-in-out transform -translate-y-1/2 ${
                    isToggled ? 'translate-x-[calc(100%-0.25rem)] bg-[#416bac]' : 'translate-x-0 bg-gray-500'
                }`}
            ></div>
            <button
                onClick={() => setIsToggled(false)}
                className={`relative flex justify-center px-6 py-2 text-base font-semibold rounded-full transition-colors duration-500 w-22 ${
                    !isToggled ? 'text-white' : 'text-gray-500'
                }`}
            >
                개선 전
            </button>
            <button
                onClick={() => setIsToggled(true)}
                className={`relative flex justify-center px-6 py-2 text-base font-semibold rounded-full transition-colors duration-500 w-22 ${
                    isToggled ? 'text-white' : 'text-gray-500'
                }`}
            >
                개선 후
            </button>
        </div>
    );
};

export default ToggleSwitch;