import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';
import SectionHeader from './SectionHeader';

const Contact: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeader 
        title="Contactează-ne" 
        description="Ne poți găsi la sediul nostru sau ne poți scrie direct pentru orice întrebare."
      />

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
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

          <div className="flex gap-4 pt-4">
            <a href="#" className="p-4 bg-white shadow-md rounded-full text-gray-400 hover:text-purple-600 transition-all hover:scale-110">
              <Instagram size={24} />
            </a>
            <a href="#" className="p-4 bg-white shadow-md rounded-full text-gray-400 hover:text-blue-600 transition-all hover:scale-110">
              <Facebook size={24} />
            </a>
          </div>
        </div>

        <div className="h-96 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white relative group">
          <img 
            src="https://picsum.photos/seed/map/800/800" 
            alt="Locatie" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-purple-600/10 group-hover:bg-transparent transition-colors"></div>
        </div>
      </div>
    </div>
  );
};

export default Contact;