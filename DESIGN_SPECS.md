# AZZRO - Phase 1: UI/UX Design Specifications & Structure
*Reference Pattern: Myntra Fashion | Aesthetic: Premium, Modern, Glassmorphism*

## 1. Design System Core
- **Typography**: `Outfit` (Headings) + `Inter` (Body). Clean, readable, modern.
- **Color Palette**: 
  - **Primary**: Deep Jet Black (`#1A1A1A`) & Pure White (`#FFFFFF`) for canvas.
  - **Accent**: Vibrant Coral/Rose (`#FF3F6C` - Myntra nod) or Electric Blue for main CTAs.
  - **Status**: Success Green, Error Red, Warning Yellow.
- **Visuals**:
  - Soft drop shadows (Elevation).
  - **Glassmorphism**: Subtle usage on sticky headers, floating carts, and modal overlays.
  - Rounded Corners: `12px` for cards, `8px` for buttons.

## 2. Public Pages Structure (Wireframe Specs)

### A. Homepage
- **Header**: Sticky. Logo Left. Mega-search bar Center. Icons (Profile, Wishlist, Bag) Right.
- **Hero Section**: Full-width active slider with premium lifestyle imagery. Glass-overlay text.
- **Stories/Categories**: Circular avatars row (similar to Myntra/Instagram stories) – "Men", "Women", "Sneakers".
- **Deals Section**: Countdown timer + Horizontal scroll of cards.
- **Curated Collections**: Masonry grid layout for "Trending Now" or "Season Specials".

### B. Category / Product Listing Page (PLP)
- **Layout**: Two-column. Left Sidebar (Fixed/Sticky) + Right Content Grid.
- **Sidebar**: 
  - Accordion filters: Brand, Price (Range Slider), Discount %, Color (Swatches), Size.
- **Top Bar**: Breadcrumbs | "Sort By" Dropdown | View Toggle (Desktop/Mobile).
- **Grid**: 4-column (Desktop), 2-column (Mobile).
- **Product Card**: 
  - Leading Image (Hover -> Swap Image).
  - Brand Name (Bold, Uppercase).
  - Title (Truncated).
  - Price (Current + Strikethrough).
  - "Add to Wishlist" heart icon floating top-right.

### C. Product Detail Page (PDP)
- **Layout**: Split screen. 
  - **Left**: Grid of 4-5 high-res images. Sticky scroll.
  - **Right**: Details Panel.
- **Key Elements**:
  - Brand & Title.
  - Ratings chip (Star icon).
  - Price (Large) + Tax info.
  - **Size Selector**: Circular buttons. "Size Chart" link.
  - **Primary CTA**: "Add to Bag" (Full width or prominent).
  - **Delivery**: Pincode checker input field.
  - **Info**: Accordions for "Product Details", "Material", "Care".
- **Bottom**: "Similar Products" carousel.

### D. Cart & Checkout
- **Cart**: Two-column. Left: List of items. Right: Price Details (Bill summary).
- **Checkout**: 3-Step Stepper.
  1. Login/Guest Email.
  2. Address (Select/Add New).
  3. Payment (COD, UPI, Card).

### E. Authentication
- **Login/Register**: Minimalist Card centered on blurred background. 
- Mobile Number / Email input -> OTP flow preferred.

## 3. Dashboards Structure

### F. Vendor Dashboard
- **Sidebar Navigation**: Dashboard, Products, Orders, Payments, Profile.
- **Main Area**: 
  - Summary Cards (Total Sales, Active Products).
  - Recent Orders Table.
  - "Add New Product" Wizard.

### G. Admin Dashboard
- **Overview**: Global Platform Stats (GMV, Total Vendors, Total Users).
- **Controls**: Vendor Approval Queue, Commission settings, User Management.

### H. Customer Account
- **Tabs**: Orders , Returns, Wishlist, Saved Addresses, Profile Info.
