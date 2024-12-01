import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API REST JSONPlaceholder',
        version: '1.0.0',
        description: 'Documentación de la API REST que replica JSONPlaceholder',
        contact: {
          name: 'API Support',
          email: 'support@example.com',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Servidor de desarrollo',
        },
      ],
      tags: [
        { name: 'users', description: 'Operaciones con usuarios' },
        { name: 'posts', description: 'Operaciones con posts' },
        { name: 'comments', description: 'Operaciones con comentarios' },
        { name: 'albums', description: 'Operaciones con álbumes' },
        { name: 'photos', description: 'Operaciones con fotos' },
        { name: 'todos', description: 'Operaciones con todos' },
      ],
      components: {
        schemas: {
          Pagination: {
            type: 'object',
            properties: {
              total: { type: 'integer' },
              page: { type: 'integer' },
              limit: { type: 'integer' },
              pages: { type: 'integer' },
            },
          },
          Error: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              message: { type: 'string' },
            },
          },
        },
      },
    },
  });
  return spec;
}; 