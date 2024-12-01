import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.album.count(),
      prisma.photo.count(),
      prisma.todo.count(),
    ]);

    const [users, posts, comments, albums, photos, todos] = counts;

    return NextResponse.json({
      success: true,
      counts: {
        users,    // debería ser 10
        posts,    // debería ser 100
        comments, // debería ser 500
        albums,   // debería ser 100
        photos,   // debería ser 5000
        todos,    // debería ser 200
      }
    });

  } catch (error) {
    console.error('Error al verificar los datos:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al verificar los datos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 