import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

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