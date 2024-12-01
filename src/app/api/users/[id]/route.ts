import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

// GET /api/users/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        posts: true,
        albums: true,
        todos: true,
        _count: {
          select: {
            posts: true,
            albums: true,
            todos: true
          }
        }
      }
    });

    if (!user) {
      return ApiResponse.error('Usuario no encontrado', 404);
    }

    return ApiResponse.success(user);
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al obtener usuario');
  }
}

// PUT /api/users/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const user = await prisma.user.update({
      where: { id: parseInt(params.id) },
      data: body
    });
    return ApiResponse.success(user, 'Usuario actualizado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al actualizar usuario');
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: parseInt(params.id) }
    });
    return ApiResponse.success(null, 'Usuario eliminado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al eliminar usuario');
  }
} 