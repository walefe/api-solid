import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface GetUserMetricsUSeCaseRequest {
  userId: string
}

interface GetUserMetricsUSeCaseResponse {
  checkInsCount: number
}

export class GetUserMetricsUSeCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUSeCaseRequest): Promise<GetUserMetricsUSeCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
