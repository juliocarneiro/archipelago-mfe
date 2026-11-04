## What changes

<!-- One or two sentences. -->

## Which islands are affected

- [ ] shell
- [ ] catalog
- [ ] cart
- [ ] packages (contracts / ui / mf-config) — affects every MFE

## Contract checklist

- [ ] No exposed module (`exposes`) was removed or renamed
- [ ] No event in `MfeEventMap` lost or renamed a field (add a new versioned event instead)
- [ ] Shared dependency versions still match across apps
- [ ] The MFE still runs standalone (`pnpm --filter @mfe/<app> dev`)
