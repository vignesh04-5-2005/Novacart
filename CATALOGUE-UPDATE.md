# NovaCart 70-product catalogue update

## What's included
- A 70-item catalogue across Mobiles, Laptops & Computers, Audio & Electronics, Watches & Wearables, Shoes & Footwear, Clothing & Fashion, Home & Kitchen, and Accessories.
- Updated MongoDB seeder that inserts missing products and refreshes image URLs for matching existing product names.
- Existing product stock is not overwritten by the seeder; existing users, carts, and orders are not intentionally modified.
- Product cards now have consistent image sizing, lazy loading, a local fallback image, accessible wishlist controls, and stock-aware Add to Cart buttons.
- Product listing now supports search, category filtering, sorting, and pagination.

## Important image note
Product photos use the Unsplash image CDN and therefore require an internet connection in the browser. If a remote image fails, NovaCart shows the bundled local fallback graphic instead of a broken-image icon. The image CDN links could not be live-tested in this offline build environment; verify them in your browser before deployment.

## Apply the update safely
1. Back up your current project folder and MongoDB database first.
2. Extract this ZIP to a new folder. Do not overwrite your current working folder yet.
3. Copy your existing `server/.env` into the extracted `server` folder manually. It is intentionally not included in this ZIP.
4. In a terminal, open the extracted `server` folder and run `npm install` if needed.
5. Run `npm run seed` once. This adds the missing catalogue items and refreshes matching image URLs. It does not delete products.
6. Start the backend with `npm run dev`.
7. In a second terminal, open `client`, run `npm install` if needed, then `npm run dev`.
8. Open `/products`; test search, category filter, sorting, pagination, and product images.

## Safety
- This update ZIP excludes `.env` files and `node_modules`.
- Do not upload your MongoDB URI, JWT secret, or real credentials to GitHub.
- The seed operation is designed to be repeatable. It preserves stock for existing product names and initializes stock for newly inserted products.
