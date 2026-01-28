# 🎯 Promo Banner Admin Guide

## 📝 Step-by-Step: Creating a New Banner

### 1. Access Admin Panel
```
http://localhost:3000/admin/promo-banners
```

### 2. Click "Add New Banner" Button

### 3. Fill in the Form

#### Example 1: iPhone Banner (Large)
```
Title: UP TO 30% OFF
Subtitle: Apple iPhone 14 Plus
Description: iPhone 14 has the same superspeedy chip that's in iPhone 13 Pro, A15 Bionic, with a 5‑core GPU, powers all the latest features.
Discount: 30% OFF
Button Text: Buy Now
Button Link: /shop-with-sidebar

Background Color: #F5F5F7
Text Color: #000000
Button Color: #3B82F6

Image: /images/promo/promo-01.png
Image Position: right
Size: large

Priority: 10
Start Date: [Current date/time]
End Date: [Leave empty for no expiry]
```

#### Example 2: Treadmill Banner (Small)
```
Title: Workout At Home
Subtitle: Foldable Motorised Treadmill
Discount: Flat 20% off
Button Text: Grab Now
Button Link: /shop-with-sidebar

Background Color: #DBF4F3
Text Color: #000000
Button Color: #14B8A6

Image: /images/promo/promo-02.png
Image Position: left
Size: small

Priority: 8
Start Date: [Current date/time]
```

#### Example 3: Apple Watch Banner (Small)
```
Title: Up to 40% off
Subtitle: Apple Watch Ultra
Description: The aerospace-grade titanium case strikes the perfect balance of everything.
Discount: 40% OFF
Button Text: Buy Now
Button Link: /shop-with-sidebar

Background Color: #FFECE1
Text Color: #000000
Button Color: #F97316

Image: /images/promo/promo-03.png
Image Position: right
Size: small

Priority: 6
Start Date: [Current date/time]
```

## 🎨 Design Tips

### Color Schemes
- **Light Theme**: Light background + dark text
- **Dark Theme**: Dark background + light text
- **Brand Colors**: Use your brand colors for buttons

### Image Guidelines
- **Large Banners**: 274x350px recommended
- **Small Banners**: 200x200px recommended
- **Format**: PNG, JPG, or WebP
- **Location**: Place in `/public/images/promo/` folder

### Layout Best Practices
- **Large Banners**: Use for featured promotions
- **Small Banners**: Use for secondary offers (2 per row)
- **Image Position**: 
  - Left: Text on right
  - Right: Text on left
  - Bottom: Text above image

## ⚙️ Advanced Features

### Priority System
- Higher numbers = Higher priority
- Banners sort by priority first, then creation date
- Use for controlling banner order

### Scheduling
- **Start Date**: Banner becomes active
- **End Date**: Banner automatically deactivates
- **No End Date**: Banner stays active indefinitely

### Active Status
- Toggle banners on/off without deleting
- Great for seasonal promotions
- Instant activation/deactivation

## 🚀 Managing Existing Banners

### Edit Banner
1. Click the **"Edit"** button on any banner
2. Modify any fields
3. Click **"Update Banner"**

### Toggle Active Status
1. Click **"Activate"** or **"Deactivate"** button
2. Changes take effect immediately on frontend

### Delete Banner
1. Click **"Delete"** button
2. Confirm deletion
3. Banner is permanently removed

## 🔄 Real-time Updates

- Changes appear instantly on homepage
- No need to refresh the page
- Caching updates automatically
- Admin panel shows live data

## 📱 Responsive Design

- Banners automatically adapt to screen size
- Mobile-optimized layouts
- Touch-friendly buttons
- Optimized image loading
