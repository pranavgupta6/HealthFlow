import React, { useEffect, useState } from "react";

export default function HospitalCarousel() {
  const [position, setPosition] = useState(0);

  const hospitals = [
    { name: "Max Healthcare", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRsBnMdMhXyXNckFyiHJHzzK4BgjDW-LfH6Q&s" },
    { name: "Fortis Hospital", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE8aOeIxkt9jmPwHXFYu_A6V-qPCZaRHLQMw&s" },
    { name: "Apollo Hospitals", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHH-v-ZfW_BcXRgnMblp5f7ItqynRQMbptSg&s" },
    { name: "Medanta", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpM8sJhoZDeTXT4UtYfv1g60ULSke-0FoGUQ&s" },
    { name: "Manipal Hospital", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2iZVxWKOFYtwbrAtqFodzflckrHRdYo02QA&s" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => (prev + 1) % hospitals.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-white py-16 border-y border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-[#4A4A4A] uppercase tracking-[0.15em]">
            TRUSTED BY LEADING HOSPITALS
          </p>
        </div>
        
        <div className="relative h-28 overflow-hidden">
          <div 
            className="flex gap-6 transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${position * (100 / hospitals.length)}%)` }}
          >
            {[...hospitals, ...hospitals].map((hospital, index) => (
              <div 
                key={index}
                className="flex-shrink-0 w-44 h-28 overflow-hidden border border-[#E5E5E5] bg-white flex items-center justify-center p-4"
              >
                <img 
                  src={hospital.image} 
                  alt={hospital.name}
                  className="w-full h-full object-contain hover:scale-105 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-1.5 mt-8">
          {hospitals.map((_, index) => (
            <button
              key={index}
              onClick={() => setPosition(index)}
              className={`h-1 transition-all duration-300 ${
                index === position ? 'bg-[#0C0C0C] w-8' : 'bg-[#E5E5E5] w-1'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}