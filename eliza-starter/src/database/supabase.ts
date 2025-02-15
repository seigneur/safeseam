import { createClient } from '@supabase/supabase-js'

// Define the room status enum to match the database
export enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  RESERVED = 'reserved'
}

// Define the Room interface
export interface Room {
  roomno: string
  status: RoomStatus
  agentaddress: string
  escrow: string
  created_at?: string
  updated_at?: string
}

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_API_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

console.log('supabaseUrl:', supabaseUrl)
// Room operations class
export class RoomService {
  // Get all rooms
  async getAllRooms(): Promise<Room[]> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
    
    if (error) throw error
    return data as Room[]
  }

  // Get room by RoomNo
  async getRoomByNo(roomNo: string): Promise<Room | null> {
    const { data, error } = await supabase
      .from('Rooms')
      .select('*')
      .eq('RoomNo', roomNo)
      .single()
    
    if (error) throw error
    return data
  }

  // Get rooms by status
  async getRoomsByStatus(status: RoomStatus): Promise<Room[]> {
    const { data, error } = await supabase
      .from('Rooms')
      .select('*')
      .eq('Status', status)
    
    if (error) throw error
    return data as Room[]
  }

  // Create a new room
  async createRoom(room: Omit<Room, 'created_at' | 'updated_at'>): Promise<Room> {
    console.log("Attempting to create room", room);
    const { data, error } = await supabase
      .from('rooms')
      .insert([room])
      .select()
      .single()
    
    if (error) {console.error("Errorrr--- ", error); throw error}
    return data
  }

  // Update room status
  async updateRoomStatus(roomNo: string, status: RoomStatus): Promise<Room> {
    const { data, error } = await supabase
      .from('Rooms')
      .update({ Status: status })
      .eq('RoomNo', roomNo)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Update room escrow
  async updateRoomEscrow(roomNo: string, escrow: number): Promise<Room> {
    const { data, error } = await supabase
      .from('Rooms')
      .update({ Escrow: escrow })
      .eq('RoomNo', roomNo)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Delete room
  async deleteRoom(roomNo: string): Promise<void> {
    const { error } = await supabase
      .from('Rooms')
      .delete()
      .eq('RoomNo', roomNo)
    
    if (error) throw error
  }
}

// Usage example:
/*
const roomService = new RoomService()

// Create a new room
const newRoom = await roomService.createRoom({
  RoomNo: '101',
  Status: RoomStatus.AVAILABLE,
  AgentAddress: '0x123...',
  Escrow: 0.0
})

// Update room status
await roomService.updateRoomStatus('101', RoomStatus.OCCUPIED)

// Get all available rooms
const availableRooms = await roomService.getRoomsByStatus(RoomStatus.AVAILABLE)
*/