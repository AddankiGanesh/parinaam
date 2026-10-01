'use client';

import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../../data/festData';
import { Camera, X, Maximize2 } from 'lucide-react';

export const GallerySection = () => {
  const [activeItem, setActiveItem] = useState<typeof GALLERY_ITEMS[0] | null>(null);

  return (
    <section id="gallery" className="py-20 bg-[#090d16] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-mono text-primary font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Camera className="w-4 h-4" />
              <span>FESTIVAL MEMORIES</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Life at Parinaam
            </h2>
            <p className="text-sm text-slate-400 max-w-lg">
              Moments captured from previous flagship hackathons, battle of bands, robotics arenas, and pro-nights.
            </p>
          </div>
        </div>

        {/* Gallery Masonry / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative h-64 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase bg-slate-900/90 text-primary px-2 py-0.5 rounded border border-slate-800">
                  {item.category}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
              </div>

              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 p-2 rounded-full text-white">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Preview Lightbox Modal */}
        {activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-96 w-full bg-slate-950">
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-2">
                <span className="text-xs font-mono font-bold text-primary">{activeItem.category}</span>
                <h3 className="text-xl font-bold text-white">{activeItem.title}</h3>
                <p className="text-sm text-slate-300">{activeItem.caption}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
