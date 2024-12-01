/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del usuario
 *           example: 1
 *         name:
 *           type: string
 *           description: Nombre completo del usuario
 *           example: "Leanne Graham"
 *         username:
 *           type: string
 *           description: Nombre de usuario único
 *           example: "Bret"
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *           example: "Sincere@april.biz"
 *         phone:
 *           type: string
 *           description: Número telefónico
 *           example: "1-770-736-8031 x56442"
 *         website:
 *           type: string
 *           description: Sitio web del usuario
 *           example: "hildegard.org"
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *               example: "Kulas Light"
 *             suite:
 *               type: string
 *               example: "Apt. 556"
 *             city:
 *               type: string
 *               example: "Gwenborough"
 *             zipcode:
 *               type: string
 *               example: "92998-3874"
 *             geo:
 *               type: object
 *               properties:
 *                 lat:
 *                   type: string
 *                   example: "-37.3159"
 *                 lng:
 *                   type: string
 *                   example: "81.1496"
 *         company:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "Romaguera-Crona"
 *             catchPhrase:
 *               type: string
 *               example: "Multi-layered client-server neural-net"
 *             bs:
 *               type: string
 *               example: "harness real-time e-markets"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del registro
 *           example: "2024-01-01T00:00:00.000Z"
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - body
 *         - userId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del post
 *           example: 1
 *         title:
 *           type: string
 *           description: Título del post
 *           example: "sunt aut facere repellat provident"
 *         body:
 *           type: string
 *           description: Contenido del post
 *           example: "quia et suscipit suscipit recusandae..."
 *         userId:
 *           type: integer
 *           description: ID del usuario que creó el post
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *           example: "2024-01-01T00:00:00.000Z"
 *     Comment:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - body
 *         - postId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del comentario
 *           example: 1
 *         name:
 *           type: string
 *           description: Nombre del comentarista
 *           example: "id labore ex et quam laborum"
 *         email:
 *           type: string
 *           format: email
 *           description: Email del comentarista
 *           example: "Eliseo@gardner.biz"
 *         body:
 *           type: string
 *           description: Contenido del comentario
 *           example: "laudantium enim quasi est quidem..."
 *         postId:
 *           type: integer
 *           description: ID del post al que pertenece
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *           example: "2024-01-01T00:00:00.000Z"
 *     Album:
 *       type: object
 *       required:
 *         - title
 *         - userId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del álbum
 *           example: 1
 *         title:
 *           type: string
 *           description: Título del álbum
 *           example: "quidem molestiae enim"
 *         userId:
 *           type: integer
 *           description: ID del usuario propietario
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *           example: "2024-01-01T00:00:00.000Z"
 *     Photo:
 *       type: object
 *       required:
 *         - title
 *         - url
 *         - thumbnailUrl
 *         - albumId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único de la foto
 *           example: 1
 *         title:
 *           type: string
 *           description: Título de la foto
 *           example: "accusamus beatae ad facilis cum similique qui sunt"
 *         url:
 *           type: string
 *           description: URL de la imagen completa
 *           example: "https://via.placeholder.com/600/92c952"
 *         thumbnailUrl:
 *           type: string
 *           description: URL de la miniatura
 *           example: "https://via.placeholder.com/150/92c952"
 *         albumId:
 *           type: integer
 *           description: ID del álbum al que pertenece
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *           example: "2024-01-01T00:00:00.000Z"
 *     Todo:
 *       type: object
 *       required:
 *         - title
 *         - completed
 *         - userId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único del todo
 *           example: 1
 *         title:
 *           type: string
 *           description: Título de la tarea
 *           example: "delectus aut autem"
 *         completed:
 *           type: boolean
 *           description: Estado de completado
 *           example: false
 *         userId:
 *           type: integer
 *           description: ID del usuario asignado
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *           example: "2024-01-01T00:00:00.000Z"
 */ 