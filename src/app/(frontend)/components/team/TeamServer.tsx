// src/components/team/TeamServer.tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import { serializePayloadData } from '@/lib/get-payload'
import TeamClient from './TeamClient'

// 🔹 Обновлять кэш каждые 60 секунд
export const revalidate = 60

export default async function TeamServer() {
  const payload = await getPayload({ config })
  
  // 🔹 Прямой запрос к коллекции
  const { docs: players } = await payload.find({
    collection: 'team',
    where: { isPublished: { equals: true } },
    sort: 'order',
    depth: 1,
    // 🔹 Кэш ответа от Payload на 60 секунд
    revalidate: 60,
  })
  
  // 🔹 Сериализуем для клиентского компонента
  const serializedPlayers = serializePayloadData(players)
  
  return <TeamClient initialPlayers={serializedPlayers} />
}