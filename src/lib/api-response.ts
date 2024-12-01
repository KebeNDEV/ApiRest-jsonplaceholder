export class ApiResponse {
  static success<T>(data: T, message: string = 'Success') {
    return Response.json({
      success: true,
      message,
      data
    });
  }

  static error(message: string, status: number = 500) {
    return Response.json(
      {
        success: false,
        message
      },
      { status }
    );
  }
} 