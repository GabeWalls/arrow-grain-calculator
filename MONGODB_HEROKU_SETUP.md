# MongoDB Atlas Setup for Heroku

## Problem
The error "Could not connect to any servers in your MongoDB Atlas cluster" means Heroku's IP addresses aren't whitelisted in MongoDB Atlas.

## Solution: Configure MongoDB Atlas Network Access

### Step 1: Go to MongoDB Atlas Network Access

1. Log into [MongoDB Atlas](https://cloud.mongodb.com)
2. Go to your project/cluster
3. Click **"Network Access"** in the left sidebar

### Step 2: Add Heroku IP Access

You have two options:

#### Option A: Allow All IPs (Recommended for Heroku)
Since Heroku dynos have dynamic IPs that change, it's easiest to allow all IPs:

1. Click **"Add IP Address"** button
2. Click **"Allow Access from Anywhere"** button
3. This will add `0.0.0.0/0` to your whitelist
4. Click **"Confirm"**
5. **Note:** This is safe because your database still requires authentication (username/password)

#### Option B: Whitelist Specific IPs (More Secure)
If you prefer to be more restrictive:
1. Click **"Add IP Address"**
2. Enter `0.0.0.0/0` (allows all IPs) - OR use specific Heroku IP ranges
3. Add a comment like "Heroku Dyno Access"
4. Click **"Confirm"**

**Important:** Heroku dynos use dynamic IPs, so Option A is recommended.

### Step 3: Get Your MongoDB Connection String

1. In MongoDB Atlas, click **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (it will look like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database-name>?retryWrites=true&w=majority
   ```
5. Replace:
   - `<username>` with your MongoDB username
   - `<password>` with your MongoDB password
   - `<database-name>` with your database name (e.g., `arrowweight`)

### Step 4: Set MONGO_URI on Heroku

Run this command (replace with your actual connection string):

```bash
heroku config:set MONGO_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/arrowweight?retryWrites=true&w=majority" --app arrow-weight-calculator
```

**Important:** Make sure to:
- Keep the quotes around the connection string
- Use your actual username, password, and cluster URL
- URL-encode your password if it contains special characters

### Step 5: Verify Connection

After setting the MONGO_URI, check the logs:

```bash
heroku logs --tail --app arrow-weight-calculator
```

You should see: `✅ MongoDB connected successfully`

### Step 6: Restart the App

```bash
heroku restart --app arrow-weight-calculator
```

## Troubleshooting

### Still Getting Connection Errors?

1. **Check Network Access:**
   - Make sure `0.0.0.0/0` is in your IP whitelist
   - Wait 1-2 minutes after adding IPs (takes time to propagate)

2. **Check Connection String:**
   - Verify username/password are correct
   - Make sure special characters in password are URL-encoded
   - Check that database name exists

3. **Check Atlas Status:**
   - Make sure your cluster is running (not paused)
   - Free tier clusters pause after inactivity - wake it up if needed

4. **Check Environment Variable:**
   ```bash
   heroku config:get MONGO_URI --app arrow-weight-calculator
   ```
   Should show your connection string (password will be hidden)

### URL Encoding Special Characters

If your MongoDB password has special characters, encode them:
- `@` → `%40`
- `:` → `%3A`
- `/` → `%2F`
- `?` → `%3F`
- `#` → `%23`
- `[` → `%5B`
- `]` → `%5D`

Example: If password is `p@ss:w0rd`, use `p%40ss%3Aw0rd` in the connection string.

## Security Notes

- **Database Authentication:** Even with `0.0.0.0/0`, your database is still protected by username/password
- **Never commit MONGO_URI:** Keep it as an environment variable only
- **Rotate passwords regularly:** Change your MongoDB password periodically


