import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitute: number
  userLongitute: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

const MAX_DISTANCE_IN_KILOMOTERS = 0.1

export class CheckInUseCase {
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitute,
    userLongitute,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)
    if (!gym) throw new ResourceNotFoundError()
    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitute, longitude: userLongitute },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )
    if (distance > MAX_DISTANCE_IN_KILOMOTERS) throw new Error()
    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )
    if (checkInOnSameDay) throw new Error()
    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }
}
