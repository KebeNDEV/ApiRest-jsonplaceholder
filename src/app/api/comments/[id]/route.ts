import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

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