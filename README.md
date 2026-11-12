# React + Vite

## Admin API integration

The admin screens use the API documented at `/api/openapi.json`. In Vite
development, `/api` is proxied to `http://192.168.0.101:18080` by default; set
`VITE_API_PROXY_TARGET` to use another backend. For production, either serve
the frontend and API on the same origin or set `VITE_API_BASE_URL` to a
cross-origin API that allows the frontend origin through its CORS policy.

Jobs, customers, and driver identity screens use live API data. Driver
recruitment has a dedicated review workspace for application decisions, private
document handling, audit history, and recruitment policies; it does not display
API endpoint URLs. Admin pages show task-oriented forms and results instead of
technical request details. Zones and commercial configuration use the live
service schema internally to keep their forms aligned with the backend.
Fleet, charger, pairing, RBAC, and legacy pricing screens remain available
from their existing routes.

Mutations are submitted only after explicit confirmation. The workspace adds
required idempotency keys, requires the current `If-Match` value for
versioned changes, and leaves authorization decisions to the server. Driver
self-service recruitment routes (API group 31) require a driver-authorized
session; Admin recruitment operations are in group 32.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
