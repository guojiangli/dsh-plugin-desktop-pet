# Security Policy

## Supported versions

Security fixes are provided for the latest published version.

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability. Use GitHub's **Private vulnerability reporting** for this repository:

`https://github.com/guojiangli/dsh-plugin-desktop-pet/security/advisories/new`

Include the affected version, reproduction steps, impact, and any suggested mitigation. You should receive an initial response within seven days.

## Data boundary

The plugin has no server endpoint. Pet configuration and uploaded images are stored in the current browser's `localStorage`. Uploaded images are not sent to DSH or any third-party service by this plugin.
