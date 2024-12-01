'use client';

import { useState } from 'react';
import { useEffect } from 'react';

export default function ApiDocs() {
  const [spec, setSpec] = useState<any>(null);

  useEffect(() => {
    fetch('/api/docs')
      .then(res => res.json())
      .then(data => setSpec(data));
  }, []);

  if (!spec) return <div>Cargando documentación...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">API Documentation</h1>
      
      {spec.tags?.map((tag: any) => (
        <div key={tag.name} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 capitalize">{tag.name}</h2>
          <p className="text-gray-600 mb-4">{tag.description}</p>
          
          {Object.entries(spec.paths || {}).map(([path, methods]: [string, any]) => {
            const pathEndpoints = Object.entries(methods).filter(
              ([_, method]: [string, any]) => 
                method.tags?.includes(tag.name)
            );

            return pathEndpoints.map(([method, details]: [string, any]) => (
              <div key={`${path}-${method}`} className="mb-6 p-4 border rounded-lg">
                <div className="flex items-center gap-4 mb-2">
                  <span className="uppercase font-mono bg-blue-100 px-2 py-1 rounded text-blue-800">
                    {method}
                  </span>
                  <span className="font-mono text-gray-600">{path}</span>
                </div>
                <p className="text-gray-700 mb-2">{details.summary}</p>
                
                {details.parameters && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Parameters:</h4>
                    <ul className="list-disc list-inside">
                      {details.parameters.map((param: any) => (
                        <li key={param.name} className="ml-4">
                          <span className="font-mono">{param.name}</span>
                          {param.required && <span className="text-red-500">*</span>}
                          <span className="text-gray-600"> - {param.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Responses:</h4>
                  {Object.entries(details.responses).map(([code, response]: [string, any]) => (
                    <div key={code} className="ml-4">
                      <span className="font-mono">{code}</span>
                      <span className="text-gray-600"> - {response.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            ));
          })}
        </div>
      ))}
    </div>
  );
} 