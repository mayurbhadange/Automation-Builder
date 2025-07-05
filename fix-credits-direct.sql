-- Direct SQL query to fix credits
-- Connect to your database and run this query

-- First, let's check the current state
SELECT "clerkId", credits, tier FROM "User" WHERE "clerkId" = 'user_2yB5oJhNIQvPz9Yw2aIgylFB4E9';

-- Update credits to Unlimited
UPDATE "User" 
SET credits = 'Unlimited' 
WHERE "clerkId" = 'user_2yB5oJhNIQvPz9Yw2aIgylFB4E9';

-- Verify the update
SELECT "clerkId", credits, tier FROM "User" WHERE "clerkId" = 'user_2yB5oJhNIQvPz9Yw2aIgylFB4E9';

-- If you prefer a high number instead of Unlimited:
-- UPDATE "User" SET credits = '1000' WHERE "clerkId" = 'user_2yB5oJhNIQvPz9Yw2aIgylFB4E9';