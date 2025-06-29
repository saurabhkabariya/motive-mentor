# Ad Implementation Guide for MotiveMentor

## Overview
This document explains how ads are implemented throughout the MotiveMentor website. We've created a robust ad system that maximizes CPM while maintaining good user experience and ensuring responsive design across all devices.

## Ad Components

### Main Components

1. **AdManager** (`/components/AdManager.js`)
   - Central component that handles loading the ad script only once
   - Uses MutationObserver to detect when new ad containers are added to the DOM
   - Should be included in the main layout.js file

2. **PageAd** (`/components/PageAd.js`)
   - Page-specific ad component with customizable placement
   - Creates containers with unique IDs to avoid conflicts
   - Usage: `<PageAd pageId="pageName" position="position" />`
   - Positions: "top", "middle", "bottom", or custom

3. **BottomAdContainer** (`/components/BottomAdContainer.js`)
   - Global component that adds an ad container before the footer
   - Included in the main layout.js file

### Legacy Components (For Reference)

1. **AdBanner** (`/components/AdBanner.js`)
   - Main wrapper component that uses StaticAdBanner
   - Now updated to create unique IDs for containers

2. **StaticAdBanner** (`/components/StaticAdBanner.js`)
   - Basic component that creates a container with the ad code
   - Updated to support custom IDs

3. **GlobalAdScript** (`/components/GlobalAdScript.js`)
   - Adds the ad script globally to the document head
   - Now replaced by AdManager

## Implementation Instructions

### How to Add Ads to a Page

1. **Import the PageAd component**:
   ```javascript
   import PageAd from "@/components/PageAd";
   ```

2. **Add the ad to the page with a unique pageId and position**:
   ```javascript
   <PageAd pageId="uniquePageName" position="top" />
   <PageAd pageId="uniquePageName" position="middle" />
   <PageAd pageId="uniquePageName" position="bottom" />
   ```

3. **Custom styling (optional)**:
   ```javascript
   <PageAd 
     pageId="uniquePageName" 
     position="custom" 
     style={{ 
       margin: '30px auto',
       backgroundColor: '#f0f0f0'
     }} 
   />
   ```

### Best Practices

1. **Use Unique IDs**: Always use unique pageId and position combinations to avoid conflicts.

2. **Limit Ads Per Page**: For optimal user experience, limit to 3-4 ads per page.

3. **Strategic Placement**: 
   - Top: After the header/navigation
   - Middle: Between content sections
   - Bottom: Before the footer

4. **Performance**: The AdManager component ensures the ad script is loaded only once.

5. **Responsive Design**: All ad containers are responsive by default.

## Troubleshooting

1. **Ads Not Showing**:
   - Ensure AdManager is included in layout.js
   - Check browser console for errors
   - Verify that container IDs are unique

2. **Multiple Script Loading**:
   - Use AdManager instead of directly including the script tag
   - Remove any duplicate script tags from layout.js

3. **Ad Conflicts**:
   - Ensure each PageAd has a unique combination of pageId and position
   - Use the AdManager component to centrally manage ad loading

## Testing Ad Implementation

1. Verify ads appear correctly on all pages
2. Test on various screen sizes to ensure responsive behavior
3. Check browser console for any errors related to ads
4. Verify that the ad script is loaded only once per page view

## Ad Provider Information

- Provider: profitableratecpm.com
- Ad Code:
  ```html
  <script async="async" data-cfasync="false" src="//pl26881565.profitableratecpm.com/c15e52fecd46f66a1527e583531cbb4a/invoke.js"></script>
  <div id="container-c15e52fecd46f66a1527e583531cbb4a"></div>
  ```

- For any provider-specific issues, contact their support team
