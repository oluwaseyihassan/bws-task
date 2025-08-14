export const successResponse = (data: any,message: string) => {
    return {
        status: 'success',
        message,
        data
    };
}

export const errorResponse = (message: string, error: any) => {
    return {
        status: 'error',
        message,
        error
    };
}
