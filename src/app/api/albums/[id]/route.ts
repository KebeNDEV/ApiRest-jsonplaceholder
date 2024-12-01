import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/albums/{id}:
 *   get:
 *     tags: [albums]
 *     summary: Obtiene un álbum específico
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del álbum
 *     responses:
 *       200:
 *         description: Álbum encontrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Album'
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
    const album = await prisma.album.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        user: true,
        photos: true,
        _count: {
          select: {
            photos: true
          }
        }
      }
    });

    if (!album) {
      return ApiResponse.error('Álbum no encontrado', 404);
    }

    return ApiResponse.success(album);
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al obtener álbum');
  }
}

/**
 * @swagger
 * /api/albums/{id}:
 *   put:
 *     tags: [albums]
 *     summary: Actualiza un álbum
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del álbum
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Álbum actualizado exitosamente
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
 *                   example: "Álbum actualizado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Album'
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
    const album = await prisma.album.update({
      where: { id: parseInt(params.id) },
      data: body,
      include: {
        user: true
      }
    });
    return ApiResponse.success(album, 'Álbum actualizado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al actualizar álbum');
  }
}

/**
 * @swagger
 * /api/albums/{id}:
 *   delete:
 *     tags: [albums]
 *     summary: Elimina un álbum
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del álbum
 *     responses:
 *       200:
 *         description: Álbum eliminado exitosamente
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
 *                   example: "Álbum eliminado exitosamente"
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
    await prisma.album.delete({
      where: { id: parseInt(params.id) }
    });
    return ApiResponse.success(null, 'Álbum eliminado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al eliminar álbum');
  }
} 