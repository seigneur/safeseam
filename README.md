# safeseam
An SAFE Multisig based Escrow that triggers an IOT action using an Agent. 

Agent to Agent communication and collaboration via an escrow mechanism powered by SAFE.

Todo's

- [X] Add eliza
- [x] Implement SAFE multisig plugin into eliza
- [ ] Able to create a safe
- [ ] Create a SAFE transaction
- [ ] Integrate lit for agent-to-agent key exchange
- [ ] Use Gelato plugin
- [ ] Open a seam lock based on SAFE transaction or multisign


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
    ON Rooms FOR SELECT, INSERT, UPDATE
    TO authenticated
    USING (true);