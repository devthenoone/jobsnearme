# Deployment guide — JobsNearMe

This app is a **Next.js (Node) server** with a **SQLite** database file on disk. That
one fact drives every hosting choice below.

## ⚠️ Read this first: where you can (and can't) host it

The database is a file at `data/app.db`. It must live on **persistent disk** and the
app must run as a **long-lived Node server** (not serverless functions).

| Host | Works? | Why |
|------|--------|-----|
| **VPS** (DigitalOcean, Hetzner, Linode, AWS EC2, any Ubuntu box) | ✅ Best | Full control, persistent disk |
| **Railway / Render / Fly.io** (with a persistent volume) | ✅ Good | Easy, but you MUST attach a volume mounted at `/app/data` |
| **Vercel / Netlify / Cloudflare** | ❌ No | Serverless = read-only, ephemeral filesystem. SQLite writes are lost / fail. |

> If you ever want Vercel-style hosting, the database has to move to a hosted DB
> (Postgres/Turso/PlanetScale). That's a bigger change — ask and I'll do it.

---

## Option A — VPS (Ubuntu) with PM2 + Nginx  *(recommended)*

### 1. Server prerequisites
```bash
# On the server (Ubuntu 22.04+):
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -   # Node 20
sudo apt-get install -y nodejs build-essential   # build-essential = native module compiler
sudo npm install -g pm2
```

### 2. Get the code onto the server
```bash
# via git:
git clone <your-repo-url> jobsnearme && cd jobsnearme
# or copy the folder up with scp/rsync (exclude node_modules and .next).
```

### 3. Configure environment
```bash
cp .env.example .env.local
nano .env.local
```
Set at minimum:
- `AUTH_SECRET` — generate: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
- `NEXT_PUBLIC_SHOW_KEYWORD_PREVIEW=false` (hide the preview block in production)

### 4. Install, build, create your admin, start
```bash
npm ci
npm run build
node scripts/create-user.mjs you@your-domain.com "a-strong-password" "Your Name"
pm2 start ecosystem.config.js
pm2 save
pm2 startup    # run the command it prints, so the app restarts on reboot
```
The app is now running on `http://127.0.0.1:3000`.

### 5. Put Nginx + HTTPS in front
```bash
sudo apt-get install -y nginx
sudo nano /etc/nginx/sites-available/jobsnearme
```
Paste:
```nginx
server {
    server_name your-domain.com www.your-domain.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```
```bash
sudo ln -s /etc/nginx/sites-available/jobsnearme /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Free HTTPS certificate:
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```
Point your domain's DNS **A record** at the server's IP first.

### 6. Updating later
```bash
git pull            # or re-upload files
npm ci
npm run build
pm2 restart jobsnearme
```

### Backups (important — your content lives in one file)
```bash
# Back up the database regularly:
cp data/app.db ~/backups/app-$(date +%F).db
```

---

## Option B — Docker (VPS, Railway, Render, Fly.io)

A `Dockerfile` and `.dockerignore` are included. **Persist `/app/data`** with a volume.

```bash
docker build -t jobsnearme .
docker run -d --name jobsnearme -p 3000:3000 \
  -e AUTH_SECRET="$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")" \
  -e NEXT_PUBLIC_SITE_URL="https://your-domain.com" \
  -e NEXT_PUBLIC_SHOW_KEYWORD_PREVIEW="false" \
  -v jobsnearme_data:/app/data \
  jobsnearme

# Create your admin account inside the container:
docker exec -it jobsnearme node scripts/create-user.mjs you@your-domain.com "a-strong-password" "Your Name"
```
On Railway/Render/Fly: deploy the Dockerfile and attach a **persistent volume mounted at
`/app/data`**, then set the same env vars in their dashboard.

> Note: `NEXT_PUBLIC_*` values are baked in at **build** time. If you set them via the
> dashboard/DB instead, that's fine — the admin **Settings** page writes the AdSense keys
> to the database at runtime, so you don't need to rebuild to change them.

---

## Post-deploy checklist

- [ ] Site loads over **HTTPS** at your domain
- [ ] `AUTH_SECRET` is a long random value (NOT the dev placeholder)
- [ ] You created an admin account and can log in at **/admin**
- [ ] `NEXT_PUBLIC_SHOW_KEYWORD_PREVIEW=false` (only the live AdSense unit shows)
- [ ] Added your AdSense **Publisher ID + Style ID** in **/dashboard/settings**
- [ ] A **backup** of `data/app.db` is scheduled
- [ ] Rotated any API keys that were shared during development

## Managing accounts (sign-up is disabled)
```bash
node scripts/create-user.mjs <email> <password> "<Name>"   # create or reset an account
```
