import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Instagram Clone API',
      version: '1.0.0',
      description: 'API documentation for the Instagram Clone project'
    },
    servers: [
      {
        url: 'http://localhost:3001'
      }
    ]
  },
  apis: ['./src/routes/*.ts']
}

const specs = swaggerJsdoc(options)

export default (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
}