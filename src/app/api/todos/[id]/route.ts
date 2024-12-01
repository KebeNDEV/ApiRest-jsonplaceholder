import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

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