// swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  apis: [
    path.join(__dirname, "index.js"),
    path.join(__dirname, "src/routes/*.js"),
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};


export default swaggerDocs;

