import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/photos:
 *   get:
 *     tags: [photos]
 *     summary: Obtiene lista de fotos
 *     description: Retorna una lista paginada de fotos con sus relaciones
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: albumId
 *         schema:
 *           type: integer
 *         description: Filtrar fotos por ID de álbum
 *     responses:
 *       200:
 *         description: Lista de fotos obtenida exitosamente
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
 *                     photos:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Photo'
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

    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        skip,
        take: limit,
        include: {
          album: {
            include: {
              user: true
            }
          }
        }
      }),
      prisma.photo.count()
    ]);

    return ApiResponse.success({
      photos,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al obtener fotos');
  }
}

/**
 * @swagger
 * /api/photos:
 *   post:
 *     tags: [photos]
 *     summary: Crea una nueva foto
 *     description: Crea una nueva foto asociada a un álbum
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - url
 *               - thumbnailUrl
 *               - albumId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Atardecer en la playa"
 *               url:
 *                 type: string
 *                 example: "https://example.com/photos/1.jpg"
 *               thumbnailUrl:
 *                 type: string
 *                 example: "https://example.com/photos/1-thumb.jpg"
 *               albumId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Foto creada exitosamente
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
 *                   example: "Foto creada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Photo'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const photo = await prisma.photo.create({
      data: body,
      include: {
        album: true
      }
    });
    return ApiResponse.success(photo, 'Foto creada exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al crear foto');
  }
} 