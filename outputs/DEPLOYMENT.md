# Deployment Guide - Base Exchange Pro

This guide covers multiple deployment options for **Base Exchange Pro** to https://baseexchangepro.xyz/

## Quick Start

The project is already built and ready to deploy. The production build is in the `dist/` directory.

```bash
npm run build  # Build for production
```

---

## Deployment Options

### Option 1: Netlify (Recommended for Ease)

**Steps:**
1. Push code to GitHub
2. Connect your GitHub repo to [Netlify](https://app.netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add custom domain: `baseexchangepro.xyz` in Netlify DNS settings
6. Enable automatic deployments on push

**Netlify Config:** `netlify.toml` is already configured

---

### Option 2: Vercel

**Steps:**
1. Connect your GitHub repo to [Vercel](https://vercel.com)
2. Vercel auto-detects Vite project
3. Set project name: `base-exchange-pro`
4. Build command: `npm run build` (auto-detected)
5. Output directory: `dist` (auto-detected)
6. Add custom domain: `baseexchangepro.xyz` in Vercel project settings
7. Update DNS pointing to Vercel nameservers

**Vercel Config:** `vercel.json` is already configured

---

### Option 3: Self-Hosted (SSH/SCP)

**Prerequisites:**
- VPS/Server with SSH access
- Web server (Nginx/Apache) configured

**Automated via GitHub Actions:**

1. Generate SSH key locally:
```bash
ssh-keygen -t ed25519 -f deploy_key -N ""
```

2. Add public key to your server `~/.ssh/authorized_keys`:
```bash
cat deploy_key.pub | ssh user@host 'cat >> ~/.ssh/authorized_keys'
```

3. Add GitHub Secrets:
   - `DEPLOY_KEY`: Content of `deploy_key` (private key)
   - `DEPLOY_HOST`: `user@your-server.com`
   - `DEPLOY_PATH`: `/var/www/baseexchangepro/` (or your web root)

4. Push to main branch → GitHub Actions auto-deploys to your server

**Workflow:** `.github/workflows/deploy.yml` is configured

---

### Option 4: GitHub Pages + Custom Domain

**Steps:**
1. Modify `.github/workflows/static.yml` to use `dist/` instead of `.`
2. Create `CNAME` file in root:
```
baseexchangepro.xyz
```
3. Update GitHub Pages settings:
   - Go to Settings → Pages
   - Source: GitHub Actions
   - Custom domain: `baseexchangepro.xyz`
4. Update DNS to point to GitHub Pages:
   - `CNAME`: `username.github.io`
   - or A records to GitHub's IP addresses

---

### Option 5: AWS S3 + CloudFront

**Steps:**
1. Create S3 bucket: `baseexchangepro.xyz`
2. Enable static website hosting
3. Request SSL cert from AWS Certificate Manager
4. Create CloudFront distribution
5. Add custom domain mapping

**Deploy:**
```bash
aws s3 sync dist/ s3://baseexchangepro.xyz/ --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

### Option 6: Docker + Any Host

**Create `Dockerfile`:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and push:
```bash
docker build -t baseexchangepro .
docker push your-registry/baseexchangepro
```

---

## DNS Configuration

After choosing a platform, point your domain to it:

**For Netlify:**
```
Type: CNAME or A Record
Name: @
Value: (provided by Netlify)
```

**For Vercel:**
```
Type: A Record
Name: @
Value: 76.76.19.19
```

**For custom server:**
```
Type: A Record
Name: @
Value: your-server-ip
```

---

## Environment Variables

If needed, create `.env.production`:
```
VITE_API_URL=https://api.baseexchangepro.xyz
VITE_NETWORK=base
```

---

## Post-Deployment Checklist

- [ ] SSL certificate active and valid
- [ ] All assets loading (check Network tab in DevTools)
- [ ] PWA manifest loading correctly
- [ ] Performance monitored (Lighthouse)
- [ ] Error logging configured (Sentry/etc)
- [ ] SEO metadata verified
- [ ] Mobile responsiveness tested
- [ ] Authentication flows working

---

## CI/CD Pipeline Status

The project includes automated workflows:
- **`deploy.yml`** — Builds on every push to main, deploys if credentials set
- **`node.js.yml`** — Runs linting and tests
- **`static.yml`** — GitHub Pages deployment template

---

## Support

For questions:
1. Check platform-specific docs (Netlify/Vercel/etc)
2. Verify DNS propagation: `nslookup baseexchangepro.xyz`
3. Monitor deployment logs in your platform's dashboard
4. Test locally: `npm run preview`