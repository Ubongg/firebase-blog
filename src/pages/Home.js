import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import BlogItem from "../components/BlogItem";

const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedBlog, setLastFetchedBlog] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Get reference
        const blogsRef = collection(db, "blogs");

        // Create a query
        const q = query(blogsRef, orderBy("timestamp", "desc"), limit(10));

        // Execute query
        const querySnap = await getDocs(q);

        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedBlog(lastVisible);

        const blogs = [];

        querySnap.forEach((doc) => {
          return blogs.push({
            id: doc.id,
            data: doc.data(),
          });
        });

        setBlogs(blogs);
        setLoading(false);
      } catch (error) {
        toast.error("Could not fetch blogs");
      }
    };

    fetchBlogs();
  }, []);

  // Pagination / Load More
  const onFetchMoreBlogs = async () => {
    try {
      // Get reference
      const blogsRef = collection(db, "blogs");

      // Create a query
      const q = query(
        blogsRef,
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedBlog),
        limit(10)
      );

      // Execute query
      const querySnap = await getDocs(q);

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedBlog(lastVisible);

      const blogs = [];

      querySnap.forEach((doc) => {
        return blogs.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setBlogs((prevState) => [...prevState, ...blogs]);
      setLoading(false);
    } catch (error) {
      toast.error("Could not fetch blogs");
    }
  };

  return (
    <div className="articles">
      <h1>Blog List</h1>
      {loading ? (
        <Spinner />
      ) : blogs && blogs.length > 0 ? (
        <>
          {blogs.map((blog) => (
            <BlogItem blog={blog.data} id={blog.id} key={blog.id} />
          ))}

          <br />
          <br />
          {lastFetchedBlog && (
            <p className="loadMore" onClick={onFetchMoreBlogs}>
              Load More
            </p>
          )}
        </>
      ) : (
        <p>No blogs to display</p>
      )}
    </div>
  );
};

export default Home;
