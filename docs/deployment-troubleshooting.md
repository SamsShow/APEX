# Deployment Troubleshooting Guide

## Client Reference Manifest Issues

### Error: ENOENT: no such file or directory, lstat '/vercel/path0/apps/web/.next/server/app/(app)/page_client-reference-manifest.js'

**Symptoms:**

- Build succeeds locally but fails on Vercel
- Missing client reference manifest files
- 404 errors on Next.js App Router pages

**Root Causes:**

1. **Next.js Configuration Conflicts**: `output: 'standalone'` in `next.config.mjs` conflicts with Vercel deployments
2. **Build Cache Issues**: Stale build cache causing incomplete builds
3. **Turbo Monorepo Configuration**: Incorrect build output paths in `turbo.json`

**Solutions:**

#### 1. Fix Next.js Configuration

```javascript
// next.config.mjs - Remove problematic settings for Vercel
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  transpilePackages: ['framer-motion'],
  // Remove: output: 'standalone'
  // Remove: typescript: { ignoreBuildErrors: true }
  // Remove: eslint: { ignoreDuringBuilds: true }
};
```

#### 2. Clean Build Cache

```bash
# Local cleanup
rm -rf apps/web/.next
rm -rf node_modules/.cache
pnpm build

# Vercel deployment
# Trigger redeploy after pushing changes
```

#### 3. Update Turbo Configuration

```json
// turbo.json - Ensure correct output paths
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```

#### 4. Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "cd ../.. && pnpm build",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs"
}
```

**Prevention:**

- Always test builds locally before deployment
- Keep Next.js configuration minimal for Vercel
- Use Vercel's deployment dashboard to monitor build logs
- Consider using build hooks for cleanup

## Build Warnings

### Spline Viewer Critical Dependencies

```
Critical dependency: require function is used in a way in which dependencies cannot be statically extracted
```

**Solution:** This is a known issue with @splinetool packages. Add to `next.config.mjs`:

```javascript
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@splinetool/react-spline', '@splinetool/runtime'],
  },
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],
};
```

### React Hook Dependency Warnings

```
React Hook useCallback has a missing dependency
```

**Solution:** Add missing dependencies to useCallback/useEffect dependency arrays or use ESLint disable comments for intentionally omitted dependencies.

## API Route Issues

### API Routes Not Working on Vercel

- Ensure API routes are in `src/app/api/` directory
- Use Vercel functions configuration for custom runtimes
- Check that build output includes API routes

## Environment Variables

### Missing Environment Variables

- Set environment variables in Vercel dashboard
- Use `.env.local` for local development
- Ensure sensitive keys are properly configured

## Performance Issues

### Large Bundle Sizes

- Use dynamic imports for heavy components
- Implement code splitting
- Optimize images and assets
- Use Next.js built-in optimization features

## Common Commands

```bash
# Clean and rebuild
rm -rf apps/web/.next && pnpm build

# Check build output
ls -la apps/web/.next/server/app/

# Test API routes locally
pnpm dev

# Check for TypeScript errors
pnpm build 2>&1 | grep -i error
```

## Monitoring

- Use Vercel's deployment dashboard to monitor build logs
- Check browser console for runtime errors
- Monitor Core Web Vitals in Vercel analytics
- Set up error tracking with services like Sentry
