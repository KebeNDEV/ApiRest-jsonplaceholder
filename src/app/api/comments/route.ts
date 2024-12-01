import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/comments:
 *   get:
 *     tags: [comments]
 *     summary: Obtiene lista de comentarios
 *     description: Retorna una lista paginada de comentarios con sus relaciones
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: postId
 *         schema:
 *           type: integer
 *         description: Filtrar comentarios por ID de post
 *     responses:
 *       200:
 *         description: Lista de comentarios obtenida exitosamente
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
 *                     comments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Comment'
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

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        skip,
        take: limit,
        include: {
          post: {
            include: {
              user: true
            }
          }
        }
      }),
      prisma.comment.count()
    ]);

    return ApiResponse.success({
      comments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al obtener comentarios');
  }
}

/**
 * @swagger
 * /api/comments:
 *   post:
 *     tags: [comments]
 *     summary: Crea un nuevo comentario
 *     description: Crea un nuevo comentario asociado a un post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - body
 *               - postId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "juan@example.com"
 *               body:
 *                 type: string
 *                 example: "Excelente publicación..."
 *               postId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Comentario creado exitosamente
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
 *                   example: "Comentario creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const comment = await prisma.comment.create({
      data: body,
      include: {
        post: true
      }
    });
    return ApiResponse.success(comment, 'Comentario creado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al crear comentario');
  }
} 