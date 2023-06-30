import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface FetchUserCheckInsHistoryUSeCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckInsHistoryUSeCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUSeCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryUSeCaseRequest): Promise<FetchUserCheckInsHistoryUSeCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return {
      checkIns,
    }
  }
}
