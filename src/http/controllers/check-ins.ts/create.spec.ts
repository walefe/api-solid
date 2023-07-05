import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Create Check In (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should be able to createa a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)
    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript Gym',
        latitude: -16.7214026,
        longitude: -49.2516448,
      },
    })
    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -16.7214026,
        longitude: -49.2516448,
      })

    expect(response.statusCode).toEqual(201)
  })
})
