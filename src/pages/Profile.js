import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import {
  updateDoc,
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import BlogItem from "../components/BlogItem";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

function Profile() {
  const auth = getAuth();
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState(null);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserBlogs = async () => {
      const blogsRef = collection(db, "blogs");

      const q = query(
        blogsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnap = await getDocs(q);

      let blogs = [];

      querySnap.forEach((doc) => {
        return blogs.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setBlogs(blogs);
      setLoading(false);
    };

    fetchUserBlogs();
  }, [auth.currentUser.uid]);

  const onLogout = () => {
    auth.signOut();
    navigate("/");
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onDelete = async (blogId) => {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "blogs", blogId));
      const updatedListings = blogs.filter((blog) => blog.id !== blogId);
      setBlogs(updatedListings);
      toast.success("Successfully deleted blog");
    }
  };

  const onEdit = (blogId) => navigate(`/edit-blog/${blogId}`);

  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">Hi {name}</p>
        <button type="button" className="logOut" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main>
        <Link to="/create-blog" className="createListing">
          <p>Create a new Blog</p>
          <img src={arrowRight} alt="arrow right" />
        </Link>

        {!loading && blogs?.length > 0 && (
          <>
            <p className="listingText">Your Blogs</p>
            <ul className="listingsList">
              {blogs.map((blog) => (
                <BlogItem
                  key={blog.id}
                  blog={blog.data}
                  id={blog.id}
                  onDelete={() => onDelete(blog.id)}
                  onEdit={() => onEdit(blog.id)}
                />
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}

export default Profile;
