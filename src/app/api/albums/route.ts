import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/albums:
 *   get:
 *     tags: [albums]
 *     summary: Obtiene lista de álbumes
 *     description: Retorna una lista paginada de álbumes con sus relaciones
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filtrar álbumes por ID de usuario
 *     responses:
 *       200:
 *         description: Lista de álbumes obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     albums:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Album'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        skip,
        take: limit,
        include: {
          user: true,
          photos: true,
          _count: {
            select: {
              photos: true
            }
          }
        }
      }),
      prisma.album.count()
    ]);

    return ApiResponse.success({
      albums,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al obtener álbumes');
  }
}

/**
 * @swagger
 * /api/albums:
 *   post:
 *     tags: [albums]
 *     summary: Crea un nuevo álbum
 *     description: Crea un nuevo álbum asociado a un usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Vacaciones 2024"
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Álbum creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Álbum creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Album'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const album = await prisma.album.create({
      data: body,
      include: {
        user: true
      }
    });
    return ApiResponse.success(album, 'Álbum creado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al crear álbum');
  }
} 