'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ApiDocs() {
  const [spec, setSpec] = useState<any>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/docs')
      .then(res => res.json())
      .then(data => {
        setSpec(data);
        setActiveTag(data.tags?.[0]?.name || null);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              API Documentation
            </h1>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tags Navigation */}
        <nav className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {spec.tags?.map((tag: any) => (
              <button
                key={tag.name}
                onClick={() => setActiveTag(tag.name)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors
                  ${activeTag === tag.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }
                `}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </nav>

        {/* Endpoints */}
        {spec.tags?.map((tag: any) => (
          <div
            key={tag.name}
            className={activeTag === tag.name ? 'block' : 'hidden'}
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white capitalize">
                {tag.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {tag.description}
              </p>

              {/* Endpoints for current tag */}
              <div className="space-y-6">
                {Object.entries(spec.paths || {}).map(([path, methods]: [string, any]) => {
                  const pathEndpoints = Object.entries(methods).filter(
                    ([_, method]: [string, any]) => 
                      method.tags?.includes(tag.name)
                  );

                  return pathEndpoints.map(([method, details]: [string, any]) => {
                    const uniqueKey = `${path}-${method}-${details.operationId || Math.random()}`;
                    
                    return (
                      <div
                        key={uniqueKey}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                      >
                        {/* Endpoint Header */}
                        <div className="p-4 border-b dark:border-gray-700">
                          <div className="flex items-center gap-3">
                            <span className={`
                              px-3 py-1 rounded-md text-sm font-mono font-bold uppercase
                              ${method === 'get' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                                method === 'post' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                                method === 'put' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}
                            `}>
                              {method}
                            </span>
                            <code className="text-sm font-mono text-gray-700 dark:text-gray-300">
                              {path}
                            </code>
                          </div>
                          <p className="mt-2 text-gray-600 dark:text-gray-400">
                            {details.summary}
                          </p>
                        </div>

                        {/* Parameters */}
                        {details.parameters && details.parameters.length > 0 && (
                          <div className="p-4 border-b dark:border-gray-700">
                            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                              Parameters
                            </h4>
                            <div className="space-y-2">
                              {details.parameters.map((param: any) => (
                                <div
                                  key={`${path}-${method}-${param.name}`}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <span className="font-mono text-gray-700 dark:text-gray-300">
                                    {param.name}
                                  </span>
                                  {param.required && (
                                    <span className="text-red-500">*</span>
                                  )}
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {param.description}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Response */}
                        <div className="p-4">
                          <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                            Responses
                          </h4>
                          <div className="space-y-2">
                            {Object.entries(details.responses).map(([code, response]: [string, any]) => (
                              <div
                                key={`${path}-${method}-${code}`}
                                className="flex items-start gap-2 text-sm"
                              >
                                <span className={`
                                  px-2 py-1 rounded font-mono
                                  ${code.startsWith('2') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                                    code.startsWith('4') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}
                                `}>
                                  {code}
                                </span>
                                <span className="text-gray-600 dark:text-gray-400">
                                  {(response as any).description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 