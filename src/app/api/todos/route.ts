import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const completed = searchParams.get('completed');
    const skip = (page - 1) * limit;

    const where = completed ? {
      completed: completed === 'true'
    } : {};

    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: true
        }
      }),
      prisma.todo.count({ where })
    ]);

    return ApiResponse.success({
      todos,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al obtener todos');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const todo = await prisma.todo.create({
      data: body,
      include: {
        user: true
      }
    });
    return ApiResponse.success(todo, 'Todo creado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al crear todo');
  }
} 