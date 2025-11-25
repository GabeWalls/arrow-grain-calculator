# Solution: Use Cloudflare for DNS Management

Since GoDaddy has locked the A records and doesn't support ALIAS for root domain, we'll use Cloudflare (free) which supports ALIAS records.

## Why Cloudflare?
- ✅ Free DNS management
- ✅ Supports ALIAS/ANAME records for root domain
- ✅ Better performance (CDN included)
- ✅ Full control over DNS records
- ✅ Easy SSL management

## Step-by-Step Setup

### Step 1: Sign Up for Cloudflare (Free)

1. Go to **https://www.cloudflare.com**
2. Click **"Sign Up"** (top right)
3. Create a free account (just need email and password)
4. Verify your email address

### Step 2: Add Your Domain to Cloudflare

1. After logging in, you'll see the Cloudflare dashboard
2. Click **"Add a Site"** or **"Add Site"** button
3. Enter: `arrowweight.com`
4. Click **"Continue"**
5. Select the **FREE** plan (it's selected by default)
6. Click **"Continue"**

### Step 3: Cloudflare Scans Your DNS Records

1. Cloudflare will automatically scan your current DNS records from GoDaddy
2. Wait for the scan to complete (takes ~30 seconds)
3. You'll see a list of DNS records that Cloudflare found

### Step 4: Review and Confirm DNS Records

Cloudflare should show:
- Your NS records (don't worry about these)
- Your SOA record (don't worry about this)
- Your CNAME for www (already correct!)

**Important:** 
- **DELETE** any A records that Cloudflare found (those old AWS IPs)
- **KEEP** the CNAME record for www

### Step 5: Configure DNS Records in Cloudflare

1. **Remove old A records** (if Cloudflare imported them):
   - Find A records pointing to `15.197.225.128` or `3.33.251.168`
   - Click the trash icon to delete them

2. **Add ALIAS record for root domain:**
   - Click **"+ Add record"**
   - Type: Select **"CNAME"** (Cloudflare automatically converts this to ALIAS for root domain)
   - Name: `@` (or arrowweight.com)
   - Target: `serene-jackfruit-uwjdqajsure3n3nho3i0ujoa.herokudns.com`
   - Proxy status: Toggle to **DNS only** (gray cloud, not orange)
   - Click **"Save"**

3. **Verify www CNAME:**
   - Make sure www CNAME exists
   - Type: CNAME
   - Name: `www`
   - Target: `elliptical-catfish-isg7wlm7rv72sot5bbpkjs1.herokudns.com`
   - Proxy status: **DNS only** (gray cloud)
   - Click **"Save"** if you needed to edit it

### Step 6: Update Nameservers in GoDaddy

After saving DNS records in Cloudflare:

1. Cloudflare will show you **two nameservers** (something like):
   ```
   linda.ns.cloudflare.com
   ron.ns.cloudflare.com
   ```
   **COPY THESE** - you'll need them!

2. Go back to **GoDaddy**:
   - Log into GoDaddy
   - Go to My Products → Domains → arrowweight.com
   - Look for **"Nameservers"** or **"DNS"** section
   - Click **"Change"** or **"Manage"** next to Nameservers

3. In GoDaddy Nameserver settings:
   - Select **"Custom"** (not "GoDaddy Nameservers")
   - Delete any existing nameserver entries
   - Add the first Cloudflare nameserver (e.g., `linda.ns.cloudflare.com`)
   - Add the second Cloudflare nameserver (e.g., `ron.ns.cloudflare.com`)
   - **Save** the changes

4. Go back to **Cloudflare** and click **"Continue"** or **"Done"**

### Step 7: Wait for Nameserver Propagation

- DNS propagation takes **15 minutes to 48 hours** (usually 1-2 hours)
- Cloudflare will email you when DNS is active
- You can check status in Cloudflare dashboard

### Step 8: Verify and Test

After nameservers propagate:

1. **Check DNS in Cloudflare:**
   - Log into Cloudflare
   - Select your domain
   - Go to **"DNS"** section
   - Verify records are correct

2. **Test the site:**
   - Visit: https://www.arrowweight.com
   - Visit: https://arrowweight.com (should now work!)

3. **Refresh SSL on Heroku:**
   ```bash
   heroku certs:auto:refresh --app arrow-weight-calculator
   ```

## Alternative: Quick Fix (Use www Only)

If you want to get the site working NOW without Cloudflare:

1. **Set up Domain Forwarding in GoDaddy:**
   - In GoDaddy, find "Domain Forwarding" or "Redirects"
   - Forward `arrowweight.com` → `https://www.arrowweight.com`
   - This way www.arrowweight.com works, and root domain redirects to www

2. **Test www.arrowweight.com:**
   - It should work once DNS propagates
   - The root domain will redirect to www

## Summary

**Recommended:** Use Cloudflare (takes 1-2 hours but gives you full control)

**Quick Fix:** Set up domain forwarding in GoDaddy to redirect root → www

Both solutions will work! Cloudflare is better long-term, forwarding is faster short-term.

