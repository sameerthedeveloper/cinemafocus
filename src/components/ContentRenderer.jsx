import React from 'react';
import clsx from 'clsx';

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
              <div key={block.id} className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                <p>{block.data.text}</p>
              </div>
            );

          case 'image':
            return (
              <figure key={block.id} className="my-8">
                <div className="rounded-xl overflow-hidden bg-secondary/10">
                  <img 
                    src={block.data.url} 
                    alt={block.data.caption || "Article image"} 
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
                {block.data.caption && (
                  <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">
                    {block.data.caption}
                  </figcaption>
                )}
              </figure>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default ContentRenderer;
