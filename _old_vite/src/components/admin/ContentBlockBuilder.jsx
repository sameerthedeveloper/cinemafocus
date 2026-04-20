import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Type, Heading as HeadingIcon, ImageIcon, GripVertical, GalleryHorizontal, Link as LinkIcon, ExternalLink } from 'lucide-react';
import ImageUpload from '../ImageUpload';

const ContentBlockBuilder = ({ blocks, onChange }) => {
  
  const addBlock = (type) => {
    const newBlock = {
      id: crypto.randomUUID(),
      type,
      data: type === 'text' ? { text: '' } 
            : type === 'heading' ? { text: '', level: 2 }
            : type === 'link' ? { text: '', url: '', style: 'button' } 
            : type === 'image' ? { url: '', caption: '' }
            : { images: [] } // gallery
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (id, data) => {
    const newBlocks = blocks.map(block => 
      block.id === id ? { ...block, data: { ...block.data, ...data } } : block
    );
    onChange(newBlocks);
  };

  const removeBlock = (id) => {
    if (window.confirm('Are you sure you want to remove this block?')) {
      onChange(blocks.filter(block => block.id !== id));
    }
  };

  const moveBlock = (index, direction) => {
    const newBlocks = [...blocks];
    if (direction === 'up' && index > 0) {
      [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
    } else if (direction === 'down' && index < newBlocks.length - 1) {
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    }
    onChange(newBlocks);
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between flex-wrap gap-4">
          <label className="block text-sm font-medium">Content Blocks</label>
          <div className="flex gap-2 flex-wrap">
             <button 
               type="button"
               onClick={() => addBlock('heading')}
               className="px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-secondary flex items-center gap-1.5"
             >
                <HeadingIcon size={14} /> Heading
             </button>
             <button 
               type="button"
               onClick={() => addBlock('text')}
               className="px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-secondary flex items-center gap-1.5"
             >
                <Type size={14} /> Text
             </button>
             <button 
               type="button"
               onClick={() => addBlock('image')}
               className="px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-secondary flex items-center gap-1.5"
             >
                <ImageIcon size={14} /> Image
             </button>
             <button 
               type="button"
               onClick={() => addBlock('gallery')}
               className="px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-secondary flex items-center gap-1.5"
             >
                <GalleryHorizontal size={14} /> Gallery
             </button>
             <button 
               type="button"
               onClick={() => addBlock('link')}
               className="px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-secondary flex items-center gap-1.5"
             >
                <LinkIcon size={14} /> Link
             </button>
          </div>
       </div>

       <div className="space-y-4">
         {blocks.length === 0 && (
           <div className="text-center py-12 border-2 border-dashed border-border rounded-xl text-muted-foreground">
              <p>No content blocks added yet.</p>
              <p className="text-xs mt-1">Start by adding a heading, text, image, or gallery.</p>
           </div>
         )}

         {blocks.map((block, index) => (
           <div key={block.id} className="relative group bg-secondary/10 border border-border rounded-lg p-4 transition-all hover:border-primary/20">
              {/* Controls */}
              <div className="absolute right-2 top-2 flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity z-10">
                 <button 
                   type="button"
                   disabled={index === 0}
                   onClick={() => moveBlock(index, 'up')}
                   className="p-1.5 hover:bg-background rounded text-muted-foreground disabled:opacity-30"
                   title="Move Up"
                 >
                    <ArrowUp size={14} />
                 </button>
                 <button 
                   type="button"
                   disabled={index === blocks.length - 1}
                   onClick={() => moveBlock(index, 'down')}
                   className="p-1.5 hover:bg-background rounded text-muted-foreground disabled:opacity-30"
                   title="Move Down"
                 >
                    <ArrowDown size={14} />
                 </button>
                 <button 
                   type="button"
                   onClick={() => removeBlock(block.id)}
                   className="p-1.5 hover:bg-red-50 text-red-500 rounded ml-2"
                   title="Delete Block"
                 >
                    <Trash2 size={14} />
                 </button>
              </div>

              {/* Block Content */}
              <div className="pr-24">
                 <div className="flex items-center gap-2 mb-3 text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                    {block.type === 'heading' && <HeadingIcon size={14} />}
                    {block.type === 'text' && <Type size={14} />}
                    {block.type === 'image' && <ImageIcon size={14} />}
                    {block.type === 'gallery' && <GalleryHorizontal size={14} />}
                    {block.type === 'link' && <LinkIcon size={14} />}
                    {block.type} Block
                 </div>

                 {block.type === 'heading' && (
                    <div className="space-y-3">
                       <input 
                         type="text" 
                         className="w-full bg-background border border-border rounded px-3 py-2 text-lg font-medium outline-none focus:border-primary transition-colors"
                         placeholder="Heading Text"
                         value={block.data.text}
                         onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                       />
                       <div className="flex gap-4">
                         <label className="flex items-center gap-2 text-sm text-muted-foreground">
                           <input 
                             type="radio" 
                             name={`level-${block.id}`} 
                             checked={block.data.level === 1}
                             onChange={() => updateBlock(block.id, { level: 1 })}
                           />
                           Large (H2)
                         </label>
                         <label className="flex items-center gap-2 text-sm text-muted-foreground">
                           <input 
                             type="radio" 
                             name={`level-${block.id}`} 
                             checked={block.data.level === 2}
                             onChange={() => updateBlock(block.id, { level: 2 })}
                           />
                           Medium (H3)
                         </label>
                       </div>
                    </div>
                 )}

                 {block.type === 'text' && (
                    <textarea 
                      rows={4}
                      className="w-full bg-background border border-border rounded px-3 py-2 outline-none focus:border-primary transition-colors"
                      placeholder="Enter paragraph text..."
                      value={block.data.text}
                      onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                    />
                 )}

                 {block.type === 'link' && (
                    <div className="space-y-3 bg-background p-3 rounded-lg border border-border/50">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         <div>
                            <label className="block text-xs font-medium mb-1">Display Text</label>
                            <input 
                              type="text" 
                              className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                              placeholder="e.g. Visit Website"
                              value={block.data.text}
                              onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-medium mb-1">URL</label>
                            <input 
                              type="text" 
                              className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                              placeholder="https://..."
                              value={block.data.url}
                              onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                            />
                         </div>
                       </div>
                       <div className="flex gap-4 pt-1">
                          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                            <input 
                              type="radio" 
                              name={`style-${block.id}`} 
                              checked={block.data.style === 'button'}
                              onChange={() => updateBlock(block.id, { style: 'button' })}
                            />
                            Button Style
                          </label>
                          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                            <input 
                              type="radio" 
                              name={`style-${block.id}`} 
                              checked={block.data.style === 'text'}
                              onChange={() => updateBlock(block.id, { style: 'text' })}
                            />
                            Text Link
                          </label>
                       </div>
                       
                       {/* Preview */}
                       {block.data.text && (
                         <div className="pt-2 mt-2 border-t border-dashed border-border">
                           <span className="text-xs text-muted-foreground block mb-2">Preview:</span>
                           {block.data.style === 'button' ? (
                             <span className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm">
                               {block.data.text} <ExternalLink size={14} />
                             </span>
                           ) : (
                             <span className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                               {block.data.text} <ExternalLink size={14} />
                             </span>
                           )}
                         </div>
                       )}
                    </div>
                 )}

                 {block.type === 'image' && (
                    <div className="space-y-3">
                       <div className="flex gap-4 items-start">
                          <div className="w-32 aspect-square bg-background rounded border border-border flex items-center justify-center overflow-hidden">
                             {block.data.url ? (
                               <img src={block.data.url} alt="Preview" className="w-full h-full object-cover" />
                             ) : (
                               <ImageIcon className="text-muted" />
                             )}
                          </div>
                          <div className="flex-1 space-y-3">
                             <ImageUpload 
                               onUploadComplete={(url) => updateBlock(block.id, { url })} 
                             />
                             <input 
                               type="text" 
                               className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                               placeholder="Image Caption (Optional)"
                               value={block.data.caption || ''}
                               onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                             />
                          </div>
                       </div>
                    </div>
                 )}

                 {block.type === 'gallery' && (
                    <div className="space-y-4">
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {block.data.images?.map((img, idx) => (
                             <div key={idx} className="relative group/item aspect-square bg-background rounded border border-border overflow-hidden">
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                                <button 
                                  type="button"
                                  onClick={() => {
                                     const newImages = block.data.images.filter((_, i) => i !== idx);
                                     updateBlock(block.id, { images: newImages });
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity"
                                >
                                   <Trash2 size={12} />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                   <input 
                                     type="text" 
                                     className="w-full bg-transparent text-white text-xs outline-none placeholder:text-white/50"
                                     placeholder="Caption..."
                                     value={img.caption || ''}
                                     onChange={(e) => {
                                        const newImages = [...block.data.images];
                                        newImages[idx].caption = e.target.value;
                                        updateBlock(block.id, { images: newImages });
                                     }}
                                   />
                                </div>
                             </div>
                          ))}
                          
                           <div className="aspect-square bg-secondary/20 rounded border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-2">
                              <ImageUpload 
                                onUploadComplete={(url) => {
                                  if (url) {
                                    const newImages = [...(block.data.images || []), { url, caption: '' }];
                                    updateBlock(block.id, { images: newImages });
                                  }
                                }}
                              />
                           </div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
         ))}
       </div>

       <div className="flex justify-center pt-4 border-t border-dashed border-border">
          <div className="flex gap-3">
             <span className="text-sm text-muted-foreground flex items-center">Add new block:</span>
             <button 
               type="button"
               onClick={() => addBlock('heading')}
               className="p-2 bg-secondary hover:bg-secondary/80 rounded-full text-foreground transition-colors"
               title="Add Heading"
             >
                <HeadingIcon size={18} />
             </button>
             <button 
               type="button"
               onClick={() => addBlock('text')}
               className="p-2 bg-secondary hover:bg-secondary/80 rounded-full text-foreground transition-colors"
               title="Add Paragraph"
             >
                <Type size={18} />
             </button>
             <button 
               type="button"
               onClick={() => addBlock('link')}
               className="p-2 bg-secondary hover:bg-secondary/80 rounded-full text-foreground transition-colors"
               title="Add Link"
             >
                <LinkIcon size={18} />
             </button>
             <button 
               type="button"
               onClick={() => addBlock('image')}
               className="p-2 bg-secondary hover:bg-secondary/80 rounded-full text-foreground transition-colors"
               title="Add Image"
             >
                <ImageIcon size={18} />
             </button>
             <button 
               type="button"
               onClick={() => addBlock('gallery')}
               className="p-2 bg-secondary hover:bg-secondary/80 rounded-full text-foreground transition-colors"
               title="Add Gallery"
             >
                <GalleryHorizontal size={18} />
             </button>
          </div>
       </div>
    </div>
  );
};

export default ContentBlockBuilder;
