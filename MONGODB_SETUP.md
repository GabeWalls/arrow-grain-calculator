# MongoDB Atlas Setup for ArrowWeight.com

Your application needs a MongoDB database to save builds. Follow these steps to set up MongoDB Atlas (free tier available).

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account (or log in if you already have one)
3. Verify your email address

## Step 2: Create a Cluster

1. After logging in, click "Build a Database"
2. Choose the **FREE** tier (M0 Sandbox)
3. Select a cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to you (or where Heroku hosts your app)
5. Name your cluster (e.g., "ArrowWeight-Calculator")
6. Click "Create Cluster"

**Note:** Cluster creation takes 3-5 minutes.

## Step 3: Create Database User

1. While the cluster is being created, go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication method
4. Create a username (e.g., `arrowweight-user`)
5. Create a strong password (SAVE THIS! You'll need it)
6. Under "Database User Privileges", select "Atlas admin" (or "Read and write to any database")
7. Click "Add User"

## Step 4: Whitelist IP Addresses

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (this adds `0.0.0.0/0`)
   - This allows Heroku (which has dynamic IPs) to connect
   - For production, you can add specific IP ranges later if needed
4. Click "Confirm"

## Step 5: Get Connection String

1. Go back to "Database" (or click "Browse Collections")
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as the driver
5. Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)

## Step 6: Configure Connection String

Replace the placeholders in your connection string:

- Replace `<username>` with your database username (e.g., `arrowweight-user`)
- Replace `<password>` with your database user password
- Replace `<dbname>` with your database name (e.g., `arrow-weight-calculator`)

**Final connection string format:**
```
mongodb+srv://arrowweight-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/arrow-weight-calculator?retryWrites=true&w=majority
```

## Step 7: Set MongoDB URI on Heroku

Run this command (replace with your actual connection string):

```bash
heroku config:set MONGO_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/arrow-weight-calculator?retryWrites=true&w=majority" --app arrow-weight-calculator
```

**Example:**
```bash
heroku config:set MONGO_URI="mongodb+srv://arrowweight-user:mypassword123@cluster0.abc123.mongodb.net/arrow-weight-calculator?retryWrites=true&w=majority" --app arrow-weight-calculator
```

## Step 8: Restart the App

After setting the MONGO_URI, restart your Heroku app:

```bash
heroku restart --app arrow-weight-calculator
```

## Step 9: Verify Connection

Check the logs to see if MongoDB connected successfully:

```bash
heroku logs --tail --app arrow-weight-calculator
```

You should see: `✅ MongoDB connected successfully`

## Troubleshooting

### Connection fails
- Double-check your username and password (no angle brackets in the connection string)
- Verify your IP address is whitelisted (should be `0.0.0.0/0` for Heroku)
- Check that your cluster is fully created and running
- Verify the database name is correct in the connection string

### Can't connect from Heroku
- Make sure you whitelisted `0.0.0.0/0` in Network Access
- Check that the connection string is correctly set: `heroku config --app arrow-weight-calculator`

### Need to update connection string
- If you change your password or need to update the connection string:
  ```bash
  heroku config:set MONGO_URI="your-new-connection-string" --app arrow-weight-calculator
  heroku restart --app arrow-weight-calculator
  ```

## Current Status

- ⏳ MongoDB Atlas cluster - **You need to create this**
- ⏳ Database user - **You need to create this**
- ⏳ IP whitelist - **You need to configure this**
- ⏳ Connection string - **You need to get and set this**

Once MongoDB is configured, your app will be able to:
- ✅ Save builds
- ✅ Load saved builds
- ✅ Delete builds
- ✅ All database features will work!

## Free Tier Limits

The MongoDB Atlas free tier (M0) includes:
- 512 MB storage
- Shared RAM and vCPU
- Perfect for getting started!

You can upgrade later if you need more resources.

