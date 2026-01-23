
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Share2, FileText, ExternalLink } from 'lucide-react';
import Section from '../components/Section';
import ContentRenderer from '../components/ContentRenderer';
import SEO from '../components/SEO';
import { getPressRelease } from '../lib/db';
import { pressReleases } from '../lib/seed-data';
import { formatDate } from '../lib/utils';

const PressReleaseDetail = () => {
  const { id } = useParams();
  const [release, setRelease] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPressRelease(id);
        setRelease(data);
      } catch (error) {
        console.error("Error fetching press release:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  if (!release) {
    return (
      <div className="text-center py-32 space-y-4">
        <h2 className="text-2xl font-medium">Press Release Not Found</h2>
        <Link to="/" className="text-primary hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pt-24 pb-20">
      <SEO 
        title={release.title} 
        description={release.excerpt}
        image={release.imageUrl}
        type="article"
        path={`/press/${id}`}
        schema={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": release.title,
          "image": [release.imageUrl],
          "datePublished": release.date,
          "dateModified": release.date,
          "author": {
            "@type": "Person",
            "name": "Cinema Focus Team"
          }
        }}
      />
      
      <div className="max-w-7xl mx-auto px-6">
        <Link to="/press" className="group inline-flex items-center text-muted hover:text-foreground mb-12 transition-colors">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Press Room
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-24 items-start">
           {/* Left Column: Title & Image */}
           <div className="flex flex-col gap-6 md:gap-8 lg:sticky lg:top-24">
              <h1 className="text-3xl md:text-5xl lg:text-6xl md:leading-tight font-medium text-foreground tracking-tight animate-fade-in-up">
                {release.title}
              </h1>

              <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-secondary/5 shadow-2xl shadow-black/5 animate-fade-in-up delay-100">
                 <img src={release.imageUrl} alt={release.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
              </div>
           </div>

           {/* Right Column: Content */}
           <div className="flex flex-col animate-fade-in-up delay-200">
              <div className="flex items-center gap-4 text-sm text-muted mb-8 md:mb-10 border-b border-border/50 pb-6 md:pb-8">
                 <span className="flex items-center gap-2 font-medium">
                    <Calendar size={16} />
                    {formatDate(release.date)}
                 </span>
                 <span className="w-1 h-1 bg-muted rounded-full" />
                 <span className="uppercase tracking-widest text-xs font-semibold text-primary">Press Release</span>
              </div>

              <div className="prose prose-base md:prose-lg dark:prose-invert max-w-none text-muted-foreground">
                <p className="lead text-2xl text-foreground font-light leading-relaxed mb-8">{release.excerpt}</p>
                
                {release.contentBlocks && release.contentBlocks.length > 0 ? (
                   <ContentRenderer blocks={release.contentBlocks} />
                ) : (
                   <div className="space-y-6 text-lg leading-relaxed">
                      {release.content ? (
                         <p>{release.content}</p>
                      ) : (
                         <>
                            <p>
                               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
                            </p>
                            <p>
                               Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                            <blockquote className="border-l-4 border-primary pl-6 italic text-foreground my-8">
                               "True high-fidelity is about emotion, texture, and presence. This new release embodies our commitment to that philosophy."
                            </blockquote>
                            <p>
                               Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                            </p>
                         </>
                      )}
                   </div>
                )}
               </div>
              
              {release.pdfUrl && (
                  <div className="mt-8">
                     <a 
                       href={release.pdfUrl} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="inline-flex items-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
                     >
                        <FileText size={20} />
                        Download Press Release (PDF)
                        <ExternalLink size={16} className="ml-1 opacity-70" />
                     </a>
                  </div>
              )}
              
               <div className="pt-12 flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-border/50 mt-16 gap-6">
                  <div className="text-sm text-muted">
                    <strong className="text-foreground block mb-1">Media Contact</strong>
                    Isabella Chen<br/>
                    <a href="mailto:media@cinemafocus.com" className="hover:text-primary transition-colors">media@cinemafocus.com</a>
                  </div>
                  <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary hover:text-primary transition-all active:scale-95">
                     <Share2 size={18} />
                     Share Article
                  </button>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PressReleaseDetail;
