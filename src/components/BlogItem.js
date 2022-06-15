import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon } from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon } from "../assets/svg/editIcon.svg";

function ListingItem({ blog, id, onEdit, onDelete }) {
  return (
    <div className="list">
      <div className="blog-preview" key={blog.id}>
        {onDelete && (
          <DeleteIcon
            className="removeIcon"
            fill="rgb(231, 76,60)"
            onClick={() => onDelete(blog.id)}
          />
        )}

        {onEdit && <EditIcon className="editIcon" onClick={() => onEdit(id)} />}
        <Link to={`/blogs/${id}`}>
          <h3>{blog.title}</h3>
        </Link>
        <p className="author">added by {blog.author}</p>
      </div>
    </div>
  );
}

export default ListingItem;
