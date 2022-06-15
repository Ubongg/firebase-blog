import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

const EditArticle = () => {
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });
  const [user, setUser] = useState("");

  const { title, body } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const params = useParams();
  const isMounted = useRef(true);

  // Redirect if blog is not user's
  useEffect(() => {
    if (blog && blog.userRef !== auth.currentUser.uid) {
      toast.error("You can not edit that blog");
      navigate("/");
    }
  });

  // Fetch blog to edit
  useEffect(() => {
    setLoading(true);
    const fetchBlog = async () => {
      const docRef = doc(db, "blogs", params.blogId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBlog(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exist");
      }
    };

    fetchBlog();
  }, [params.blogId, navigate]);

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user.displayName);
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/sign-in");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const formDataCopy = {
      ...formData,
      timestamp: serverTimestamp(),
      author: user,
    };

    // Update blog
    const docRef = doc(db, "blogs", params.blogId);
    await updateDoc(docRef, formDataCopy);
    setLoading(false);
    toast.success("Blog saved");
    navigate(`/blogs/${docRef.id}`);
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="create">
      <h2>Edit Existing Blog</h2>
      <form onSubmit={onSubmit}>
        <label>Blog title</label>
        <input
          type="text"
          id="title"
          required
          value={title}
          onChange={onChange}
        />
        <label>Blog body</label>
        <textarea
          type="text"
          required
          id="body"
          value={body}
          onChange={onChange}
        ></textarea>
        <button>Edit Blog</button>
      </form>
    </div>
  );
};

export default EditArticle;
