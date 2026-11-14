import React from 'react';
import { motion } from 'framer-motion';
import heroBg from '../assets/images/2.webp';

interface HeroProps {
  onLaunchScreener: () => void;
}

const Hero: React.FC<HeroProps> = ({ onLaunchScreener }) => {
    return (
        <div 
            className="relative flex flex-col justify-center items-center min-h-screen px-4 sm:px-6 py-12 text-center text-gray-100 overflow-hidden" 
            style={{ 
                backgroundImage: `linear-gradient(rgba(11, 13, 23, 0.40), rgba(11, 13, 23, 0.50)), url(${heroBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundBlendMode: 'overlay'
            }}
        >
            {/* Main Container Animation */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-3xl flex flex-col items-center z-10"
            >
                {/* Badge Animation: Pops in slightly */}
                <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="inline-block font-mono mb-4 px-3 py-1.5 sm:py-2 text-[#FF6B00] bg-[#FF6B00]/15 border border-[#FF6B00] rounded text-[9px] sm:text-xs md:text-sm tracking-widest uppercase"
                >
                    // SPATIAL COMBUSTION RESEARCH //
                </motion.span>
                
                {/* Title Animation: Slides up */}
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="font-orbitron font-bold text-4xl sm:text-5xl md:text-6xl mb-4 text-white tracking-[2px] leading-tight"
                >
                    FLAME IN <span className="text-[#FF6B00]">FREEFALL</span>
                </motion.h1>
                
                {/* Paragraph Animation: Gentle fade */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="font-mono mb-8 text-[11px] sm:text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed max-w-2xl"
                >
                    Microgravity droplet combustion screener powered by physical modeling and machine learning feature extraction for n-Heptane physics analysis.
                </motion.p>
                
                {/* Button Animation: Final slide up */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="flex justify-center w-full sm:w-auto"
                >
                    <button 
                        onClick={onLaunchScreener}
                        className="w-full sm:w-auto font-orbitron px-6 sm:px-8 py-3.5 sm:py-4 text-[10px] sm:text-xs md:text-sm font-bold tracking-[1px] sm:tracking-[2px] border border-[#FF6B00] text-[#FF6B00] rounded hover:bg-[#FF6B00] hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,107,0,0.2)] hover:shadow-[0_0_25px_rgba(255,107,0,0.4)]"
                    >
                        LAUNCH SCREENER DASHBOARD &gt;
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Hero;
