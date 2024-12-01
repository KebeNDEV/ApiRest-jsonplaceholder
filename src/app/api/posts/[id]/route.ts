import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     tags: [posts]
 *     summary: Obtiene un post específico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post
 *     responses:
 *       200:
 *         description: Post encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        user: true,
        comments: true,
        _count: {
          select: {
            comments: true
          }
        }
      }
    });

    if (!post) {
      return ApiResponse.error('Post no encontrado', 404);
    }

    return ApiResponse.success(post);
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al obtener post');
  }
}

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     tags: [posts]
 *     summary: Actualiza un post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post actualizado exitosamente
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
 *                   example: "Post actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Post'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const post = await prisma.post.update({
      where: { id: parseInt(params.id) },
      data: body,
      include: {
        user: true
      }
    });
    return ApiResponse.success(post, 'Post actualizado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al actualizar post');
  }
}

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     tags: [posts]
 *     summary: Elimina un post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post
 *     responses:
 *       200:
 *         description: Post eliminado exitosamente
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
 *                   example: "Post eliminado exitosamente"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.post.delete({
      where: { id: parseInt(params.id) }
    });
    return ApiResponse.success(null, 'Post eliminado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al eliminar post');
  }
} 