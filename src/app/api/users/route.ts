import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [users]
 *     summary: Obtiene lista de usuarios
 *     description: Retorna una lista paginada de usuarios con sus relaciones
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *             example:
 *               success: true
 *               data:
 *                 users: [
 *                   {
 *                     id: 1,
 *                     name: "Leanne Graham",
 *                     username: "Bret",
 *                     email: "Sincere@april.biz",
 *                     phone: "1-770-736-8031 x56442",
 *                     website: "hildegard.org",
 *                     address: {
 *                       street: "Kulas Light",
 *                       suite: "Apt. 556",
 *                       city: "Gwenborough",
 *                       zipcode: "92998-3874",
 *                       geo: { lat: "-37.3159", lng: "81.1496" }
 *                     },
 *                     company: {
 *                       name: "Romaguera-Crona",
 *                       catchPhrase: "Multi-layered client-server neural-net",
 *                       bs: "harness real-time e-markets"
 *                     },
 *                     createdAt: "2024-01-01T00:00:00.000Z"
 *                   }
 *                 ],
 *                 pagination: {
 *                   total: 10,
 *                   page: 1,
 *                   limit: 10,
 *                   pages: 1
 *                 }
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [users]
 *     summary: Crea un nuevo usuario
 *     description: Crea un nuevo usuario en el sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               phone:
 *                 type: string
 *                 example: "1-234-567-8900"
 *               website:
 *                 type: string
 *                 example: "johndoe.com"
 *               address:
 *                 type: object
 *                 example: {
 *                   street: "Main St",
 *                   suite: "Apt 123",
 *                   city: "Boston",
 *                   zipcode: "02108",
 *                   geo: { lat: "42.3601", lng: "-71.0589" }
 *                 }
 *               company:
 *                 type: object
 *                 example: {
 *                   name: "Tech Corp",
 *                   catchPhrase: "Innovation First",
 *                   bs: "digital transformation"
 *                 }
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuario creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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