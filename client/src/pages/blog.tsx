import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import type { BlogPost } from '@shared/schema';

export default function Blog() {
  const [location] = useLocation();
  const { language } = useLanguage();
  const slug = location.split('/')[2];

  const { data: blogPosts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    enabled: !slug,
  });

  const { data: blogPost } = useQuery<BlogPost>({
    queryKey: ['/api/blog', slug],
    enabled: !!slug,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getContent = (post: BlogPost) => {
    if (language === 'bn') {
      return {
        title: post.titleBn || post.title,
        content: post.contentBn || post.content,
        excerpt: post.excerpt_bn || post.excerpt,
      };
    }
    return {
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
    };
  };

  if (slug && blogPost) {
    const content = getContent(blogPost);
    
    return (
      <div className="min-h-screen bg-white">
        <Header />
        
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Blog Post Header */}
              <div className="mb-8">
                {blogPost.image && (
                  <img
                    src={blogPost.image}
                    alt={content.title}
                    className="w-full h-64 md:h-96 object-cover rounded-2xl mb-6"
                  />
                )}
                
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                    {content.title}
                  </h1>
                  
                  <div className="flex items-center space-x-6 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(blogPost.createdAt || '')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>TryneX Team</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>5 min read</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blog Content */}
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: content.content }} />
              </div>
              
              {/* Share Buttons */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <span className="font-medium">Share this article:</span>
                  <Button variant="outline" size="sm">
                    <i className="fab fa-facebook mr-2"></i>
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm">
                    <i className="fab fa-twitter mr-2"></i>
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm">
                    <i className="fab fa-linkedin mr-2"></i>
                    LinkedIn
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gold/10 to-gold/5 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-gold">Blog</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover gifting tips, product stories, and the latest trends in premium gifts
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="bg-gray-200 h-48 animate-pulse" />
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => {
              const content = getContent(post);
              
              return (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={content.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.createdAt || '')}</span>
                      </div>
                      <Badge variant="secondary">Article</Badge>
                    </div>
                    <CardTitle className="line-clamp-2">{content.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-3">{content.excerpt}</p>
                    <Button variant="outline" className="w-full group" asChild>
                      <a href={`/blog/${post.slug}`}>
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">
              <i className="fas fa-newspaper"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">No blog posts yet</h3>
            <p className="text-gray-600">
              Check back soon for exciting articles about gifting and our products!
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
