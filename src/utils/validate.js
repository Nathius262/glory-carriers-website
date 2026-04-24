export const validate = (schema, data) => {
    const result = schema.safeParse(data);

    if (!result.success) {
        const errors = {};

        result.error.issues.forEach(err => {
            errors[err.path[0]] = err.message;
        });

        const error = new Error("Validation failed");
        error.status = 400;
        error.errors = errors;

        throw error;
    }

    return result.data;
};