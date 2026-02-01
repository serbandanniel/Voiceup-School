import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react';
import SectionHeader from './SectionHeader';

// Simplu component SVG pentru TikTok deoarece lucide-react uneori nu exporta iconita in toate versiunile
const TikTokIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.394 6.394 0 0 0-5.394 10.137 6.388 6.388 0 0 0 10.882-3.572V6.65a8.288 8.288 0 0 0 3.745 1.78v-3.32a4.8 4.8 0 0 1-.999-1.579z"/>
  </svg>
);

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeader 
        title="Contactează-ne" 
        description="Ne poți găsi la sediul nostru sau ne poți scrie direct pentru orice întrebare."
      />

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        <div className="space-y-8 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-6 mb-8 p-6 bg-white rounded-[2.5rem] shadow-xl border-4 border-purple-50">
               {/* Transparent background container */}
               <div className="w-24 h-24 rounded-2xl flex items-center justify-center p-2">
                  <img 
                    src="https://i.postimg.cc/1tWHG5Z8/voiceup-school-final.png" 
                    alt="Contact Logo" 
                    className="w-full h-full object-contain"
                  />
               </div>
               <div>
                  <h4 className="text-2xl font-black text-gray-900">VoiceUp School</h4>
                  <p className="text-purple-600 font-bold">Magia începe aici!</p>
               </div>
            </div>

            <div className="grid gap-6">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-blue-100 rounded-2xl text-blue-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Adresa Noastră</h4>
                  <p className="text-gray-600">Strada Artelor, Nr. 15, București</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-4 bg-purple-100 rounded-2xl text-purple-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Telefon</h4>
                  <p className="text-gray-600">0712 345 678</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-4 bg-pink-100 rounded-2xl text-pink-600">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">Email</h4>
                  <p className="text-gray-600">contact@voiceup.ro</p>
                </div>
              </div>
            </div>
          </div>

          <div>
             <h4 className="text-lg font-black text-gray-800 mb-4 ml-1">Urmărește-ne:</h4>
             <div className="flex flex-wrap gap-4">
              <a href="#" className="p-4 bg-white shadow-md rounded-2xl text-gray-500 hover:text-pink-600 hover:shadow-xl transition-all hover:-translate-y-1">
                <Instagram size={24} />
              </a>
              <a href="#" className="p-4 bg-white shadow-md rounded-2xl text-gray-500 hover:text-blue-600 hover:shadow-xl transition-all hover:-translate-y-1">
                <Facebook size={24} />
              </a>
              <a href="#" className="p-4 bg-white shadow-md rounded-2xl text-gray-500 hover:text-red-600 hover:shadow-xl transition-all hover:-translate-y-1">
                <Youtube size={24} />
              </a>
              <a href="#" className="p-4 bg-white shadow-md rounded-2xl text-gray-500 hover:text-black hover:shadow-xl transition-all hover:-translate-y-1">
                <TikTokIcon size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Map Container - Replaces Image */}
        <div className="h-[400px] lg:h-auto min-h-[400px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative group">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d182333.6424911762!2d25.95455246717549!3d44.43792078696154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1f93abf3cad4f%3A0ac0632e37c9ca62!2sBucharest!5e0!3m2!1sen!2sro!4v1709228000000!5m2!1sen!2sro" 
            width="100%" 
            height="100%" 
            style={{border: 0}} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
          ></iframe>
          {/* Overlay to match theme but allow interaction on click */}
          <div className="absolute inset-0 bg-purple-600/5 pointer-events-none group-hover:bg-transparent transition-colors border-inner"></div>
        </div>
      </div>
    </div>
  );
};

export default Contact;