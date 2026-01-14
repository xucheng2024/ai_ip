# Supabase URL Configuration Guide

## Current Configuration Issues

Your current setup has:
- ✅ Site URL: `https://ai-ip.vercel.app` (Production)
- ✅ Redirect URLs include both localhost and production

## Recommended Configuration

### Option 1: Keep Production as Site URL (Recommended)

**Site URL:**
```
https://ai-ip.vercel.app
```

**Redirect URLs (add all of these):**
```
http://localhost:3000/api/auth/callback
http://localhost:3000/**
https://ai-ip.vercel.app/api/auth/callback
https://ai-ip.vercel.app/**
```

### Option 2: Use Localhost for Development (Alternative)

If you're primarily developing locally:

**Site URL:**
```
http://localhost:3000
```

**Redirect URLs:**
```
http://localhost:3000/api/auth/callback
http://localhost:3000/**
https://ai-ip.vercel.app/api/auth/callback
https://ai-ip.vercel.app/**
```

## Why This Matters

- **Site URL**: Used as default redirect when no specific redirect URL matches
- **Redirect URLs**: Whitelist of allowed redirect destinations
- **Wildcards (`**`)**: Allow any path under that domain

## Quick Fix

Add these Redirect URLs to your current configuration:

1. `http://localhost:3000/**` (allows any localhost path)
2. `https://ai-ip.vercel.app/**` (allows any production path)

This ensures both development and production work correctly.
