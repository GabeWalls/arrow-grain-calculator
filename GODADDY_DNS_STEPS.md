# Step-by-Step: Configuring DNS in GoDaddy for ArrowWeight.com

Follow these exact steps to configure your domain to point to Heroku.

## Step 1: Log into GoDaddy

1. Go to **https://www.godaddy.com**
2. Click **"Sign In"** in the top right corner
3. Enter your GoDaddy account credentials and sign in

## Step 2: Navigate to Domain Management

1. After logging in, look for **"My Products"** in the top navigation bar
   - If you don't see it, click on your account name/icon and look for "My Products"
2. Find **"Domains"** in the menu and click it
3. You should see a list of all your domains
4. Find **arrowweight.com** in the list
5. Click the **three dots (...)** or **"DNS"** button next to arrowweight.com
   - Sometimes it shows as a gear icon ⚙️ or "Manage" button

## Step 3: Access DNS Records

1. You'll be taken to the DNS Management page for arrowweight.com
2. Look for a section titled something like:
   - **"DNS Records"**
   - **"Records"**
   - **"DNS Management"**
3. You'll see a list of existing DNS records (A, CNAME, MX, etc.)

## Step 4: Configure the WWW Subdomain (Easiest First)

We'll start with www.arrowweight.com since it's simpler (uses CNAME).

### 4a. Check if www record already exists

- Scroll through your DNS records
- Look for any record with **Name:** `www`
- If one exists, you'll need to edit it (click Edit/✏️)
- If none exists, you'll add a new one

### 4b. Add or Edit www CNAME Record

**If adding NEW record:**
1. Click the **"Add"** or **"+ Add"** button (usually at the top or bottom of the records list)
2. Select **"CNAME"** from the record type dropdown
3. Fill in:
   - **Name:** `www`
   - **Value:** `elliptical-catfish-isg7wlm7rv72sot5bbpkjs1.herokudns.com`
   - **TTL:** Leave as default (usually 600 seconds or 1 hour)
4. Click **"Save"** or **"Add Record"**

**If EDITING existing record:**
1. Click the **Edit** button (✏️) next to the existing www record
2. Update the **Value** to: `elliptical-catfish-isg7wlm7rv72sot5bbpkjs1.herokudns.com`
3. Make sure **Type** is set to **CNAME**
4. Click **"Save"**

## Step 5: Configure Root Domain (arrowweight.com)

This is trickier because GoDaddy may or may not support ALIAS records for the root domain.

### Option A: If GoDaddy Shows "ALIAS" or "ANAME" as an Option (Best)

1. Look for any existing record with **Name:** `@` or blank/empty
   - This is the root domain record
2. Click **"Add"** or **"Edit"** (if one exists)
3. Select **"ALIAS"** or **"ANAME"** from the record type dropdown
4. Fill in:
   - **Name:** `@` (or leave blank/empty)
   - **Value:** `serene-jackfruit-uwjdqajsure3n3nho3i0ujoa.herokudns.com`
   - **TTL:** Leave as default
5. Click **"Save"**

**⚠️ If you don't see ALIAS/ANAME option, go to Option B below**

### Option B: If GoDaddy Doesn't Support ALIAS/ANAME (Common Situation)

If you can't find ALIAS or ANAME as an option, you have a few choices:

#### Option B1: Use www.arrowweight.com as Primary (Easiest)
- **Just skip configuring the root domain for now**
- Users will access via www.arrowweight.com
- This works perfectly fine - many sites do this
- Later, you can set up a redirect from arrowweight.com → www.arrowweight.com

#### Option B2: Use A Records (Not Recommended, Less Reliable)
- Heroku's IP addresses can change
- You'd need to add multiple A records
- This is more complex and less reliable
- **Not recommended unless you have to**

#### Option B3: Use Cloudflare (Best Long-term Solution)
- Cloudflare supports ALIAS records
- Also provides CDN and better performance
- Free tier available
- Steps:
  1. Sign up at cloudflare.com (free)
  2. Add your domain
  3. Change nameservers in GoDaddy to Cloudflare's nameservers
  4. Configure DNS in Cloudflare instead
  5. Use ALIAS record there

**For now, I recommend Option B1** - just use www.arrowweight.com. You can always add the root domain later.

## Step 6: Verify Your DNS Records

After adding/editing records, your DNS records should look like this:

**For www subdomain:**
- **Type:** CNAME
- **Name:** www
- **Value:** elliptical-catfish-isg7wlm7rv72sot5bbpkjs1.herokudns.com

**For root domain (if you added it):**
- **Type:** ALIAS (or ANAME)
- **Name:** @ (or blank)
- **Value:** serene-jackfruit-uwjdqajsure3n3nho3i0ujoa.herokudns.com

## Step 7: Save and Wait

1. Make sure all changes are saved
2. DNS propagation can take anywhere from **15 minutes to 48 hours**
3. Usually it's much faster (15 minutes to a few hours)

## Step 8: Verify DNS Propagation

After waiting a bit (15-30 minutes), you can check if DNS has propagated:

### Method 1: Use Online Tool
1. Go to https://www.whatsmydns.net/
2. Enter `arrowweight.com` (or `www.arrowweight.com`)
3. Select "CNAME" (or "A" if you used A records)
4. Check if it shows your Heroku DNS target

### Method 2: Check SSL Certificate Status
1. In your terminal, run:
   ```bash
   heroku certs --app arrow-weight-calculator
   ```
2. After DNS propagates, Heroku will automatically provision SSL certificates
3. You'll see certificate status change to "Active" or "Issued"

## Step 9: Test Your Domain

Once DNS has propagated (you'll know because the SSL certificate will be issued):

1. Visit **https://www.arrowweight.com** in your browser
2. You should see your Arrow Weight Calculator app!
3. If you configured the root domain, visit **https://arrowweight.com**

**⚠️ Note:** You may see a security warning initially. This is normal while the SSL certificate is being issued. Wait a few more minutes and try again.

## Troubleshooting

### "Can't find DNS section"
- Try clicking on the domain name itself, then look for "DNS" or "DNS Management" tab
- Sometimes it's under "Advanced" or "Settings"

### "Changes not showing up"
- DNS changes can take time to propagate
- Try clearing your browser cache
- Use https://www.whatsmydns.net/ to check propagation status

### "Still seeing old site/404 error"
- Make sure DNS records are saved correctly
- Double-check the DNS target values are exactly right
- Wait longer for propagation (can take up to 48 hours)

### "SSL certificate not issued yet"
- DNS must fully propagate first
- Check: `heroku certs:auto --app arrow-weight-calculator`
- Can take a few hours after DNS propagation

### Need Help?
If you get stuck, you can:
1. Contact GoDaddy support (they're usually helpful)
2. Check Heroku logs: `heroku logs --tail --app arrow-weight-calculator`
3. Verify your DNS setup: `heroku domains --app arrow-weight-calculator`

## Summary of DNS Values You Need

**For www.arrowweight.com (CNAME):**
- Name: `www`
- Value: `elliptical-catfish-isg7wlm7rv72sot5bbpkjs1.herokudns.com`

**For arrowweight.com (ALIAS/ANAME if available):**
- Name: `@` (or blank)
- Value: `serene-jackfruit-uwjdqajsure3n3nho3i0ujoa.herokudns.com`

---

**Next Steps After DNS:**
1. Wait for DNS to propagate (15 min - 48 hours)
2. SSL certificate will auto-issue
3. Test your domain
4. Set up MongoDB (see MONGODB_SETUP.md)

