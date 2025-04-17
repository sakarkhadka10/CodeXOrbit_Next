// Sample blog post data for fallback when database posts are not available

export const posts = [
  {
    id: "1",
    title: "Getting Started with Next.js",
    shortDescription: "Learn the basics of Next.js and how to create your first app",
    author: "CodeX Team",
    date: "2024-01-15",
    coverImage: "/img/frontendbg.png",
    slug: "getting-started-with-nextjs",
    category: "Web Development",
    content: "# Getting Started with Next.js\n\nNext.js is a React framework that enables server-side rendering and static site generation...\n\n## Installation\n\n```bash\nnpx create-next-app@latest my-app\n```\n\nLearn more at [nextjs.org](https://nextjs.org)"
  },
  {
    id: "2",
    title: "Understanding React Hooks",
    shortDescription: "A comprehensive guide to React Hooks and their use cases",
    author: "CodeX Team",
    date: "2024-02-20",
    coverImage: "/img/frontendbg.png",
    slug: "understanding-react-hooks",
    category: "React",
    content: "# Understanding React Hooks\n\nReact Hooks were introduced in React 16.8 and have changed how we write React components...\n\n## useState\n\n```jsx\nconst [count, setCount] = useState(0);\n```\n\nLearn more at [reactjs.org](https://reactjs.org/docs/hooks-intro.html)"
  }
];