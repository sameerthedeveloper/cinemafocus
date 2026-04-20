# React Concepts from "Cinema Focus" Codebase

**Framework:** React 19 (Vite)
**Routing:** React Router v7
**Styling:** Tailwind CSS

---

## 1. Components & JSX
**What is it?**
Components are the building blocks of a React application. They are JavaScript functions that return JSX (JavaScript XML), which looks like HTML but is actually JavaScript.

**Why it's used?**
To break the UI into independent, reusable pieces.

**Example from `src/components/Section.jsx`**:
```javascript
// A reusable Section component that accepts 'children' and 'className' props
const Section = ({ children, className, id, container = true }) => {
  return (
    <section id={id} className={clsx("py-24", className)}>
      {container ? (
        <div className="container px-6 mx-auto">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  );
};
```
*Takeaway:* This pattern uses **Composition** (passing `children`) to create a consistent layout wrapper.

---

## 2. State (`useState`)
**What is it?**
`useState` is a Hook that lets you add React state to function components. It preserves values between renders.

**Why it's used?**
To handle dynamic data that changes over time (e.g., loading status, fetched data, form inputs).

**Example from `src/pages/admin/Dashboard.jsx`**:
```javascript
// 'stats' holds the array of data, 'setStats' updates it
const [stats, setStats] = useState([
  { label: "Total Products", value: "-", icon: Package },
  // ...
]);

// 'chartData' stores analytics data
const [chartData, setChartData] = useState([]);
```

---

## 3. Effects (`useEffect`)
**What is it?**
`useEffect` lets you perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.

**Why it's used?**
To fetch data from Firebase when the component mounts.

**Example from `src/pages/Gallery.jsx`**:
```javascript
useEffect(() => {
  const fetchProjects = async () => {
    try {
      // Async operation (side effect)
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      // ... process data
    } catch (error) {
      console.error(error);
    }
  };
  
  fetchProjects();
}, []); // Empty dependency array [] means this runs ONCE when component mounts
```

---

## 4. Routing (`react-router-dom`)
**What is it?**
A library for handling navigation in a React application. This project uses `BrowserRouter` (aliased as `Router`).

**Why it's used?**
To enable single-page application (SPA) navigation without refreshing the page.

**Example from `src/App.jsx`**:
```javascript
<Routes>
  {/* Public Route */}
  <Route path="/" element={<Home />} />
  
  {/* Nested Routes with Layout */}
  <Route element={<Layout />}>
    <Route path="/about" element={<About />} />
  </Route>

  {/* Admin Layout (Nested Routes) */}
  <Route path="/admin" element={<AdminLayout />}>
     <Route path="dashboard" element={<Dashboard />} />
  </Route>
</Routes>
```
*Note:* The `<Outlet />` component in `AdminLayout.jsx` renders the child route (e.g., `Dashboard`) inside the layout.

---

## 5. Protected Routes
**What is it?**
A pattern to restrict access to certain routes based on authentication status.

**Why it's used?**
To prevent unauthorized users from accessing the Admin panel.

**Example from `src/App.jsx` & `src/components/ProtectedRoute.jsx`**:
```javascript
<Route element={<ProtectedRoute />}>
  <Route path="/admin" element={<AdminLayout />}> ... </Route>
</Route>
```
*Concept:* The `ProtectedRoute` checks strict conditions (e.g., `user` exists) and renders `<Navigate to="/login" />` if false, or `<Outlet />` if true.

---

## 6. Data Fetching (Firebase)
**What is it?**
Retrieving data from an external source (Firestore database).

**Why it's used?**
To display dynamic content like Products, Gallery images, and Dashboard stats.

**Example from `src/pages/Gallery.jsx`**:
```javascript
import { collection, getDocs, query } from 'firebase/firestore';

// 1. Create a reference to the collection
const q = query(collection(db, 'projects'));

// 2. Await the snapshot
const snapshot = await getDocs(q);

// 3. Map over documents to format data
const formatted = snapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data() 
}));
```

---

## 7. Conditional Rendering
**What is it?**
Rendering different UI elements based on a condition (Boolean).

**Why it's used?**
To show a Loading Spinner while waiting for data, or to show a specific message if no data exists.

**Example from `src/pages/Gallery.jsx`**:
```javascript
{loading ? (
   // Determine if loading is true
   <Loader2 className="animate-spin" />
) : projects.length > 0 ? (
   // Else if projects exist
   <div className="grid ...">...</div>
) : (
   // Else (empty state)
   <p>No projects uploaded yet.</p>
)}
```

---

## 8. Lists & Keys
**What is it?**
Rendering multiple components from an array of data.

**Why it's used?**
To display grids of items (Cards, Grid rows).

**Example from `src/pages/admin/Dashboard.jsx`**:
```javascript
// .map() iterates over the stats array
{stats.map((stat, idx) => (
  // 'key' prop is CRITICAL for React to track elements efficiently
  <div key={idx} className="...">
    <span>{stat.label}</span>
  </div>
))}
```

---

## 9. Custom Styling Utils
**What is it?**
The use of `clsx` (or `classnames`) and `tailwind-merge`.

**Why it's used?**
To conditionally join class names and allow components to accept external `className` props without conflict.

**Example from `src/components/Section.jsx`**:
```javascript
className={clsx(
  "py-24",      // Default class
  background,   // Conditional/Variable class
  className     // External override props
)}
```
---

## What to Learn Next?
1. **Context API**: Check `src/lib/auth.js` (if it exists) or how global user state is managed.
2. **React Query / SWR**: For more advanced data fetching (caching, revalidation) instead of `useEffect`.
3. **Form Handling**: Look at `src/pages/admin/Login.jsx` or `AddProduct.jsx` to see how form state is managed.
