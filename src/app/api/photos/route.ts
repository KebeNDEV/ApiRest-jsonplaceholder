import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        skip,
        take: limit,
        include: {
          album: {
            include: {
              user: true
            }
          }
        }
      }),
      prisma.photo.count()
    ]);

    return ApiResponse.success({
      photos,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al obtener fotos');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const photo = await prisma.photo.create({
      data: body,
      include: {
        album: true
      }
    });
    return ApiResponse.success(photo, 'Foto creada exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al crear foto');
  }
} 