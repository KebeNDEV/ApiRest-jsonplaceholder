import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import type { User, Post, Comment, Album, Photo, Todo } from '@/types/jsonplaceholder';

const prisma = new PrismaClient();
const BASE_URL = 'https://jsonplaceholder.typicode.com';

async function fetchData<T>(endpoint: string): Promise<T[]> {
  const response = await axios.get<T[]>(`${BASE_URL}${endpoint}`);
  return response.data;
}

export async function GET() {
  try {
    // Primero sincronizamos usuarios ya que otros datos dependen de ellos
    const users = await fetchData<User>('/users');
    await Promise.all(
      users.map(user =>
        prisma.user.upsert({
          where: { id: user.id },
          update: {
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            website: user.website,
            address: user.address,
            company: user.company,
          },
          create: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            phone: user.phone,
            website: user.website,
            address: user.address,
            company: user.company,
          },
        })
      )
    );

    // Luego sincronizamos el resto de los datos en paralelo
    const [posts, comments, albums, photos, todos] = await Promise.all([
      fetchData<Post>('/posts'),
      fetchData<Comment>('/comments'),
      fetchData<Album>('/albums'),
      fetchData<Photo>('/photos'),
      fetchData<Todo>('/todos'),
    ]);

    await Promise.all([
      // Sincronizar posts
      ...posts.map(post =>
        prisma.post.upsert({
          where: { id: post.id },
          update: { title: post.title, body: post.body, userId: post.userId },
          create: { id: post.id, title: post.title, body: post.body, userId: post.userId },
        })
      ),
      // Sincronizar comentarios
      ...comments.map(comment =>
        prisma.comment.upsert({
          where: { id: comment.id },
          update: {
            postId: comment.postId,
            name: comment.name,
            email: comment.email,
            body: comment.body,
          },
          create: {
            id: comment.id,
            postId: comment.postId,
            name: comment.name,
            email: comment.email,
            body: comment.body,
          },
        })
      ),
      // Sincronizar álbumes
      ...albums.map(album =>
        prisma.album.upsert({
          where: { id: album.id },
          update: { title: album.title, userId: album.userId },
          create: { id: album.id, title: album.title, userId: album.userId },
        })
      ),
      // Sincronizar fotos
      ...photos.map(photo =>
        prisma.photo.upsert({
          where: { id: photo.id },
          update: {
            albumId: photo.albumId,
            title: photo.title,
            url: photo.url,
            thumbnailUrl: photo.thumbnailUrl,
          },
          create: {
            id: photo.id,
            albumId: photo.albumId,
            title: photo.title,
            url: photo.url,
            thumbnailUrl: photo.thumbnailUrl,
          },
        })
      ),
      // Sincronizar todos
      ...todos.map(todo =>
        prisma.todo.upsert({
          where: { id: todo.id },
          update: {
            userId: todo.userId,
            title: todo.title,
            completed: todo.completed,
          },
          create: {
            id: todo.id,
            userId: todo.userId,
            title: todo.title,
            completed: todo.completed,
          },
        })
      ),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Todos los datos han sido sincronizados correctamente',
      count: {
        users: users.length,
        posts: posts.length,
        comments: comments.length,
        albums: albums.length,
        photos: photos.length,
        todos: todos.length,
      },
    });

  } catch (error) {
    console.error('Error en la sincronización:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al sincronizar los datos',
        details: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}