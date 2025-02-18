# CartPage Component Documentation

## Table of Contents

* [1. Overview](#1-overview)
* [2. Component Structure](#2-component-structure)
* [3. Data Fetching and Initialization (`useEffect` Hook)](#3-data-fetching-and-initialization-useeffect-hook)
* [4. Cart Item Quantity Update (`handleUpdateQuantity` Function)](#4-cart-item-quantity-update-handleupdatequantity-function)
* [5. Cart Item Removal (`handleRemoveItem` Function)](#5-cart-item-removal-handleremoveitem-function)
* [6. Removing Selected Items (`handleDeleteSelected` Function)](#6-removing-selected-items-handledeleteselected-function)
* [7. Placing an Order (`handlePlaceOrder` Function)](#7-placing-an-order-handleplaceorder-function)
* [8. Order Summary Calculation](#8-order-summary-calculation)


## 1. Overview

The `CartPage` component displays the user's shopping cart, allowing them to manage items, update quantities, remove items, and place orders.  It integrates with the `useAuthStore` for authentication and `useCartStore` for cart management.  The component handles loading states, displays appropriate messages for empty carts or unauthenticated users, and provides visual feedback using `react-hot-toast` for successful or failed operations.


## 2. Component Structure

The `CartPage` component utilizes several other components:

| Component          | Purpose                                         |
|----------------------|-------------------------------------------------|
| `Navbar`            | Displays the navigation bar.                     |
| `Footer`            | Displays the footer.                           |
| `Button`            | Custom button component.                         |
| `Checkbox`          | Custom checkbox component.                       |
| `Card`, `CardContent` | Custom card components for styling.              |
| `CheckCircle`, `Minus`, `Plus`, `Trash2` | Lucide-react icons.                         |
| `CustomModal`       | A custom modal for displaying order confirmation. |
| `Separator`         | A visual separator component.                   |
| `Loader`            | A loading indicator component.                   |


The main layout consists of a cart section and an order summary section, arranged side-by-side on larger screens.


## 3. Data Fetching and Initialization (`useEffect` Hook)

The `useEffect` hook fetches cart items upon mounting and when the authentication status changes.

* **Authentication Check:** It first calls `checkAuth()` to determine if the user is logged in.
* **Cart Item Fetching:** If authenticated, it calls `fetchCartItems()` from the `/api/cart` module to retrieve the cart items from the backend.
* **Data Formatting:** The fetched data is then transformed into a consistent format, mapping the received items to include `id`, `menuId`, `name`, `price`, `quantity`, and `image`.  If the fetched `cartItems` is not an array, an empty array is used.
* **State Update:** The formatted cart items are passed to `setItems` to update the cart store.
* **Error Handling:**  `try...catch` block handles potential errors during the API call, displaying error messages using `react-hot-toast`.
* **Loading State:** `setLoading(true)` before the API call and `setLoading(false)` afterwards, indicating the loading status to the UI.


## 4. Cart Item Quantity Update (`handleUpdateQuantity` Function)

This function updates the quantity of a cart item.

* **Input Validation:** It checks if `newQuantity` is less than 1; if so, it prevents the update.
* **API Call:** It calls `updateCartQuantity(itemId, newQuantity)` to update the cart quantity on the server.
* **Local State Update:** It updates the local cart state using `updateQuantity(itemId, newQuantity)`.
* **Feedback:** It provides feedback to the user using `toast.success`.
* **Error Handling:** `try...catch` block handles potential errors during the API call, displaying error messages using `react-hot-toast`.


## 5. Cart Item Removal (`handleRemoveItem` Function)

This function removes a cart item.

* **API Call:** It calls `removeCartItem(cartItemId)` to remove the item from the server.
* **Local State Update:**  It filters the `items` array to remove the item with the matching `cartItemId`, updating the local state.
* **Feedback:** It provides feedback using `toast.success`.
* **Error Handling:**  `try...catch` block handles API errors, displaying error messages using `react-hot-toast`.


## 6. Removing Selected Items (`handleDeleteSelected` Function)

This function removes all selected items from the cart.

* **API Call:** It calls `clearCart()` to clear the cart on the server.
* **Local State Update:** It filters the `items` array, keeping only items whose `id` is not in the `selectedItems` Set, updating the local state.
* **Feedback:** It provides feedback using `toast.success`.
* **Error Handling:** `try...catch` block handles API errors, displaying error messages using `react-hot-toast`.


## 7. Placing an Order (`handlePlaceOrder` Function)

This function places an order for selected items.

* **Loading State:** Sets loading state to `true`.
* **Filter Selected Items:** It filters the `items` array to get only the selected items.
* **Format Order Items:** It maps the selected items into a format suitable for the API call (`menuItemId` and `quantity`).
* **API Call:** It calls `order(orderItems)` to place the order on the server.
* **Response Handling:** It checks the API response for errors.  If the response is invalid or doesn't contain order data, it throws an error.
* **Modal Display:** If successful, it updates `orderDetails` with the received order data and opens the confirmation modal.
* **Feedback:**  Uses `react-hot-toast` to display error messages.
* **Loading State Reset:**  Resets the loading state to `false` in a `finally` block, ensuring that the loading indicator is always hidden after the API call completes, regardless of success or failure.


## 8. Order Summary Calculation

The order summary calculates the subtotal and total price based on the selected items.  It iterates through the `selectedItems` Set, finds the corresponding items in the `items` array, and calculates the price for each item.  It then sums these prices to obtain the subtotal and adds the shipping fee to arrive at the total.  The calculation is done multiple times within the component to update the display accordingly.  While this is functional, it could be optimized by performing these calculations once and storing the result in the component's state to avoid redundant calculations.
