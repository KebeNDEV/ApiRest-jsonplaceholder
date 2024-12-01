import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     tags: [todos]
 *     summary: Obtiene un todo específico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del todo
 *     responses:
 *       200:
 *         description: Todo encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
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
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        user: true
      }
    });

    if (!todo) {
      return ApiResponse.error('Todo no encontrado', 404);
    }

    return ApiResponse.success(todo);
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al obtener todo');
  }
}

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     tags: [todos]
 *     summary: Actualiza un todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Todo actualizado exitosamente
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
 *                   example: "Todo actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
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
    const todo = await prisma.todo.update({
      where: { id: parseInt(params.id) },
      data: body,
      include: {
        user: true
      }
    });
    return ApiResponse.success(todo, 'Todo actualizado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al actualizar todo');
  }
}

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     tags: [todos]
 *     summary: Elimina un todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del todo
 *     responses:
 *       200:
 *         description: Todo eliminado exitosamente
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
 *                   example: "Todo eliminado exitosamente"
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
    await prisma.todo.delete({
      where: { id: parseInt(params.id) }
    });
    return ApiResponse.success(null, 'Todo eliminado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al eliminar todo');
  }
} 