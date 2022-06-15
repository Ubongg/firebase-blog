import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import Spinner from "../components/Spinner";

const SingleBlog = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, "blogs", params.blogId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBlog(docSnap.data());
        setLoading(false);
      }
    };

    fetchBlog();
  }, [navigate, params.blogId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="blog-details">
      {blog && (
        <article>
          <h3>{blog.title}</h3>
          <p>added by {blog.author}</p>
          <div>{blog.body}</div>
        </article>
      )}
    </div>
  );
};

export default SingleBlog;
