import React from "react";
import { RotateCw, Share, Search, ShieldCheck } from "lucide-react";

interface MobileMockupProps {
  imageUrl: string;
}

export const MobileMockup: React.FC<MobileMockupProps> = ({ imageUrl }) => {
  return (
    <div className="relative mx-auto w-full max-w-[300px] h-[600px] bg-[#1a1a1a] rounded-[3rem] border-[8px] border-[#333] shadow-2xl overflow-hidden">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#333] rounded-b-2xl z-20 flex items-center justify-center gap-2">
        <div className="size-2 rounded-full bg-[#111]" />
        <div className="w-8 h-1 rounded-full bg-[#111]" />
      </div>

      {/* Screen Content */}
      <div className="absolute inset-0 bg-white overflow-hidden flex flex-col pt-8">
        {/* Safari Header */}
        <div className="bg-[#f2f2f2] px-4 pt-2 pb-3 border-b border-gray-300">
          <div className="bg-white rounded-lg h-9 flex items-center px-3 gap-2 shadow-sm">
            <ShieldCheck className="size-4 text-green-600 shrink-0" />
            <span className="text-xs text-gray-500 font-medium truncate">skill-exchange.com</span>
            <div className="ml-auto flex items-center gap-2 text-gray-400">
              <RotateCw className="size-3" />
            </div>
          </div>
        </div>

        {/* Browser Content */}
        <div className="flex-1 overflow-y-auto relative bg-background">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Mobile app screenshot"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Safari Footer */}
        <div className="bg-[#f2f2f2]/90 backdrop-blur-md px-6 py-3 border-t border-gray-300 flex items-center justify-between">
          <div className="w-4 h-4 border-2 border-primary rotate-45 border-t-0 border-r-0" />
          <div className="w-4 h-4 border-2 border-primary -rotate-45 border-t-0 border-l-0" />
          <Share className="size-5 text-primary" />
          <Search className="size-5 text-primary" />
          <div className="size-5 border-2 border-primary rounded-sm" />
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 rounded-full" />
      </div>
    </div>
  );
};