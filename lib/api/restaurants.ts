import {
  type RestaurantDetail,
  restaurantDetailSchema,
} from '@/lib/schemas/restaurants/restaurant.detail.schema'
import {
  type RestaurantList,
  restaurantListSchema,
} from '@/lib/schemas/restaurants/restaurant.list.schema'

import { apiClient } from './client'

const resource = '/restaurants'

export const restaurantsApi = {
  async getById(id: number): Promise<RestaurantDetail> {
    const url = `${resource}/${id}`
    const data = await apiClient.get(url)
    return restaurantDetailSchema.parse(data)
  },
  async getByOwner(ownerId: number): Promise<RestaurantList[]> {
    const url = `${resource}/owner/${ownerId}`
    const data = await apiClient.get(url)
    return restaurantListSchema.array().parse(data)
  },
}
