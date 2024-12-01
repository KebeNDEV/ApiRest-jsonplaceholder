import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '@/lib/api-response';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/todos:
 *   get:
 *     tags: [todos]
 *     summary: Obtiene lista de todos
 *     description: Retorna una lista paginada de todos con sus relaciones
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         description: Filtrar todos por ID de usuario
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filtrar por estado de completado
 *     responses:
 *       200:
 *         description: Lista de todos obtenida exitosamente
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
 *                     todos:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Todo'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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

/**
 * @swagger
 * /api/todos:
 *   post:
 *     tags: [todos]
 *     summary: Crea un nuevo todo
 *     description: Crea una nueva tarea asociada a un usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - userId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Completar informe mensual"
 *               completed:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Todo creado exitosamente
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
 *                   example: "Todo creado exitosamente"
 *                 data:
 *                   $ref: '#/components/schemas/Todo'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
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