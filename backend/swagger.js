// swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lofi API",
      version: "1.0.0",
      description: "LofiLife API endpoints",
    },
    servers: [
      {
        url: "https://focussflow.up.railway.app",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token in the format: Bearer <token>"
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ["./index.js", "./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};


export default swaggerDocs;

