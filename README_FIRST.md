# SokoYetu Mtaani Visible Name Fix

Use this after the first branding pack if the browser still shows **SokoYetu Mtaani** in the header.

Your previous script ran correctly, but the visible logo/header likely used the exact text **SokoYetu Mtaani**, which was not fully replaced in the first pack. This fix updates remaining visible text to:

**SokoYetu Mtaani**

## How to use

1. Unzip this ZIP.
2. Copy these files into:

   `C:\Users\PC\Desktop\SokoYetu Mtaani-fullstack\SokoYetu Mtaani-elite-checked-fixed`

3. Open CMD and run:

   ```bat
   cd C:\Users\PC\Desktop\SokoYetu Mtaani-fullstack\SokoYetu Mtaani-elite-checked-fixed
   fix-visible-SokoYetu Mtaani-name.cmd
   ```

4. Start the site again:

   ```bat
   npm run dev
   ```

5. Open:

   `http://localhost:5173/`

6. Press:

   `Ctrl + F5`

This forces a hard refresh so the browser does not keep the old page from cache.

## Then deploy to Render

After confirming it works locally:

```bat
git add .
git commit -m "Fix visible SokoYetu Mtaani branding"
git push
```

## What this script changes

It replaces remaining visible brand text such as:

- `SokoYetu Mtaani`
- `Sell on SokoYetu Mtaani`
- `WhatsApp SokoYetu Mtaani`
- `SokoYetu Mtaani`

with:

- `SokoYetu Mtaani`

It skips:

- `node_modules`
- `.git`
- build folders
- backup files
