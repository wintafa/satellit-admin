import { getTeamPlayers } from '@/lib/get-payload' 
import { serializePayloadData } from '@/lib/get-payload' 
import TeamClient from './TeamClient' 

export default async function TeamServer() { 
    // Получаем данные с сервера 
    const players = await getTeamPlayers() 

    // 🔹 Сериализуем для безопасной передачи в клиентский компонент 
    const serializedPlayers = serializePayloadData(players) 
    return <TeamClient initialPlayers={serializedPlayers} /> }