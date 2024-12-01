import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

// GET /api/users
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              posts: true,
              albums: true,
              todos: true
            }
          }
        }
      }),
      prisma.user.count()
    ]);

    return ApiResponse.success({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al obtener usuarios');
  }
}

// POST /api/users
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await prisma.user.create({
      data: body
    });
    return ApiResponse.success(user, 'Usuario creado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al crear usuario');
  }
} 