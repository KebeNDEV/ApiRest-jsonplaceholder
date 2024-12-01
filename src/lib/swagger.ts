import { createSwaggerSpec } from 'next-swagger-doc';

const apiConfig = {
  openapi: '3.0.0',
  info: {
    title: 'API REST JSONPlaceholder',
    version: '1.0.0',
    description: `
      API REST que replica la funcionalidad de JSONPlaceholder con persistencia en PostgreSQL.
      
      ## Características
      - CRUD completo para todas las entidades
      - Paginación en todos los endpoints de listado
      - Relaciones entre entidades
      - Filtros en endpoints específicos
      
      ## Entidades
      - Users
      - Posts
      - Comments
      - Albums
      - Photos
      - Todos
    `,
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
  },
  servers: [
    {
      url: process.env.NODE_ENV === 'production' 
        ? 'https://tu-dominio.com' 
        : 'http://localhost:3000',
      description: process.env.NODE_ENV === 'production' 
        ? 'Servidor de producción' 
        : 'Servidor de desarrollo',
    },
  ],
  tags: [
    { 
      name: 'users', 
      description: 'Gestión de usuarios y sus relaciones con otras entidades' 
    },
    { 
      name: 'posts', 
      description: 'Gestión de publicaciones y sus comentarios asociados' 
    },
    { 
      name: 'comments', 
      description: 'Gestión de comentarios en publicaciones' 
    },
    { 
      name: 'albums', 
      description: 'Gestión de álbumes de fotos' 
    },
    { 
      name: 'photos', 
      description: 'Gestión de fotos dentro de álbumes' 
    },
    { 
      name: 'todos', 
      description: 'Gestión de tareas pendientes de usuarios' 
    },
  ],
  components: {
    schemas: {
      Pagination: {
        type: 'object',
        properties: {
          total: { 
            type: 'integer',
            description: 'Total de registros',
            example: 100
          },
          page: { 
            type: 'integer',
            description: 'Página actual',
            example: 1
          },
          limit: { 
            type: 'integer',
            description: 'Registros por página',
            example: 10
          },
          pages: { 
            type: 'integer',
            description: 'Total de páginas',
            example: 10
          },
        },
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { 
            type: 'boolean',
            description: 'Indica si la operación fue exitosa'
          },
          message: { 
            type: 'string',
            description: 'Mensaje descriptivo de la operación'
          },
          data: {
            type: 'object',
            description: 'Datos de la respuesta'
          }
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: { 
            type: 'boolean',
            example: false
          },
          message: { 
            type: 'string',
            example: 'Error al procesar la solicitud'
          },
          details: {
            type: 'string',
            example: 'Detalles específicos del error'
          }
        },
      },
    },
    parameters: {
      pageParam: {
        in: 'query',
        name: 'page',
        schema: {
          type: 'integer',
          default: 1,
          minimum: 1
        },
        description: 'Número de página para la paginación'
      },
      limitParam: {
        in: 'query',
        name: 'limit',
        schema: {
          type: 'integer',
          default: 10,
          minimum: 1,
          maximum: 100
        },
        description: 'Número de registros por página'
      },
      idParam: {
        in: 'path',
        name: 'id',
        required: true,
        schema: {
          type: 'integer'
        },
        description: 'ID del recurso'
      }
    },
    responses: {
      NotFound: {
        description: 'Recurso no encontrado',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              success: false,
              message: 'Recurso no encontrado',
              details: 'El ID especificado no existe'
            }
          }
        }
      },
      ServerError: {
        description: 'Error interno del servidor',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            },
            example: {
              success: false,
              message: 'Error interno del servidor',
              details: 'Error al procesar la solicitud'
            }
          }
        }
      }
    }
  }
};

export const getApiDocs = () => {
  return createSwaggerSpec({
    apiFolder: 'src/app/api',
    definition: apiConfig,
  });
}; 