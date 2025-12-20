import { apiClient } from './client'
import {
  restaurantDetailSchema,
  type RestaurantDetail,
} from '@/lib/schemas/restaurants/restaurant.detail.schema'

const resource = '/restaurants'

export const restaurantsApi = {
  async getById(id: number): Promise<RestaurantDetail> {
    const url = `${resource}/${id}`
    console.log('[RestaurantsAPI] getById -> url:', url)
    const data = await apiClient.get(url)
    console.log('[RestaurantsAPI] response:', data)
    return restaurantDetailSchema.parse(data)
  },
}
