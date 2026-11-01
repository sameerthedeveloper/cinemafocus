import React from 'react';
import clsx from 'clsx';
import { ExternalLink } from 'lucide-react';

const ContentRenderer = ({ blocks, className }) => {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className={clsx("space-y-8", className)}>
      {blocks.map((block) => {
        switch (block.type) {
          case 'heading':
            const Level = block.data.level === 1 ? 'h2' : 'h3'; // Map level 1 to h2 in article context usually
            return (
              <Level 
                key={block.id} 
                className={clsx(
                  "font-medium tracking-tight text-foreground mt-8",
                  block.data.level === 1 ? "text-3xl md:text-4xl mb-6" : "text-2xl md:text-3xl mb-4"
                )}
              >
                {block.data.text}
              </Level>
            );

          case 'text':
            return (
              <p key={block.id} className="whitespace-pre-line text-base leading-relaxed text-muted-foreground md:text-lg">
                {block.data.text}
              </p>
            );

          case 'image':
            return (
              <figure key={block.id} className="my-10">
                <div className="rounded-media overflow-hidden bg-secondary/40">
                  <img 
                    src={block.data.url} 
                    alt={block.data.caption || "Article image"} 
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
                {block.data.caption && (
                  <figcaption className="mt-3 text-sm text-muted-foreground">
                    {block.data.caption}
                  </figcaption>
                )}
              </figure>
            );

          case 'link':
            const isButton = block.data.style === 'button';
            return (
              <div key={block.id} className="my-6">
                <a 
                  href={block.data.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={clsx(
                    "inline-flex items-center gap-2 transition-all",
                    isButton 
                      ? "h-12 px-7 bg-primary text-primary-foreground rounded-full text-sm font-medium tracking-tight hover:bg-primary/90" 
                      : "text-foreground underline underline-offset-4 hover:text-muted-foreground font-medium text-lg"
                  )}
                >
                  {block.data.text}
                  <ExternalLink size={isButton ? 18 : 16} strokeWidth={isButton ? 2 : 2.5} />
                </a>
              </div>
            );

          case 'gallery':
            return (
              <div key={block.id} className="my-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {block.data.images?.map((img, idx) => (
                    <figure key={idx} className="group relative">
                      <div className="aspect-square rounded-media overflow-hidden bg-secondary/40">
                        <img 
                          src={img.url} 
                          alt={img.caption || `Gallery image ${idx + 1}`} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      {img.caption && (
                        <div className="absolute inset-0 bg-black/60 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                           <p className="text-white text-xs font-medium">{img.caption}</p>
                        </div>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default ContentRenderer;
