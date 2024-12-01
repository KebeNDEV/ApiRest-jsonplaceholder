import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/posts:
 *   get:
 *     tags: [posts]
 *     summary: Obtiene lista de posts
 *     description: Retorna una lista paginada de posts con sus relaciones
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filtrar posts por ID de usuario
 *     responses:
 *       200:
 *         description: Lista de posts obtenida exitosamente
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
 *                     posts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Post'
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

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        skip,
        take: limit,
        include: {
          user: true,
          comments: true,
          _count: {
            select: {
              comments: true
            }
          }
        }
      }),
      prisma.post.count()
    ]);

    return ApiResponse.success({
      posts,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al obtener posts');
  }
}

/**
 * @swagger
 * /api/posts:
 *   post:
 *     tags: [posts]
 *     summary: Crea un nuevo post
 *     description: Crea un nuevo post asociado a un usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Nuevo post importante"
 *               body:
 *                 type: string
 *                 example: "Contenido del nuevo post..."
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Post creado exitosamente
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
 *                   example: "Post creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const post = await prisma.post.create({
      data: body,
      include: {
        user: true
      }
    });
    return ApiResponse.success(post, 'Post creado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al crear post');
  }
} 