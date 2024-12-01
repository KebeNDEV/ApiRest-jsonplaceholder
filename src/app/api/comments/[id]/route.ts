import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     tags: [comments]
 *     summary: Obtiene un comentario específico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
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
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        post: {
          include: {
            user: true
          }
        }
      }
    });

    if (!comment) {
      return ApiResponse.error('Comentario no encontrado', 404);
    }

    return ApiResponse.success(comment);
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al obtener comentario');
  }
}

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     tags: [comments]
 *     summary: Actualiza un comentario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comentario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               body:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comentario actualizado exitosamente
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
 *                   example: "Comentario actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
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
    const comment = await prisma.comment.update({
      where: { id: parseInt(params.id) },
      data: body,
      include: {
        post: true
      }
    });
    return ApiResponse.success(comment, 'Comentario actualizado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al actualizar comentario');
  }
}

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     tags: [comments]
 *     summary: Elimina un comentario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario eliminado exitosamente
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
 *                   example: "Comentario eliminado exitosamente"
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
    await prisma.comment.delete({
      where: { id: parseInt(params.id) }
    });
    return ApiResponse.success(null, 'Comentario eliminado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al eliminar comentario');
  }
} 