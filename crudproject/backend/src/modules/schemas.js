const registerSchema = {
    body: {
        type: 'object',
        required: ['email', 'password', 'username'],
        properties: {
            username: {
                type: 'string',
                minLength: 3,
                maxLength: 30,
                pattern: '^[a-zA-Z0-9_]+$'
            },
            email: {
                type: 'string',
                format: 'email'
            },
            password: {
                type: 'string',
                minLength: 8,
                pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'
            }
        },
        additionalProperties: false
    },
    response: {
        201: {
            type: 'object',
            required: ['message'],
            properties: {
                message: {type: 'string'}
            }
        }
    }
}

const loginSchema = {
    body: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
            username: {
                type: 'string',
                minLength: 3,
                maxLength: 30,
                pattern: '^[a-zA-Z0-9_]+$'
            },
            password: {
                type: 'string',
                minLength: 8,
                pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'
            }
        },
        additionalProperties: false
    },
    response: {
        200: {
            type: 'object',
            required: ['message', 'user', 'accessToken'],
            properties: {
                message: {type: 'string'},
                accessToken: {type: 'string'},
                user: {
                    type: 'object',
                    required: ['id', 'username', 'email'],
                    properties: {
                        id: {type: 'number'},
                        username: {type: 'string'},
                        email: {type: 'string'}
                    }
                }
            }
        }
    }
}

const noteSchema = {
    body: {
        type: 'object',
        required: ['title', 'content'],
        properties: {
            title: {
                type: 'string',
                minLength: 5,
                maxLength: 30,
            },
            content: {
                type: 'string',
                minLength: 8,
                maxLength: 500,
            }
        },
        additionalProperties: false
    },
    response: {
        200: {
            type: 'object',
            required: ['message'],
            properties: {
                message: {type: 'string'}
            }
        }
    }
}

const deleteNoteSchema = {
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string', 
                pattern: '^[0-9]+$'
            }
        },
        additionalProperties: false
    },
    response: {
        200: {
            type: 'object',
            required: ['message'],
            properties: {
                message: {type: 'string'}
            }
        }
    }
}

const schemas = {
    register: registerSchema,
    login: loginSchema,
    noteSchema: noteSchema,
    deleteNoteSchema: deleteNoteSchema,
};

export default schemas;