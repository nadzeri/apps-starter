-- Clear existing data
TRUNCATE users CASCADE;

-- Generate Users
INSERT INTO users (id, first_name, last_name, email)
VALUES
    (gen_random_uuid(), 'John', 'Smith', 'john.smith@example.com'),
    (gen_random_uuid(), 'Jane', 'Doe', 'jane.doe@example.com'),
    (gen_random_uuid(), 'Bob', 'Johnson', 'bob.johnson@example.com'),
    (gen_random_uuid(), 'Alice', 'Williams', 'alice.williams@example.com'),
    (gen_random_uuid(), 'Michael', 'Brown', 'michael.brown@example.com');