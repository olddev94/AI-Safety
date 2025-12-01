import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, MapPin, ExternalLink, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';

interface NewsArticle {
  id: number;
  title: string;
  url: string;
  description: string;
  content: string;
  pubDate: string;
  country: string[];
  category: string;
  severity: string;
  image_url?: string;
  relevant_articles?: NewsArticle[];
}

interface RelevantArticle {
  id: number;
  title: string;
  url: string;
  description: string;
  pubDate: string;
  country: string[];
  category: string;
  severity: string;
  image_url?: string;
}

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError('Invalid article ID');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://${window.location.hostname}:8800/news/${id}`);
        setArticle(response.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch {
      return 'Unknown date';
    }
  };

  const getSeverityBadge = (severity: string) => {
    return severity === 'Fatality' ? (
      <Badge variant="destructive" className="bg-death/10 text-death border-death/20">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Fatality
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-accident/10 text-accident border-accident/20">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Accident
      </Badge>
    );
  };

  const getCategory = (category: string) => {
    if (!category) return 'N/A';
    return category.split('/')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Article Not Found</h2>
              <p className="text-muted-foreground mb-4">{error || 'The article you are looking for does not exist.'}</p>
              <Button onClick={() => navigate('/')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-card/80 border-border/50">
          <CardHeader>
            {article.image_url && (
              <div className="mb-4 rounded-lg overflow-hidden border border-border/50">
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-auto max-h-96 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect fill="%23e5e7eb" width="800" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="24"%3ENo Image Available%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
            )}
            <div className="flex items-start justify-between gap-4 mb-4">
              <CardTitle className="text-2xl font-bold leading-tight">
                {article.title}
              </CardTitle>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {getSeverityBadge(article.severity)}
              <Badge variant="outline">
                {getCategory(article.category)}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(article.pubDate)}
              </div>
              {article.country && article.country.length > 0 && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {article.country.join(', ')}
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Description */}
            {article.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {article.description}
                </p>
              </div>
            )}

            {/* Content */}
            {article.content && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Full Article</h3>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {article.content}
                </div>
              </div>
            )}

            {/* External Link */}
            {article.url && (
              <div className="pt-4 border-t border-border/50">
                <Button asChild className="w-full sm:w-auto">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Read Original Article
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Relevant Articles */}
        {article.relevant_articles && article.relevant_articles.length > 0 && (
          <Card className="bg-card/80 border-border/50 mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Related Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {article.relevant_articles.map((relevantArticle) => (
                  <div
                    key={relevantArticle.id}
                    onClick={() => navigate(`/news/${relevantArticle.id}`)}
                    className="border border-border/50 rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border border-border/50 bg-muted">
                        {relevantArticle.image_url ? (
                          <img
                            src={relevantArticle.image_url}
                            alt={relevantArticle.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e5e7eb" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="sans-serif" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                              <circle cx="9" cy="9" r="2"/>
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight mb-2 hover:text-primary transition-colors">
                          {relevantArticle.title}
                        </h4>
                        {relevantArticle.description && (
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {relevantArticle.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(relevantArticle.pubDate)}
                          </div>
                          {relevantArticle.country && relevantArticle.country.length > 0 && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {relevantArticle.country[0]}
                            </div>
                          )}
                          {relevantArticle.category && (
                            <Badge variant="outline" className="text-xs">
                              {getCategory(relevantArticle.category)}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NewsDetail;

