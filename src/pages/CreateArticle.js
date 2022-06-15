import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Spinner from "../components/Spinner";

const CreateArticle = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });
  const [user, setUser] = useState("");

  const { title, body } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true);

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

    const docRef = await addDoc(collection(db, "blogs"), formDataCopy);
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
      <h2>Add a New Blog</h2>
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
        <button>Add Blog</button>
      </form>
    </div>
  );
};

export default CreateArticle;
