import React from 'react';
import heroBg from '../assets/images/2.webp';

interface HeroProps {
  onLaunchScreener: () => void;
}

const Hero: React.FC<HeroProps> = ({ onLaunchScreener }) => {
    return (
        <div 
            className="relative flex flex-col justify-center items-center h-screen px-3 text-center text-gray-100" 
            style={{ 
                // backgroundImage: `linear-gradient(rgba(11, 13, 23, 0.85), rgba(11, 13, 23, 0.90)), url(${heroBg})`,
                backgroundImage: `linear-gradient(rgba(11, 13, 23, 0.40), rgba(11, 13, 23, 0.50)), url(${heroBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundBlendMode: 'overlay'
            }}
        >
            <div className="w-full max-w-3xl">
                <span className="inline-block font-mono mb-3 px-3 py-2 text-[#FF6B00] bg-[#FF6B00]/15 border border-[#FF6B00] rounded text-sm">
                    // SPATIAL COMBUSTION RESEARCH //
                </span>
                
                <h1 className="font-orbitron font-bold text-4xl md:text-5xl mb-3 text-white tracking-[2px]">
                    FLAME IN <span className="text-[#FF6B00]">FREEFALL</span>
                </h1>
                
                <p className="font-mono mb-4 text-base md:text-lg text-gray-400">
                    Microgravity droplet combustion screener powered by physical modeling and machine learning feature extraction for n-Heptane physics analysis.
                </p>
                
                <div className="flex justify-center gap-3">
                    <button 
                        onClick={onLaunchScreener}
                        className="font-orbitron px-4 py-2 font-bold tracking-[1px] border border-[#FF6B00] text-[#FF6B00] rounded hover:bg-[#FF6B00] hover:text-black transition-colors"
                    >
                        LAUNCH SCREENER DASHBOARD &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;