import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

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