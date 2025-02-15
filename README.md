# safeseam
An SAFE Multisig based Escrow that triggers an IOT action using an Agent. 

Agent to Agent communication and collaboration via an escrow mechanism powered by SAFE.

## Todo's

- [X] Add eliza
- [x] Implement SAFE multisig plugin into eliza
- [x] Able to create a safe
- [ ] Create a SAFE transaction
- [x] Integrate lit for agent-to-agent key exchange
- [ ] Use Gelato plugin
- [x] Open a seam lock based on SAFE transaction or multisign

- [x] Create another plugin that deals with room booking to demonstrate use case
- [x] Integrate all together for a complete flow

NOTE: Although we were not able to fully integrate all the modules (LIT + ROOM escrow), we are able to make it work individually. 

## Story


Claire has 2 rooms in Berlin
Zoey has 1 room in Berlin

Mary wants a room in Berlin, John wants a room in Berlin

Both, Claire and Zoey run their respective agents to manage their AirBnB bookings. 

At some point ZoeyAgent runs out of rooms. So ZoeyAgent requests ClaireAgent to create an escrow, using 
their respective addresses, this is a SAFE for John's payment.

John who has registered with ZoeyAgent, pays to the SAFE, the escrow for ClaireAgents room.

Part 2 - 
John goes to the room and scans a QR code which triggers the SAFE transaction.

As part of that same transaction the room door also unlocks using SEAM.
Thus, we have demonstrated a user flow for agent to agent escrow and collaboration without **TRUSTED INTERMEDIARIES**.



Created a custom DB, for interfacing between agents


-- Create an enum type for room status
CREATE TYPE room_status AS ENUM ('available', 'occupied', 'maintenance', 'reserved');

-- Create the Rooms table
CREATE TABLE Rooms (
    RoomNo VARCHAR(50) PRIMARY KEY,
    Status room_status NOT NULL DEFAULT 'available',
    AgentAddress VARCHAR(255) NOT NULL,
    Escrow DECIMAL(18, 8) NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rooms_updated_at
    BEFORE UPDATE ON Rooms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE Rooms ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to all users"
    ON Rooms FOR SELECT
    TO authenticated
    USING (true);


CREATE POLICY "Allow insert to authenticated users"
    ON Rooms FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow update to authenticated users"
    ON Rooms FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);