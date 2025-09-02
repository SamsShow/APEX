# Deployment Troubleshooting Guide

## Function Runtime Issues

### Error: Function Runtimes must have a valid version, for example `now-php@1.0.0`.

**Symptoms:**

- Vercel deployment fails with runtime version error
- Functions configuration causing deployment issues
- Build succeeds locally but fails on Vercel

**Root Causes:**

1. **Incorrect Runtime Specification**: Missing version number in runtime configuration
2. **Unnecessary Function Configuration**: Next.js handles API routes automatically
3. **Outdated Runtime Syntax**: Using deprecated runtime format

**Solutions:**

#### 1. Remove Unnecessary Functions Configuration

```json
// ❌ DON'T DO THIS - Causes runtime errors
{
  "functions": {
    "apps/web/src/app/api/**/*.ts": {
      "runtime": "@vercel/node"  // Missing version!
    }
  }
}

// ✅ DO THIS - Let Next.js handle API routes automatically
{
  "buildCommand": "cd ../.. && pnpm build",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs"
}
```

#### 2. If Custom Runtime is Required

```json
// Only use this if you need custom runtime configuration
{
  "functions": {
    "apps/web/src/app/api/**/*.ts": {
      "runtime": "@vercel/node@18" // Include version number
    }
  }
}
```

**Prevention:**

- Next.js App Router handles API routes automatically
- Only specify custom runtimes when absolutely necessary
- Test deployments after configuration changes

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

## Routes Manifest Issues

### Error: The file "/vercel/path0/apps/web/apps/web/.next/routes-manifest.json" couldn't be found

**Symptoms:**

- Vercel deployment fails with routes-manifest.json not found
- Build succeeds locally but fails on Vercel
- Double path issues (apps/web/apps/web/) in error messages
- Monorepo build output path confusion

**Root Causes:**

1. **Turbo Configuration Mismatch**: `turbo.json` outputs don't include `.next/**`
2. **Build Cache Conflicts**: Stale cache preventing proper file generation
3. **Monorepo Path Resolution**: Incorrect path mapping in Vercel

**Solutions:**

#### 1. Fix Turbo Build Outputs

```json
// turbo.json - Include Next.js build outputs
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    }
  }
}
```

#### 2. Clean Build Cache

```bash
# Remove stale cache and rebuild
rm -rf apps/web/.next
rm -rf node_modules/.cache
pnpm build
```

#### 3. Verify Build Outputs

```bash
# Check that required files exist
ls -la apps/web/.next/routes-manifest.json
ls -la apps/web/.next/server/
```

#### 4. Fix Vercel Double Path Issue (Alternative)

```json
// vercel.json - Alternative configuration for double path issues
{
  "buildCommand": "cd ../.. && pnpm build --filter=web",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "cd ../.. && pnpm install"
}
```

```bash
# .vercelignore - Prevent monorepo file conflicts
# Ignore monorepo files
../**
../../**

# Keep only the web app files
!src/**
!public/**
!package.json
!next.config.mjs
```

**Prevention:**

- Ensure turbo.json includes all build outputs
- Clean cache before deployments
- Use filtered builds (`--filter=web`) for monorepos
- Set outputDirectory to `.next` (not `apps/web/.next`) in Vercel
- Add .vercelignore to prevent path conflicts
- Verify build outputs exist locally before pushing
- Keep monorepo path configurations consistent
