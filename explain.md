# React Hook Form Key Concepts

### `useForm`

useForm is the primary hook and the "brain" of your entire form. When you call it, you are initializing a new form instance and getting back an object full of methods and state variables to manage that form.

You are calling useForm() and destructuring four key pieces from it:

### `register`

This is a function you use to "register" your inputs (like `<Input />` and `<Select />`) with `react-hook-form`.

### What `register("name")` does

When you call the `register` function with a field name (like `"name"`, `"email"`, or `"password"`), it does two things:

1.  It tells `react-hook-form`, "Track a field named 'name'."
2.  It returns an object containing all the props needed to control that input.

### `handleSubmit`

This is a crucial wrapper function. You pass your own `onSubmit` function to it.

When the form is submitted, `handleSubmit` first runs your validation (using the `resolver`).

- **If validation fails:** It stops and automatically populates the `errors` object.
- **If validation succeeds:** It calls your `onSubmit` function (the one you defined) and passes it the clean, validated form data.

### `formState: { errors }`

This is an object that contains real-time information about the form's state. You are specifically pulling out (destructuring) the `errors` object.

If your `zodResolver` (or other resolver) finds any validation errors, this `errors` object will be populated with messages from your schema.

### `resolver`

The `resolver` is an option you pass to `useForm` to integrate an external validation library (like Zod, Yup, or Joi).

---

# 🚀 Mastering Server-Side Pagination in Next.js

Pagination isn't just about making the UI look good—it's a critical performance optimization for your database. Here is the exact blueprint we use to build professional, URL-driven pagination using Next.js App Router and Drizzle ORM.

## 🧠 1. The Core Concept: URL as State

In modern Next.js, **we don't use `useState` for pagination.** Instead, the URL is our single source of truth (e.g., `?search=React&page=2`).

- **Why?** It makes pages shareable, bookmarkable, and SEO-friendly.
- **How?** When the user clicks a page number, it's just a standard `<a>` link. The browser updates the URL, and Next.js automatically re-runs the Server Component to fetch the fresh data.

## 🧮 2. The Golden Math Formulas

Before touching the database, you need to calculate three things based on the URL's `?page=` parameter:

- **`LIMIT` (Items Per Page):** How many cards do we want to show? (e.g., `9`).
- **`OFFSET` (Items to Skip):** How many items do we bypass to get to the current page?
  - _Formula:_ `offset = (currentPage - 1) * LIMIT`
  - _Example:_ To view Page 2, we skip the first 9 items. `(2 - 1) * 9 = 9`.
- **`TOTAL PAGES`:** How many pages exist in total?
  - _Formula:_ `Math.ceil(totalCount / LIMIT)`
  - _Example:_ 20 jobs total ÷ 9 per page = 2.22. `Math.ceil` rounds this up to `3` total pages.

## 💾 3. The Database Engine (Drizzle ORM)

Real pagination always requires **two trips** to the database:

1. **The Data Query:** Fetch only the specific chunk of items for the current page.
   ```typescript
   .limit(LIMIT)
   .offset(offset)
   ```
   Gemini said
   This is going to be a fantastic resource for your students. Having a quick reference guide like this makes complex topics instantly digestible, especially when they are reviewing the code later.

Here is a perfectly formatted Markdown cheat sheet. You can copy and paste this directly into your GitHub README.md, or pull the bullet points straight into your presentation slides!

Markdown

# 🚀 Mastering Server-Side Pagination in Next.js

Pagination isn't just about making the UI look good—it's a critical performance optimization for your database. Here is the exact blueprint we use to build professional, URL-driven pagination using Next.js App Router and Drizzle ORM.

## 🧠 1. The Core Concept: URL as State

In modern Next.js, **we don't use `useState` for pagination.** Instead, the URL is our single source of truth (e.g., `?search=React&page=2`).

- **Why?** It makes pages shareable, bookmarkable, and SEO-friendly.
- **How?** When the user clicks a page number, it's just a standard `<a>` link. The browser updates the URL, and Next.js automatically re-runs the Server Component to fetch the fresh data.

## 🧮 2. The Golden Math Formulas

Before touching the database, you need to calculate three things based on the URL's `?page=` parameter:

- **`LIMIT` (Items Per Page):** How many cards do we want to show? (e.g., `9`).
- **`OFFSET` (Items to Skip):** How many items do we bypass to get to the current page?
  - _Formula:_ `offset = (currentPage - 1) * LIMIT`
  - _Example:_ To view Page 2, we skip the first 9 items. `(2 - 1) * 9 = 9`.
- **`TOTAL PAGES`:** How many pages exist in total?
  - _Formula:_ `Math.ceil(totalCount / LIMIT)`
  - _Example:_ 20 jobs total ÷ 9 per page = 2.22. `Math.ceil` rounds this up to `3` total pages.

## 💾 3. The Database Engine (Drizzle ORM)

Real pagination always requires **two trips** to the database:

1. **The Data Query:** Fetch only the specific chunk of items for the current page.

   ```typescript
   .limit(LIMIT)
   .offset(offset)
   ```

2. **The Count Query:** Count the total number of active items in the database. Without this, you cannot calculate the TOTAL PAGES for your UI.

```ts
.select({ count: sql<number>`count(*)` })
```

**Pro Tip:**
Always apply the **exact same filters** (like `search` or `job type`)
and **expiration checks** to both queries so your page math stays **100%
accurate**.

---

### 🎛️ 4. The UI: Building a "Sliding Window"

If you have **100 pages**, you don't want to render **100 buttons**.
Instead, create a **sliding window** of a maximum of **3 page numbers**.

Example:

    [Prev] 4 5 6 [Next]

**Start Page**

```js
Math.max(1, currentPage - 1);
```

**End Page**

```js
Math.min(totalPages, currentPage + 1);
```

**Edge Cases**

- If you are on **Page 1**, force the window to show **1, 2, and 3**.
- If you are on the **last page**, shift the window **backward**.

---

### 🔗 5. The Secret Sauce: Preserving Filters

When a user clicks **Page 2**, you must **not lose their active search
filters**.

Always rebuild the URL using `URLSearchParams` to combine:

- Existing filters
- The new page number

```js
// Copy existing filters and update the page number
const params = new URLSearchParams(existingParams);
params.set("page", pageNum.toString());

return `/jobs?${params.toString()}`;
```
