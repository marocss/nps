// integration test
import request from "supertest";
import { getConnection } from "typeorm";
import { app } from "../app";
import createConnection from '../database';



describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    const connection = getConnection()
    await connection.dropDatabase()
    await connection.close()
  })

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      email: "user@email.com",
      name: "Jane Doe"
    })
  
    expect(response.status).toBe(201)
  })

  it('should not be able to create a new user if email is already taken', async () => {
    const response = await request(app).post('/users').send({
      email: "user@email.com",
      name: "Jane Doe"
    })
  
    expect(response.status).toBe(400)
  })

})
