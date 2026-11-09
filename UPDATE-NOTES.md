# NovaCart update notes

## Changes in this update

- Cart add/update endpoints validate product IDs and positive whole-number quantities.
- Cart endpoints reject quantities above current product stock.
- Cart reads remove stale entries for products that were deleted.
- Order creation validates the required Indian shipping address fields, including a 10-digit phone number and 6-digit postal code.
- Order totals and item prices are calculated on the server from database product records, not trusted from the browser.
- Stock is decremented with atomic conditional database updates when an order is placed. If an item is unavailable, the order is rejected and any earlier stock deductions in that request are rolled back.
- Stock deductions are restored if order document creation fails.
- Online payment is explicitly unavailable until a payment gateway and verified payment callback are integrated. Checkout marks that option as coming soon.
- Cart quantity increment is disabled in the UI when the available stock limit is reached.

## Setup

1. Copy `server/.env.example` to `server/.env` and fill in your MongoDB URI and a long random JWT secret (at least 32 characters).
2. Copy `client/.env.example` to `client/.env` if your backend is not running at `http://localhost:5000`; set `VITE_API_URL` to the backend origin only, without `/api`.
3. In `server`, run `npm install` and then `npm run dev`.
4. In `client`, run `npm install` and then `npm run dev`.

## Verification note

All backend JavaScript files passed `node --check`. A full frontend build, lint run, and live MongoDB checkout test have not been run in this environment. Test with a development database before deploying. The stock update sequence uses atomic conditional updates per product; for stronger all-or-nothing guarantees across multiple products, deploy MongoDB as a replica set and move checkout into a database transaction.
