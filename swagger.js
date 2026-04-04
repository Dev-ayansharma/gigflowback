import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GigFlow API",
      version: "1.0.0",
      description: "API documentation for GigFlow Backend",
    },
    servers: [
      {
        url: "http://localhost:9000/app",
      },
    ],
  },
  apis: ["./routers/*.js"],
    components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token",
      },
    },
  },
  security: [{ cookieAuth: [] }],
};



export const swaggerSpec = swaggerJSDoc(options);