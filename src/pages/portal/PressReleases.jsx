import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPressReleases } from '../../lib/db';
import { Newspaper, Calendar, ExternalLink, FileText } from 'lucide-react';
import { formatDate } from '../../lib/utils';

const PortalPressReleases = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPressReleases();
        setReleases(data);
      } catch (error) {
        console.error('Error fetching press releases:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-in">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-medium tracking-tight flex items-center gap-3">
          <Newspaper className="text-primary" />
          Press Releases
        </h1>
        <p className="text-muted-foreground mt-1">Access the latest announcements and press materials</p>
      </header>

      {releases.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Newspaper size={48} className="mx-auto mb-4 opacity-50" />
          <p>No press releases available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {releases.map((release) => (
            <div 
              key={release.id}
              className="bg-background border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all group"
            >
              {release.imageUrl && (
                <div className="aspect-video overflow-hidden bg-secondary/10">
                  <img 
                    src={release.imageUrl} 
                    alt={release.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  {formatDate(release.date)}
                </div>
                <h3 className="font-medium leading-tight">{release.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{release.excerpt}</p>
                
                <div className="flex gap-2 pt-2">
                  <Link 
                    to={`/press/${release.id}`}
                    target="_blank"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink size={12} />
                    View
                  </Link>
                  {release.pdfUrl && (
                    <a 
                      href={release.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <FileText size={12} />
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortalPressReleases;
