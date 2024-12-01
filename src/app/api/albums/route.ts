import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        skip,
        take: limit,
        include: {
          user: true,
          photos: true,
          _count: {
            select: {
              photos: true
            }
          }
        }
      }),
      prisma.album.count()
    ]);

    return ApiResponse.success({
      albums,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al obtener álbumes');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const album = await prisma.album.create({
      data: body,
      include: {
        user: true
      }
    });
    return ApiResponse.success(album, 'Álbum creado exitosamente');
  } catch (error) {
    console.error('Error:', error);
    return ApiResponse.error('Error al crear álbum');
  }
} 