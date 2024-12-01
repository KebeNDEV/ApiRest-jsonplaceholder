import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/photos/{id}:
 *   get:
 *     tags: [photos]
 *     summary: Obtiene una foto específica
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la foto
 *     responses:
 *       200:
 *         description: Foto encontrada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Photo'
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
    const photo = await prisma.photo.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        album: {
          include: {
            user: true
          }
        }
      }
    });

    if (!photo) {
      return ApiResponse.error('Foto no encontrada', 404);
    }

    return ApiResponse.success(photo);
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al obtener foto');
  }
}

/**
 * @swagger
 * /api/photos/{id}:
 *   put:
 *     tags: [photos]
 *     summary: Actualiza una foto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la foto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Nuevo título de la foto"
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/photos/updated.jpg"
 *               thumbnailUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/photos/updated-thumb.jpg"
 *     responses:
 *       200:
 *         description: Foto actualizada exitosamente
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
 *                   example: "Foto actualizada exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Photo'
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
    const photo = await prisma.photo.update({
      where: { id: parseInt(params.id) },
      data: body,
      include: {
        album: true
      }
    });
    return ApiResponse.success(photo, 'Foto actualizada exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al actualizar foto');
  }
}

/**
 * @swagger
 * /api/photos/{id}:
 *   delete:
 *     tags: [photos]
 *     summary: Elimina una foto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la foto
 *     responses:
 *       200:
 *         description: Foto eliminada exitosamente
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
 *                   example: "Foto eliminada exitosamente"
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
    await prisma.photo.delete({
      where: { id: parseInt(params.id) }
    });
    return ApiResponse.success(null, 'Foto eliminada exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al eliminar foto');
  }
} 